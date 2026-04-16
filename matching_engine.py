"""Current Python matching engine.

This module is the canonical Python execution truth for the current matching
logic. Other scripts, validation entrypoints, and future tooling should import
from here instead of relying on legacy file naming.
"""

import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path('/root/workspace/query')
PROFILES = ROOT / 'leader_profiles'
ITEM_MAP = json.loads((ROOT / 'item_dimension_mapping.json').read_text())
SIGNATURE = json.loads((ROOT / 'signature_dimensions.json').read_text())
leaders = [p for p in PROFILES.iterdir() if p.is_dir() and p.name != '_template']

core_counts = Counter()
for lp in leaders:
    report = (lp / 'profile_report.md').read_text()
    for line in report.splitlines():
        if line.startswith('- 核心维度：'):
            raw = line.split('：', 1)[1].strip().rstrip('。')
            parts = [p.strip() for p in re.split(r'[；,，、]\s*', raw) if p.strip()]
            for p in parts:
                if '12+14' in p:
                    dim = 'L12_14'
                elif 'G' in p:
                    m = re.search(r'G(\d+)', p)
                    dim = 'G' + m.group(1) if m else p
                else:
                    m = re.search(r'维度\s*(\d+)', p)
                    dim = 'L' + m.group(1) if m else p
                core_counts[dim] += 1
            break


def dim_weight(dim):
    c = core_counts.get(dim, 1)
    if c <= 2:
        return 1.15
    if c <= 4:
        return 1.08
    return 1.0


def item_similarity(u, l):
    if isinstance(u, dict) or isinstance(l, dict):
        if isinstance(u, dict) and isinstance(l, dict):
            keys = sorted(set(u) | set(l))
            diff = sum(abs(u.get(k, 0) - l.get(k, 0)) for k in keys)
            return max(0.0, 1 - diff / 20.0)
        return 0.0
    if isinstance(u, str) or isinstance(l, str):
        return 1.0 if u == l else 0.0
    return max(0.0, 1 - abs(float(u) - float(l)) / 6.0)


def block_multiplier(dim):
    return 0.6 if dim in {'G_BLOCK_VALUES', 'G_BLOCK_LEGIT'} else 1.0


def layer_score(user_answers, leader_obj, layer):
    by_dim = {}
    sig_dims = set(SIGNATURE.get(leader_obj['leader_id'], []))
    for item_id, meta in leader_obj['answers'].items():
        if item_id not in ITEM_MAP or ITEM_MAP[item_id]['layer'] != layer:
            continue
        if item_id not in user_answers:
            continue
        dim = ITEM_MAP[item_id]['dimension_id']
        sim = item_similarity(user_answers[item_id], meta['value'])
        by_dim.setdefault(dim, {'tier': meta['tier'], 'vals': []})
        by_dim[dim]['vals'].append(sim)
    core = []
    ref = []
    for dim, info in by_dim.items():
        avg = sum(info['vals']) / len(info['vals'])
        avg *= block_multiplier(dim)
        if info['tier'] == 'core':
            w = dim_weight(dim) * (1.5 if dim in sig_dims else 1.0)
            core.append((avg, w, dim in sig_dims))
        else:
            w = dim_weight(dim)
            ref.append((avg, w))
    core_avg = sum(v * w for v, w, _ in core) / sum(w for _, w, _ in core) if core else 0.0
    ref_avg = sum(v * w for v, w in ref) / sum(w for _, w in ref) if ref else 0.0
    base = 0.80 * core_avg + 0.20 * ref_avg
    severe = sum(1 for v, _, _ in core if v < 0.35)
    moderate = sum(1 for v, _, _ in core if 0.35 <= v < 0.55)
    denom = len(core) if core else 1
    penalty = 0.20 * (severe / denom) + 0.08 * (moderate / denom)
    sig_total = sum(1 for _, _, s in core if s)
    sig_hits = sum(1 for v, _, s in core if s and v >= 0.55)
    sig_penalty = 0.08 * ((sig_total - sig_hits) / sig_total) if sig_total else 0.0
    return max(0.0, base - penalty - sig_penalty)


def rank_user_answers(user_answers):
    rows = []
    for lp in leaders:
        obj = json.loads((lp / 'profile_data.json').read_text())
        style = layer_score(user_answers, obj, 'style')
        ideology = layer_score(user_answers, obj, 'ideology')
        overall = 0.5 * style + 0.5 * ideology
        rows.append({'leader_id': obj['leader_id'], 'style': style, 'ideology': ideology, 'overall': overall})
    rows.sort(key=lambda r: (-r['overall'], -r['style'], -r['ideology']))
    return rows
