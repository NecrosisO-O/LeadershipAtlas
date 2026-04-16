# 当前有效文件清单

本文件用于明确：当前继续维护时，哪些文件属于运行真源，哪些属于同步说明，哪些属于辅助文件、规划文件或历史材料。

说明：

- 本文件是当前正式文件边界与层级关系的唯一清单。
- 如与其他文档表述冲突，以本文件的分层为准。
- 当前统一原则是：`可执行代码 > 程序直接消费的数据文件 > 同步说明文档 > 规划文档 > 历史材料`。

## 一、当前运行真源

### 状态入口与边界说明
- `now.md`
- `project_overview.md`
- `current_effective_files.md`

### 题单与映射真源
- `final_questions.md`
- `item_id_mapping.md`
- `item_dimension_mapping.json`

### 人物库与当前数据真源
- `leader_profiles/`
- `docs/leaders/leader_ids_batch_1.md`
- `signature_dimensions.json`

### 当前执行真源
- `matching_engine.py`：当前 Python 匹配引擎真源
- `run_matching_tests.py`：兼容层入口，当前转发到 `matching_engine.py`

## 二、同步说明文档

以下文件用于解释当前真源，但若与执行结果冲突，仍以后者为准：

- `matching_principles.md`
- `matching_algorithm.md`
- `docs/leaders/leader_coding_workflow.md`
- `docs/leaders/leader_coding_guardrails.md`
- `docs/leaders/leader_output_templates.md`
- `docs/leaders/leader_batch_1_progress.md`
- `docs/leaders/leader_batch_review_checklist.md`

## 三、辅助与局部生成文件

以下文件当前保留为辅助或局部生成用途：

- `generate_profiles.py`：当前只覆盖部分领导人，不能单独完整重建 17 人人物库
- `scripts/generate_batch1_profiles.py`：当前只覆盖部分领导人，不能单独完整重建 17 人人物库
- `item_neutral_defaults.json`：当前保留，但现有匹配脚本未直接消费

## 四、当前网站实现

- `website/`：当前网站 Beta 预发布前端实现
- `docs/website/website_alpha_work_plan.md`：网站 Alpha 实施计划与阶段执行基线
- `docs/website/website_alpha_status.md`：网站 Alpha 当前完成度与后续迭代边界说明
- `docs/website/website_beta_release_plan.md`：网站 Beta 发布前工作计划
- `docs/website/website_beta_status.md`：网站 Beta 预发布阶段状态说明
- `docs/website/website_beta_release_notes.md`：网站 Beta 发布说明与对外口径基线
- `docs/website/website_beta_validation_checklist.md`：网站 Beta 人工验证清单
- `docs/website/website_beta_validation_status.md`：网站 Beta 自动验证与当前校验结论

## 五、规划文件

以下文件属于后续实现规划，不代表当前仓库中已经存在对应实现：

- `docs/website/website_design_spec.md`

## 六、历史过程文件

以下文件当前主要保留为过程记录、历史材料或参考来源，不应直接当作当前正式依据：

- `docs/research/dimension_questions_design.md`
- `docs/research/dimension_review_worklog.md`
- `docs/research/governing_ideology_structure.md`
- `docs/research/launch_version_34_dimensions.md`
- `matching_test_plan.md`
- `matching_test_summary.md`
- `matching_test_results_round1.md`
- `matching_test_results_round2.md`
- `matching_test_results_round2b.md`
- `matching_test_results_round3.md`
- `matching_nearest_neighbors.md`
- `matching_test_inputs_round2.json`
- `matching_test_inputs_round2b.json`
- `matching_test_inputs_round3.json`
- `docs/research/question_review_round1.md`
- `docs/research/question_review_round2.md`
- `docs/research/question_review_round3.md`
- `docs/research/third_round_item_supplement_plan.md`
- `docs/process/project_handover_notes.md`

## 七、使用原则

- 总状态说明以 `now.md` 为入口。
- 项目整体设计说明以 `project_overview.md` 为准。
- 文件边界与层级判断以 `current_effective_files.md` 为准。
- 涉及匹配执行细节时，以 `matching_engine.py` 与其直接消费的数据文件为准。
- 涉及网站当前实现时，以 `website/` 下代码、`docs/website/website_beta_release_plan.md` 与 `docs/website/website_beta_validation_status.md` 为准。
- 旧测试文件当前只保留为历史材料，不再作为继续维护时的正式评估依据。
- 规划文件仅用于后续实现，不应用来倒推当前仓库已实现状态。
- 历史过程文件仅在需要追溯设计过程、审查过程或早期试验逻辑时参考。
