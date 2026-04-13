# 真实领导人画像输出目录

本目录用于存放后续子agent为每位真实领导人建立的模拟答卷输出。

目录规则：

- 每位领导人对应一个独立子文件夹。
- 子文件夹名称统一使用 `leader_id`，采用英文小写加下划线形式。
- 每位领导人文件夹内固定使用以下文件名：
  - `profile_report.md`：说明型输出
  - `profile_data.json`：数据型输出
  - `evidence_notes.md`：补充证据说明（可选）

示例：

```text
leader_profiles/
  README.md
  _template/
    profile_report.md
    profile_data.json
    evidence_notes.md
  chun_doo_hwan/
    profile_report.md
    profile_data.json
    evidence_notes.md
```
