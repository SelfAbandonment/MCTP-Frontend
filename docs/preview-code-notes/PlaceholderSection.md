---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_03b9a16ad4a911f1a0da525400393706
    ReservedCode1: wCpjO0CMcHFG6SL/WkKLCL89fOH/8pMPzqzTqhVylJNF0EDmkL6URK9JQXck5KN2VYQVingQDGZ7/QSfch966TOjfsNW8AWoK/Z3H+9dwqDnCXtKbuC6XciqdY/lzz31paEAr4d+jTSPalfw3oXgaSsMgodZmSbVxqxlgHEkQCPQIC19IiljBlUjyUw=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_03b9a16ad4a911f1a0da525400393706
    ReservedCode2: wCpjO0CMcHFG6SL/WkKLCL89fOH/8pMPzqzTqhVylJNF0EDmkL6URK9JQXck5KN2VYQVingQDGZ7/QSfch966TOjfsNW8AWoK/Z3H+9dwqDnCXtKbuC6XciqdY/lzz31paEAr4d+jTSPalfw3oXgaSsMgodZmSbVxqxlgHEkQCPQIC19IiljBlUjyUw=
---

# PlaceholderSection.vue 说明

## 文件路径
`src/preview/components/PlaceholderSection.vue`

## 文件用途
预览页通用占位区块组件：玩法介绍、下载区、功能区等「下一阶段填充」的区块统一使用，保证骨架阶段页面结构完整且视觉统一。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `defineProps({ title, note })` | 接收区块标题与占位说明文字，父组件（PreviewApp）按区块传入不同文案。 |
| `.preview-placeholder__box` | 虚线边框占位内容框，突出「待填充」语义。 |
| `.preview-placeholder__icon` | 占位图标（文字块样式），铜黄强调色；不使用 emoji，保持克制视觉。 |

## TODO 备注清单
- `TODO-ASSET: 本区块内容待填充（含素材/数据/组件），当前仅占位展示`（模板注释内）
- `TODO-FEATURE: 功能区后续拆分为在线人数/TPS/版本状态条、在线时长排行榜、皮肤预览+基本信息、服务器规则/FAQ、活动预告与时间线、玩家留言、STAFF 团队展示`（见 PreviewApp.vue 注释）

