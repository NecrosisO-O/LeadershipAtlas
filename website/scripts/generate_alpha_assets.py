from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
WEB_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = WEB_ROOT / "src" / "data" / "generated"


QUESTION_RE = re.compile(r"\*\*(?:题|板块题).*?\[`(?P<item_id>[A-Z]\d{2})` / `Q(?P<display>\d+)`\]")
OPTION_RE = re.compile(r"^(?:-\s*)?([A-D])\.\s*(.+)$")


def slug_to_monogram(leader_id: str) -> str:
    parts = [part[0].upper() for part in leader_id.split("_") if part]
    return "".join(parts[:3])


def clean_text(text: str) -> str:
    return text.replace("**", "").strip()


def normalize_question_type(type_line: str) -> str:
    if type_line.startswith("单端 Likert"):
        return "likert-single"
    if type_line.startswith("双端 Likert"):
        return "likert-bipolar"
    if type_line.startswith("情境单选题"):
        return "scenario-single"
    if type_line.startswith("强制权衡题"):
        return "forced-choice"
    if type_line.startswith("点数分配题"):
        return "point-allocation"
    raise ValueError(f"Unknown question type: {type_line}")


def parse_scale_labels(type_line: str) -> tuple[str | None, str | None]:
    pair_match = re.search(r"（([^（）]+)\s+—\s+([^（）]+)）", type_line)
    if pair_match:
        return pair_match.group(1).strip(), pair_match.group(2).strip()

    pair_match = re.search(r"左端\s*=\s*([^，）]+).*右端\s*=\s*([^）]+)", type_line)
    if pair_match:
        return pair_match.group(1).strip(), pair_match.group(2).strip()

    return None, None


def clean_quote_lines(lines: list[str]) -> list[str]:
    cleaned = []
    for line in lines:
        line = line.rstrip()
        if not line.startswith(">"):
            continue
        line = line[1:].strip()
        cleaned.append(line)
    return cleaned


def extract_prompt_and_options(question_type: str, quote_lines: list[str], type_line: str) -> tuple[str, str | None, str | None, list[dict], int | None]:
    lines = [line for line in quote_lines if line]
    options = []
    left_label, right_label = parse_scale_labels(type_line)

    for line in lines:
        option_match = OPTION_RE.match(line)
        if option_match:
            options.append({"id": option_match.group(1), "label": option_match.group(1), "text": option_match.group(2).strip()})

    if question_type == "likert-bipolar":
        for line in lines:
            if line.startswith("左端："):
                left_label = line.split("：", 1)[1].strip()
            if line.startswith("右端："):
                right_label = line.split("：", 1)[1].strip()
        prompt_lines = [
            line
            for line in lines
            if not line.startswith("左端：")
            and not line.startswith("右端：")
            and not OPTION_RE.match(line)
        ]
        prompt = "\n".join(prompt_lines).strip() or "请在以下两端之间选择最接近你观点的位置："
        return prompt, left_label, right_label, [], None

    if question_type in {"scenario-single", "forced-choice"}:
        prompt_lines = [line for line in lines if not OPTION_RE.match(line)]
        prompt = "\n".join(prompt_lines).strip()
        return prompt, None, None, options, None

    if question_type == "point-allocation":
        prompt_lines = [line for line in lines if not OPTION_RE.match(line)]
        prompt = "\n".join(prompt_lines).strip()
        total_points = 10
        total_match = re.search(r"(\d+)\s*分制", type_line)
        if total_match:
            total_points = int(total_match.group(1))
        return prompt, None, None, options, total_points

    prompt = "\n".join(lines).strip()
    return prompt, left_label, right_label, [], None


def parse_questions() -> list[dict]:
    content = (ROOT / "final_questions.md").read_text()
    item_map = json.loads((ROOT / "item_dimension_mapping.json").read_text())

    current_layer = None
    current_section = ""
    lines = content.splitlines()
    questions = []

    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("## "):
            heading = line[3:].strip()
            if heading in {"领导人风格", "执政理念"}:
                current_layer = "style" if heading == "领导人风格" else "ideology"
        if line.startswith("### "):
            current_section = line[4:].strip()

        match = QUESTION_RE.match(line)
        if not match:
            i += 1
            continue

        item_id = match.group("item_id")
        block = [line]
        j = i + 1
        while j < len(lines):
            next_line = lines[j]
            if QUESTION_RE.match(next_line) or next_line.startswith("### ") or next_line.startswith("## "):
                break
            block.append(next_line)
            j += 1

        quote_lines = clean_quote_lines(block[1:])
        type_line = next((entry.split("：", 1)[1].strip() for entry in block if entry.startswith("- 题型：")), "")
        normalized_type = normalize_question_type(type_line)
        prompt, left_label, right_label, options, total_points = extract_prompt_and_options(normalized_type, quote_lines, type_line)
        mapped = item_map[item_id]

        question = {
            "id": item_id,
            "displayNo": mapped["display_no"],
            "legacyId": mapped["legacy_id"],
            "layer": current_layer,
            "section": current_section,
            "dimensionId": mapped["dimension_id"],
            "dimensionName": clean_text(mapped["dimension_name"]),
            "type": normalized_type,
            "prompt": prompt,
            "leftLabel": left_label,
            "rightLabel": right_label,
            "options": options,
            "totalPoints": total_points,
            "scaleMin": 1 if normalized_type.startswith("likert") else None,
            "scaleMax": 7 if normalized_type.startswith("likert") else None,
        }
        questions.append(question)
        i = j

    questions.sort(key=lambda entry: entry["displayNo"])
    return questions


def build_dimension_name_map(item_map: dict) -> dict[str, str]:
    name_map: dict[str, str] = {}
    for meta in item_map.values():
        name = clean_text(meta["dimension_name"])
        dim_id = meta["dimension_id"]
        name_map[name] = dim_id
    return name_map


def parse_core_dimensions(report_path: Path, dimension_name_map: dict[str, str]) -> list[str]:
    for line in report_path.read_text().splitlines():
        if line.startswith("- 核心维度："):
            raw = line.split("：", 1)[1].strip().rstrip("。")
            parts = [part.strip() for part in re.split(r"[；,，、]\s*", raw) if part.strip()]
            dims = []
            for part in parts:
                part = clean_text(part)
                if part in dimension_name_map:
                    dims.append(dimension_name_map[part])
                    continue
                if "12+14" in part:
                    dims.append("L12_14")
                elif "G" in part:
                    m = re.search(r"G(\d+)", part)
                    dims.append(f"G{m.group(1)}" if m else part)
                else:
                    m = re.search(r"维度\s*(\d+)", part)
                    if m:
                        dims.append(f"L{m.group(1)}")
                    elif part in dimension_name_map:
                        dims.append(dimension_name_map[part])
                    else:
                        dims.append(part)
            return dims
    return []


def parse_profiles() -> list[dict]:
    profiles_root = ROOT / "leader_profiles"
    item_map = json.loads((ROOT / "item_dimension_mapping.json").read_text())
    dimension_name_map = build_dimension_name_map(item_map)
    profiles = []

    for directory in sorted(path for path in profiles_root.iterdir() if path.is_dir() and path.name != "_template"):
        profile_data = json.loads((directory / "profile_data.json").read_text())
        core_dimensions = parse_core_dimensions(directory / "profile_report.md", dimension_name_map)
        slim_answers = {
            item_id: {
                "tier": meta["tier"],
                "value": meta["value"],
            }
            for item_id, meta in profile_data["answers"].items()
        }

        profiles.append(
            {
                "leaderId": profile_data["leader_id"],
                "leaderName": profile_data["leader_name"],
                "monogram": slug_to_monogram(profile_data["leader_id"]),
                "coreDimensions": core_dimensions,
                "answers": slim_answers,
            }
        )

    return profiles


def write_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    write_json(OUT_DIR / "questions.json", parse_questions())
    write_json(OUT_DIR / "profiles.json", parse_profiles())
    write_json(OUT_DIR / "item-dimension-map.json", json.loads((ROOT / "item_dimension_mapping.json").read_text()))
    write_json(OUT_DIR / "signature-dimensions.json", json.loads((ROOT / "signature_dimensions.json").read_text()))


if __name__ == "__main__":
    main()
