---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0afb5c84d4a911f1a0da525400393706
    ReservedCode1: fgL/nF2hGWaIQDr2HJ3IfRmTraIDFlxmErbRocqHWf4PJLEa/qFiwsPDLp0FEDHQth3QtkF6hfj70BBsVM9Ac6DVD6DVJwkmJFNT1NflaWQfh7++foDbMhIBvbkzkQwtTTI9Of2Ez+XnBZopdVypwhJslZaxcAZuTKgqrn0J4rmTNFJTVVN+Nxim+FQ=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0afb5c84d4a911f1a0da525400393706
    ReservedCode2: fgL/nF2hGWaIQDr2HJ3IfRmTraIDFlxmErbRocqHWf4PJLEa/qFiwsPDLp0FEDHQth3QtkF6hfj70BBsVM9Ac6DVD6DVJwkmJFNT1NflaWQfh7++foDbMhIBvbkzkQwtTTI9Of2Ez+XnBZopdVypwhJslZaxcAZuTKgqrn0J4rmTNFJTVVN+Nxim+FQ=
---

# RulesFaqSection.vue 说明

## 文件路径
`src/preview/components/RulesFaqSection.vue`

## 文件用途
功能 E——服务器规则 / FAQ 折叠面板组件：以原生 `details/summary` 实现零依赖折叠面板，展示 5 条规则与 3 条常见问题。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `rules` 数组 | 服务器规则数据（5 条通用占位文案）。 |
| `faqs` 数组 | 常见问题数据（3 条通用占位文案）。 |
| `<details>/<summary>` | 原生折叠面板，无需 JS 即可展开收起；`v-for` 批量渲染。 |
| `.preview-fold__summary::before` | 隐藏原生三角并自绘 `+` / `−` 提示符（`details[open]` 切换），工业感更强。 |
| `.preview-fold__note` | TODO-CONTENT 提示，规则 / FAQ 文案待服主定制。 |

## TODO 备注清单
- `TODO-CONTENT: 规则与 FAQ 文案为通用占位，待服主定制（组件数据区 rules / faqs）`
