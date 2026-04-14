import json
from pathlib import Path
from math import isclose

ROOT = Path('/root/workspace/query')
PROFILES = ROOT / 'leader_profiles'
ITEM_MAP = json.loads((ROOT / 'item_dimension_mapping.json').read_text())

leaders = [p for p in PROFILES.iterdir() if p.is_dir() and p.name != '_template']

def item_similarity(user_val, lead_val):
    if isinstance(user_val, dict) and isinstance(lead_val, dict):
        keys = sorted(set(user_val) | set(lead_val))
        diff = sum(abs(user_val.get(k,0)-lead_val.get(k,0)) for k in keys)
        return max(0.0, 1 - diff / 20.0)
    if isinstance(user_val, str) or isinstance(lead_val, str):
        return 1.0 if user_val == lead_val else 0.0
    return max(0.0, 1 - abs(float(user_val) - float(lead_val)) / 6.0)

def layer_score(user_answers, leader_obj, layer):
    # group by dimension
    by_dim = {}
    for item_id, meta in leader_obj['answers'].items():
        if item_id not in ITEM_MAP:
            continue
        if ITEM_MAP[item_id]['layer'] != layer:
            continue
        if item_id not in user_answers:
            continue
        dim = ITEM_MAP[item_id]['dimension_id']
        sim = item_similarity(user_answers[item_id]['value'], meta['value'])
        by_dim.setdefault(dim, {'tier': meta['tier'], 'vals': []})
        by_dim[dim]['vals'].append(sim)
    core_dims=[]; ref_dims=[]
    for dim,info in by_dim.items():
        avg = sum(info['vals'])/len(info['vals'])
        if info['tier']=='core':
            core_dims.append(avg)
        else:
            ref_dims.append(avg)
    core_avg = sum(core_dims)/len(core_dims) if core_dims else 0.0
    ref_avg = sum(ref_dims)/len(ref_dims) if ref_dims else 0.0
    base = 0.8*core_avg + 0.2*ref_avg
    severe = sum(1 for x in core_dims if x < 0.35)
    moderate = sum(1 for x in core_dims if 0.35 <= x < 0.55)
    denom = len(core_dims) if core_dims else 1
    penalty = 0.25*(severe/denom) + 0.10*(moderate/denom)
    final = max(0.0, base - penalty)
    return {
        'core_avg': core_avg,
        'ref_avg': ref_avg,
        'core_count': len(core_dims),
        'ref_count': len(ref_dims),
        'severe': severe,
        'moderate': moderate,
        'score': final,
    }

def rank_for_user(user_leader_id):
    user_obj = json.loads((PROFILES / user_leader_id / 'profile_data.json').read_text())
    user_answers = user_obj['answers']
    rows=[]
    for lp in leaders:
        obj = json.loads((lp / 'profile_data.json').read_text())
        style = layer_score(user_answers, obj, 'style')
        ideology = layer_score(user_answers, obj, 'ideology')
        overall = 0.5*style['score'] + 0.5*ideology['score']
        rows.append({
            'leader_id': obj['leader_id'],
            'leader_name': obj['leader_name'],
            'style': style['score'],
            'ideology': ideology['score'],
            'overall': overall,
            'core_avg': (style['core_avg']+ideology['core_avg'])/2,
            'severe': style['severe'] + ideology['severe'],
        })
    def sort_key(r):
        return (-r['overall'], -r['core_avg'], r['severe'], -r['style'], -r['ideology'])
    rows.sort(key=sort_key)
    return rows

results = []
for lp in sorted(leaders, key=lambda p: p.name):
    ranked = rank_for_user(lp.name)
    top3 = ranked[:3]
    pos = next((i+1 for i,r in enumerate(ranked) if r['leader_id']==lp.name), None)
    style_rank = next((i+1 for i,r in enumerate(sorted(ranked, key=lambda r:(-r['style'],-r['core_avg'],r['severe']))) if r['leader_id']==lp.name), None)
    ide_rank = next((i+1 for i,r in enumerate(sorted(ranked, key=lambda r:(-r['ideology'],-r['core_avg'],r['severe']))) if r['leader_id']==lp.name), None)
    results.append({
        'leader_id': lp.name,
        'overall_rank': pos,
        'style_rank': style_rank,
        'ideology_rank': ide_rank,
        'top3': top3,
    })

out = ROOT / 'matching_test_results_round1.md'
lines = ['# 第一阶段：17人自我回归测试结果','', '说明：将每位领导人的 `profile_data.json` 直接作为用户答卷输入匹配程序，检查是否能回归到自己。','']
strong=acceptable=fail=0
for r in results:
    if r['overall_rank']==1:
        status='强通过'; strong+=1
    elif (r['style_rank']==1 or r['ideology_rank']==1) and r['overall_rank']<=3:
        status='可接受'; acceptable+=1
    else:
        status='不通过'; fail+=1
    lines.append(f"## {r['leader_id']}")
    lines.append(f"- 综合排名：{r['overall_rank']}")
    lines.append(f"- 风格排名：{r['style_rank']}")
    lines.append(f"- 理念排名：{r['ideology_rank']}")
    lines.append(f"- 判定：{status}")
    lines.append('- 综合 Top 3：')
    for t in r['top3']:
        lines.append(f"  - {t['leader_id']} | overall={t['overall']:.3f} | style={t['style']:.3f} | ideology={t['ideology']:.3f}")
    lines.append('')
lines.append('## 汇总')
lines.append(f'- 强通过：{strong}')
lines.append(f'- 可接受：{acceptable}')
lines.append(f'- 不通过：{fail}')
out.write_text('\n'.join(lines))
print(f'wrote {out}')
print(f'strong={strong} acceptable={acceptable} fail={fail}')
