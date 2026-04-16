from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
WEBSITE_ROOT = Path(__file__).resolve().parents[1]
GENERATED = WEBSITE_ROOT / "src" / "data" / "generated"
VALIDATION = WEBSITE_ROOT / "src" / "data" / "validation" / "beta_validation_cases.json"

sys.path.insert(0, str(ROOT))
import matching_engine as python_engine  # noqa: E402


item_map = json.loads((GENERATED / "item-dimension-map.json").read_text())
profiles = json.loads((GENERATED / "profiles.json").read_text())
signature = json.loads((GENERATED / "signature-dimensions.json").read_text())
validation_cases = json.loads(VALIDATION.read_text())

BLOCK_DIMENSIONS = {"G_BLOCK_VALUES", "G_BLOCK_LEGIT"}
core_counts: dict[str, int] = {}
profiles_by_id = {profile["leaderId"]: profile for profile in profiles}

for profile in profiles:
    for dim in profile["coreDimensions"]:
        core_counts[dim] = core_counts.get(dim, 0) + 1


def dim_weight(dimension_id: str) -> float:
    count = core_counts.get(dimension_id, 1)
    if count <= 2:
        return 1.15
    if count <= 4:
        return 1.08
    return 1.0


def is_point_allocation(value: Any) -> bool:
    return isinstance(value, dict)


def item_similarity(user_value: Any, leader_value: Any) -> float:
    if is_point_allocation(user_value) or is_point_allocation(leader_value):
        if is_point_allocation(user_value) and is_point_allocation(leader_value):
            keys = sorted(set(user_value) | set(leader_value))
            diff = sum(abs(user_value.get(key, 0) - leader_value.get(key, 0)) for key in keys)
            return max(0.0, 1 - diff / 20.0)
        return 0.0
    if isinstance(user_value, str) or isinstance(leader_value, str):
        return 1.0 if user_value == leader_value else 0.0
    return max(0.0, 1 - abs(float(user_value) - float(leader_value)) / 6.0)


def layer_score(user_answers: dict[str, Any], profile: dict[str, Any], layer: str) -> float:
    by_dimension: dict[str, dict[str, Any]] = {}
    sig_dimensions = set(signature.get(profile["leaderId"], []))

    for item_id, meta in profile["answers"].items():
        mapped = item_map.get(item_id)
        if not mapped or mapped["layer"] != layer or item_id not in user_answers:
            continue
        dimension_id = mapped["dimension_id"]
        bucket = by_dimension.setdefault(dimension_id, {"tier": meta["tier"], "vals": []})
        bucket["vals"].append(item_similarity(user_answers[item_id], meta["value"]))

    core = []
    ref = []
    for dimension_id, info in by_dimension.items():
        avg = sum(info["vals"]) / len(info["vals"])
        if dimension_id in BLOCK_DIMENSIONS:
            avg *= 0.6
        if info["tier"] == "core":
            signature_hit = dimension_id in sig_dimensions
            core.append((avg, dim_weight(dimension_id) * (1.5 if signature_hit else 1.0), signature_hit))
        else:
            ref.append((avg, dim_weight(dimension_id)))

    core_avg = sum(value * weight for value, weight, _ in core) / sum(weight for _, weight, _ in core) if core else 0.0
    ref_avg = sum(value * weight for value, weight in ref) / sum(weight for _, weight in ref) if ref else 0.0
    severe = sum(1 for value, _, _ in core if value < 0.35)
    moderate = sum(1 for value, _, _ in core if 0.35 <= value < 0.55)
    denominator = len(core) if core else 1
    penalty = 0.2 * (severe / denominator) + 0.08 * (moderate / denominator)
    sig_total = sum(1 for _, _, sig in core if sig)
    sig_hits = sum(1 for value, _, sig in core if sig and value >= 0.55)
    sig_penalty = 0.08 * ((sig_total - sig_hits) / sig_total) if sig_total else 0.0
    return max(0.0, 0.8 * core_avg + 0.2 * ref_avg - penalty - sig_penalty)


def rank_website_answers(user_answers: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for profile in profiles:
        style = layer_score(user_answers, profile, "style")
        ideology = layer_score(user_answers, profile, "ideology")
        rows.append(
            {
                "leader_id": profile["leaderId"],
                "style": style,
                "ideology": ideology,
                "overall": 0.5 * style + 0.5 * ideology,
            }
        )
    rows.sort(key=lambda row: (-row["overall"], -row["style"], -row["ideology"]))
    return rows


def extract_answers(profile: dict[str, Any]) -> dict[str, Any]:
    return {item_id: meta["value"] for item_id, meta in profile["answers"].items()}


def compare_rankings(case_id: str, answers: dict[str, Any], tolerance: float = 2e-2) -> tuple[bool, str]:
    python_rows = python_engine.rank_user_answers(answers)
    website_rows = rank_website_answers(answers)

    python_top1 = python_rows[0]["leader_id"]
    website_top1 = website_rows[0]["leader_id"]
    if python_top1 != website_top1:
        return False, f"{case_id}: top1 mismatch python={python_top1} website={website_top1}"

    python_top3 = {row["leader_id"] for row in python_rows[:3]}
    website_top3 = {row["leader_id"] for row in website_rows[:3]}
    if python_top3 != website_top3:
        return False, f"{case_id}: top3 set mismatch python={sorted(python_top3)} website={sorted(website_top3)}"

    python_top = python_rows[0]
    website_top = website_rows[0]
    for metric in ("overall", "style", "ideology"):
        if not math.isclose(python_top[metric], website_top[metric], rel_tol=tolerance, abs_tol=tolerance):
            return False, f"{case_id}: {metric} mismatch for top result python={python_top[metric]:.6f} website={website_top[metric]:.6f}"

    return True, f"{case_id}: top1/top3 and top-result scores aligned"


def validate_self_regression() -> list[tuple[bool, str]]:
    results = []
    for case in validation_cases["self_regression"]:
        leader_id = case["leaderId"]
        answers = extract_answers(profiles_by_id[leader_id])
        ok, message = compare_rankings(f"self:{leader_id}", answers)
        if ok:
            top = rank_website_answers(answers)[0]["leader_id"]
            ok = top == leader_id
            message = f"self:{leader_id}: expected {leader_id}, got {top}"
        results.append((ok, message))
    return results


def validate_boundary_pairs() -> list[tuple[bool, str]]:
    results = []
    for case in validation_cases["boundary_pairs"]:
        left_answers = extract_answers(profiles_by_id[case["left"]])
        right_answers = extract_answers(profiles_by_id[case["right"]])
        left_ok, left_msg = compare_rankings(f"boundary:{case['left']}", left_answers)
        right_ok, right_msg = compare_rankings(f"boundary:{case['right']}", right_answers)
        results.append((left_ok, left_msg))
        results.append((right_ok, right_msg))
    return results


def validate_answer_encoding() -> list[tuple[bool, str]]:
    results = []
    question_type_map = {question["id"]: question["type"] for question in json.loads((GENERATED / "questions.json").read_text())}
    for case in validation_cases["answer_encoding"]:
        ok = True
        details = []
        for item_id, value in case["answers"].items():
            qtype = question_type_map[item_id]
            if qtype.startswith("likert") and not isinstance(value, int):
                ok = False
                details.append(f"{item_id} expected int")
            elif qtype in {"scenario-single", "forced-choice"} and not isinstance(value, str):
                ok = False
                details.append(f"{item_id} expected option id string")
            elif qtype == "point-allocation":
                if not isinstance(value, dict):
                    ok = False
                    details.append(f"{item_id} expected object")
                elif sum(value.values()) != 10:
                    ok = False
                    details.append(f"{item_id} expected total 10")
        results.append((ok, f"encoding:{case['caseId']}: {'; '.join(details) if details else case['description']}"))
    return results


def main() -> None:
    suites = {
        "self_regression": validate_self_regression(),
        "boundary_pairs": validate_boundary_pairs(),
        "answer_encoding": validate_answer_encoding(),
    }

    failed = []
    for suite_name, suite_results in suites.items():
        print(f"## {suite_name}")
        for ok, message in suite_results:
            status = "PASS" if ok else "FAIL"
            print(f"- [{status}] {message}")
            if not ok:
                failed.append(message)

    if failed:
        print(f"\nValidation failed: {len(failed)} issue(s)")
        sys.exit(1)

    print("\nAll beta validation suites passed.")


if __name__ == "__main__":
    main()
