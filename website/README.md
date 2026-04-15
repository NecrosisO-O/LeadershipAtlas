# Leadership Atlas Website

这是项目的 Alpha 阶段前端实现目录。

## 当前范围

- 四段式流程：欢迎、引导、答题、结果
- `82` 题全部接入
- `5` 类题型全部支持
- 纯前端运行的匹配引擎
- 占位肖像与占位解释文案

## 开发命令

```bash
npm install
npm run generate:data
npm run dev
```

## 构建命令

```bash
npm run build
```

## 数据来源

- `src/data/generated/questions.json`：由 `final_questions.md` 生成
- `src/data/generated/profiles.json`：由 `leader_profiles/*/profile_data.json` 生成
- `src/data/generated/item-dimension-map.json`：同步自 `item_dimension_mapping.json`
- `src/data/generated/signature-dimensions.json`：同步自 `signature_dimensions.json`

重新生成上述数据：

```bash
npm run generate:data
```
