---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_068086f9d4a911f180d5525400248c00
    ReservedCode1: uG6yUb0jJmpwZIVMz/WwWGNpMqpfiyhsceT2syHvZr1T6YTzLB4YLjj+aJis88VRnbMb7khcLlSS1orhsb7feQPGGibnaQJcSCOjtbDwjfeDD+4xZ5+g7K5lmrg1uP/Y7VIeQJnIHkPoEG0rwF4FgZk2EG7uCoHNuLdvRZaXTDufiDEAZaHujTyXbC8=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_068086f9d4a911f180d5525400248c00
    ReservedCode2: uG6yUb0jJmpwZIVMz/WwWGNpMqpfiyhsceT2syHvZr1T6YTzLB4YLjj+aJis88VRnbMb7khcLlSS1orhsb7feQPGGibnaQJcSCOjtbDwjfeDD+4xZ5+g7K5lmrg1uP/Y7VIeQJnIHkPoEG0rwF4FgZk2EG7uCoHNuLdvRZaXTDufiDEAZaHujTyXbC8=
---

# FeatureShowcaseSection.vue 说明

## 文件路径
`src/preview/components/FeatureShowcaseSection.vue`

## 文件用途
玩法介绍区组件（第二阶段填充）：以「终末地基建工业风 / 机械动力」为主题，展示服务器玩法亮点总述文字与 4 个特性卡片。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `features` 数组 | 特性卡片数据（图标 / 标题 / 描述），图标用文字符号避免引入图标库；文案为通用占位，待服主定制。 |
| `introText` | 玩法总述文案，放在特性卡片之前给访客整体印象。 |
| `v-for` 渲染 `.preview-feature__card` | 遍历特性卡片，2 列网格（窄屏 1 列）；`v-reveal="i*0.08"` 错峰入场、`v-tilt="8"` 鼠标 3D 倾斜。 |
| `.preview-feature__icon` | 铜黄描边文字符号，工业感视觉。 |
| `.preview-feature__note` | 显式 TODO-CONTENT 提示，注明文案待服主定制。 |

## TODO 备注清单
- `TODO-CONTENT: 玩法文案为通用 MC 服务器文案，待服主定制（组件数据区 features / introText）`
