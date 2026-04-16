# 项目完整说明

本文件用于把当前项目的核心设计集中写清，方便后续查看、交接和继续维护。

说明：

- 本文件是 `项目总说明`，用于统一理解项目整体设计。
- 当前状态判断仍以 `now.md` 为入口。
- 当前正式文件边界仍以 `current_effective_files.md` 为准。
- 若本文件与某一专题规则文件存在更细层面的差异，应优先以对应专题文件为准。
- 若说明文档与执行结果冲突，应优先以 `matching_engine.py` 与其直接消费的数据文件为准。

---

## 一、项目是什么

- 项目是一个 `趣味型领导人匹配测评`。
- 用户完成量表后，系统输出的不是单一学术分数，而是：
  - 用户画像
  - 最接近的领导人结果
- 当前更适合的正式表达是：
  - `风格最像谁`
  - `理念最像谁`
  - `综合最像谁`
  - `Top 3`
- 当前不适合把系统表述为：
  - 用户用少量特征就能被系统稳定、精确地命中到某一位领导人

当前阶段的正式判断是：

- `完整答卷场景：可用`
- `稀疏鲜明特征场景：仍不够稳`

---

## 二、当前应怎么看这个项目

如果是第一次进入项目，建议按以下顺序阅读：

1. `project_overview.md`
2. `now.md`
3. `current_effective_files.md`
4. `final_questions.md`
5. `item_id_mapping.md`
6. `item_dimension_mapping.json`
7. `docs/leaders/leader_coding_workflow.md`
8. `docs/leaders/leader_coding_guardrails.md`
9. `matching_principles.md`
10. `matching_algorithm.md`

---

## 三、项目是怎么演化到当前版本的

项目不是一步做成当前形态，而是经过了几轮压缩与重构：

### 1. 早期风格框架

- 最早有一套 `领导人风格 24 维` 的大框架。
- 这套框架把：
  - 自我形象
  - 认知加工
  - 世界观
  - 动机
  - 权力运用
  - 治理推进
  - 公共表达与动员
  都放在同一个风格量表里。

对应历史文件：

- `docs/process/project_handover_notes.md`
- `docs/research/dimension_review_worklog.md`

### 2. 执政理念框架

- 之后又单独梳理出一套 `执政理念 24 维` 结构。
- 重点覆盖：
  - 治理目标
  - 国家角色
  - 合法性
  - 社会关系
  - 改革哲学
  - 对外定位

对应历史文件：

- `docs/research/governing_ideology_structure.md`

### 3. 压缩为 34 维首发结构

- 随后把风格与理念体系压缩为 `34 维`：
  - 风格 `16 维`
  - 理念 `18 维`
- 这一阶段同时确定了：
  - 题目结构类型
  - 题型范围
  - 题目设计总则

对应历史文件：

- `docs/research/launch_version_34_dimensions.md`

### 4. 形成当前正式题单

- 在逐维度出题、三轮题单审查和补题后，最终形成当前正式版：`82 题`
- 相比 34 维阶段，当前正式题单又做了一个关键结构调整：
  - 风格中的 `12 政策愿景与方向建构`
  - 与 `14 意义动员与鼓舞性领导`
  - 在当前计分结构中合并为 `12+14`

当前正式题单文件：

- `final_questions.md`

---

## 四、当前正式量表结构

### 1. 题量

- 总题量：`82题`
- 领导人风格：`36题`
- 执政理念：`46题`

### 2. 当前计分单元

当前不是简单按 `82` 题逐题平铺理解，而是按 `35` 个计分单元理解：

- 风格维度：`15个`
- 理念维度：`18个`
- 板块级题：`2个`

其中两道板块级题是：

- `G10`：治理目标与公共价值分配
- `G26`：合法性来源优先级

### 3. 风格层当前维度

- `4 人格感召与魅力自我认知`
- `19 共同体代表性与身份领导`
- `15 认知复杂性与信息开放`
- `16 情绪调节与情绪使用方式`
- `17 他人信任与威胁知觉`
- `18 共同体边界意识与内群体优先`
- `5 权力主导与控制倾向`
- `6 参与协商与权力分享倾向`
- `7 决策介入时机与回避程度`
- `8 结构化推进与任务压强`
- `9 关系维护与人际关照`
- `10 组织建制与统筹能力取向`
- `11 政治斡旋与资源整合方式`
- `12+14 愿景建构与意义动员`
- `13 公共沟通与符号化表达`

### 4. 理念层当前维度

- `G1 秩序与安全优先观`
- `G2 发展与绩效优先观`
- `G3 公平与包容优先观`
- `G4 自由、权利与参与优先观`
- `G5 国家干预—市场关系观`
- `G6 国家—社会边界与协作观`
- `G7 国家能力与行政效能观`
- `G8 治理知识与决策依据观`
- `G9 程序—宪制合法性观`
- `G10 绩效合法性观`
- `G11 人民代表性与主体合法性观`
- `G12 多元差异与冲突观`
- `G13 共同体凝聚与整合观`
- `G14 改革方向与变革节奏观`
- `G15 传统—现代化关系观`
- `G16 主权与自主性观`
- `G17 对外合作—竞争取向`
- `G18 国际秩序立场与外部责任观`

### 5. 当前保留的题目结构类型

- `双极轴`
- `单极强度轴`
- `复合结构`
- `权衡分配结构`
- `类型/偏好结构`

### 6. 当前保留的正式题型

- `双端 Likert`
- `单端 Likert`
- `情境单选`
- `强制权衡`
- `点数分配`

---

## 五、题号系统怎么理解

当前同时存在三套编号：

### 1. `display_no`

- 前台显示题号
- 连续编号 `1-82`
- 在文档中也可理解为 `Q1-Q82`

### 2. `item_id`

- 后台稳定题号
- 风格题：`L01-L36`
- 理念题：`G01-G46`
- 这是程序、建库、匹配时的主键

### 3. `legacy_id`

- 历史题号
- 用于追踪旧文档、审查记录和历史版本

注意：

- 当前不改变题目顺序，只是重排编号系统
- 风格维度保留的是旧版维度编号，因此出现 `4 / 19 / 15 / 16 / 17...` 这种跨号现象是设计延续，不是编号错误

主参考文件：

- `item_id_mapping.md`
- `item_dimension_mapping.json`

---

## 六、题单是怎么定稿的

当前正式题单不是直接一次写完，而是经过三轮审查：

### 第一轮：结构与边界风险审查

- 看题目是否偏离维度核心
- 看是否与相邻维度重叠
- 看单题承载是否过弱

对应文件：

- `docs/research/question_review_round1.md`

### 第二轮：真实领导人模拟作答可行性审查

- 唯一标准是：题目能否较稳定地用于模拟真实领导人的作答
- 这一轮替换了早期编码性差的题，例如旧版 `4-2`、旧版 `9-4`

对应文件：

- `docs/research/question_review_round2.md`

### 第三轮：普通用户直接作答可行性审查

- 看普通用户是否能直接、自然地作答
- 只对少数表达过抽象的题做轻改

对应文件：

- `docs/research/question_review_round3.md`

当前正式理解是：

- 三轮审查已经完成
- `final_questions.md` 是当前唯一正式题单依据

---

## 七、领导人画像库是怎么设计的

### 1. 项目中的“领导人画像”到底是什么

- 它是 `用于匹配的代表性画像`
- 它不是对真实领导人的完整历史还原
- 画像对象不是“真实内心最深处”
- 而是：`在可得证据支持下，这位领导人在这道题上高概率会怎么答`

### 2. 当前人物库规模

- 第一批正式人物库：`17位`
- 统一 `leader_id` 见：`docs/leaders/leader_ids_batch_1.md`

### 3. 当前数据真源与再生成现状

- 当前程序实际使用的人物数据真源是：`leader_profiles/*/profile_data.json`
- 这些人物画像采用的是 `82题题目宇宙 + 按维度纳入题` 的设计，不要求单个人物答满 `82` 题
- 当前仓库中的 `generate_profiles.py` 与 `scripts/generate_batch1_profiles.py` 只覆盖部分人物，不能单独完整重建当前 17 人人物库
- 因此，继续维护时应把现有 `leader_profiles/` 产物视为当前真源，而不是把两份生成脚本误当成完整再生入口

### 4. 建库方法不是逐题硬填 82 题

当前正式规则是 `维度优先`：

1. 先判断该领导人的 `核心维度`
2. 再判断 `参考维度`
3. 再判断 `不纳入维度`
4. 入选维度下的题自动纳入
5. 板块级题单独判断

这意味着：

- 每位领导人的 `profile_data.json` 不一定会出现全部 `82` 题
- 没有出现在 `answers` 中的题，默认就是 `不纳入题`
- 这不是漏填，而是正式设计的一部分

### 5. 维度数量控制

- `核心维度` 必须控制在 `5-7个`
- `参考维度` 不设硬上限
- 但不能把“也许能判断”的维度全部塞进参考维度
- 如果参考维度过多、稀释人物特征，应收紧参考维度，而不是删核心维度下的题

### 6. 逐题记录要求

每一道被纳入的题都要记录：

- `item_id`
- `legacy_id`
- `tier`（`core` / `reference`）
- `value`
- `period`
- `evidence_type`
- `note`

### 7. 领导人目录结构

每位领导人目录下的固定文件包括：

- `profile_report.md`：说明型输出，供人工审阅
- `profile_data.json`：数据型输出，供程序使用
- `evidence_notes.md`：可选补充说明

### 8. 编码守则

必须遵守：

- 做的是 `高概率作答重建`，不是政治评价
- 敏感人物不自动中和
- 现任人物不自动保守编码
- 不确定不等于中间分
- 同一道题不能混用多个时期
- 选不出稳定时期就 `不纳入`

主参考文件：

- `docs/leaders/leader_coding_workflow.md`
- `docs/leaders/leader_coding_guardrails.md`
- `docs/leaders/leader_output_templates.md`
- `leader_profiles/`

---

## 八、匹配设计是怎么工作的

### 1. 基本对象

- 匹配不是在比维度坐标
- 匹配对象是：`用户答卷` vs `领导人模拟答卷`
- 基本单位是 `题目`

### 2. 题目层相似度

当前执行实现中：

- `Likert`：`1 - |用户答案 - 领导人答案| / 6`
- `单选/强制权衡`：相同记 `1`，不同记 `0`
- `点数分配`：`1 - 总差异 / 20`
- 若用户与领导人的题型值类型不一致（例如一方是点数分配字典、另一方不是），该题记为 `0`

### 3. 维度层相似度

- 同一维度下，取所有纳入题目的相似度平均值
- 其中两道板块级题对应的维度：`G_BLOCK_VALUES`、`G_BLOCK_LEGIT`
- 这两个板块级维度在层级计算前会再乘以 `0.6`

### 4. 核心题优先原则

- 先按领导人的 `核心题 / 参考题` 来加权理解
- 当前执行真源采用的是一版偏趣味项目导向的温和加权：
  - 对每个维度先按“在多少位领导人的报告中被列为核心维度”做轻量稀有度修正，采用三档权重而不是连续放大
  - 若该维度同时是该领导人的 `signature dimension`，且它又是核心维度，则其权重再乘 `1.5`
  - `基础得分 = 0.80 × 核心维度加权平均 + 0.20 × 参考维度加权平均`
- 对核心维度中的明显反向项，再做 `反向扣分`

### 5. 反向扣分与签名维度软惩罚

- 只针对 `核心维度`
- `严重不匹配`：核心维度相似度 `< 0.35`
- `中度不匹配`：核心维度相似度 `>= 0.35 且 < 0.55`
- 扣分公式：`0.20 × 严重不匹配率 + 0.08 × 中度不匹配率`
- 此外，`signature_dimensions.json` 中定义的招牌维度还会触发额外软惩罚：
  - 命中标准仍为签名核心维度相似度 `>= 0.55`
  - 未命中的签名维度越多，额外扣分越多
  - 当前不再使用硬性 `0.82` 截顶门槛

### 6. 三层结果

- `风格分`
- `理念分`
- `综合分`

其中：

- `综合分 = 0.5 × 风格分 + 0.5 × 理念分`

### 7. 排序规则

- 当前执行实现按以下顺序排序：
  1. `综合分`
  2. `风格分`
  3. `理念分`

### 8. 当前必须知道的一个现实情况

- 当前仓库中的：

  - `matching_algorithm.md`

给出的是与执行真源同步的说明；当前执行真源仍依赖：

  - `matching_engine.py`
  - `run_matching_tests.py`（兼容层入口）
  - `leader_profiles/*/profile_data.json`
  - `item_dimension_mapping.json`
  - `signature_dimensions.json`

也就是说：

- 文档层负责解释当前真源
- 代码层和数据层负责定义当前真源本身

后续继续维护时，必须确保说明文档跟随真源更新，而不是再允许两套口径长期并存。

主参考文件：

- `matching_principles.md`
- `matching_algorithm.md`
- `matching_engine.py`
- `run_matching_tests.py`

---

## 九、测试体系当前状态

- 旧的 `matching_test_*` 文件链路已从当前维护基线中移除。
- 这意味着：
  - 旧测试输入、旧测试结果、旧测试总结不再作为当前正式依据
  - 当前仓库仍保留匹配真源，但暂时不保留一套正式测试评估口径
- 继续维护时，应把“重建新的测试与校验体系”视为后续优先事项，而不是继续沿用旧测试结论

## 十、当前系统判断

- 当前仍保留 `82题正式题单 + 17位部分作答人物库 + 匹配计算真源`
- 当前仓库已新增 `website/` 下的网站 Beta 预发布前端实现，四段式流程、题型支持、结果解释与本地化素材已经落地
- 旧测试体系已清理，但当前已建立一套新的 Beta 自动验证基线
- 因此，不应继续把旧文档中的通过率、人物簇结论和稳定性判断当作当前正式口径
- 当前可以明确确认的是：匹配规则已按趣味项目目标做了一轮软化，但其效果仍需后续重新验证

---

## 十一、哪些文件是正式依据，哪些只是历史材料

### 1. 当前正式依据

- 总状态入口：`now.md`
- 项目总说明：`project_overview.md`
- 正式文件边界：`current_effective_files.md`
- 正式题单：`final_questions.md`
- 编号与映射：`item_id_mapping.md`、`item_dimension_mapping.json`
- 当前数据真源：`leader_profiles/`、`docs/leaders/leader_ids_batch_1.md`、`signature_dimensions.json`
- 当前执行真源：`matching_engine.py`
- 兼容层入口：`run_matching_tests.py`
- 当前网站实现：`website/`
- 网站 Alpha 工作计划：`docs/website/website_alpha_work_plan.md`
- 网站 Beta 发布计划：`docs/website/website_beta_release_plan.md`
- 网站 Beta 验证状态：`docs/website/website_beta_validation_status.md`
- 同步说明：`docs/leaders/leader_coding_workflow.md`、`docs/leaders/leader_coding_guardrails.md`、`docs/leaders/leader_output_templates.md`、`matching_principles.md`、`matching_algorithm.md`
- 辅助/局部生成文件：`generate_profiles.py`、`scripts/generate_batch1_profiles.py`、`item_neutral_defaults.json`
- 规划文件：`docs/website/website_design_spec.md`

### 2. 历史/过程材料

以下文件有参考价值，但不应直接当作当前正式状态：

- `docs/process/project_handover_notes.md`
- `docs/research/dimension_review_worklog.md`
- `docs/research/governing_ideology_structure.md`
- `docs/research/launch_version_34_dimensions.md`
- `docs/research/dimension_questions_design.md`
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

---

## 十二、当前继续维护时最容易犯的误解

### 1. 误以为人物画像必须答满 82 题

- 错
- 正式规则是：先定核心/参考/不纳入维度，未纳入题默认不进入 `answers`

### 2. 误以为项目目标是“精确命中某一个领导人”

- 错
- 当前正式输出是分层相似结果，不是强命中承诺

### 3. 误以为第二阶段构造答卷测试就是产品真实命中率

- 错
- 旧测试体系已移除，当前不再沿用第二阶段测试口径

### 4. 误以为历史文件仍然等于当前正式设计

- 错
- 历史文件用于理解演化过程，不用于直接替代当前正式基线

### 5. 误以为当前系统已经是所有场景都稳定的终版

- 错
- 旧测试体系已移除，当前不再保留可直接支持该结论的正式评估基线

---

## 十三、一句话总括

这个项目当前的正式形态，可以理解为：

- 一个以 `82 题正式题单 + 17 位部分作答领导人画像库 + Python 匹配引擎真源 + 三层匹配结果` 为核心的趣味型领导人匹配测评系统；
- 它已经包含一个可运行的网站 Beta 预发布前端实现；
- 当前匹配真源仍保留；
- 规则已按趣味项目目标做过一轮软化；
- 但旧测试体系已清理，正式评估口径需要后续重建。
