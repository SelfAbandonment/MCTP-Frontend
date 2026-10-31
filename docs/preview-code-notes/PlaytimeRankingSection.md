---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0931c7fbd4a911f1a0da525400393706
    ReservedCode1: RB9KsUJLTfzvvZGMckSUN6dV0ERUD78X3vbDhrjq0mMHvqFdaezdgW+2l1MbMAzs4sGGNW3OdpGi2/zwB77/kVHNdbcGUKGipxl9XybJIGlyBtkcL3ejZ8lH2+J2zSM5eeadZOCd/SbThqLe467heOClqA/MVI/saVUxnIV3n8ZUkIIav6BQFP2vD/k=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0931c7fbd4a911f1a0da525400393706
    ReservedCode2: RB9KsUJLTfzvvZGMckSUN6dV0ERUD78X3vbDhrjq0mMHvqFdaezdgW+2l1MbMAzs4sGGNW3OdpGi2/zwB77/kVHNdbcGUKGipxl9XybJIGlyBtkcL3ejZ8lH2+J2zSM5eeadZOCd/SbThqLe467heOClqA/MVI/saVUxnIV3n8ZUkIIav6BQFP2vD/k=
---

# PlaytimeRankingSection.vue 说明

## 文件路径
`src/preview/components/PlaytimeRankingSection.vue`

## 文件用途
功能 B——在线时长排行榜组件：以排行榜样式展示在线时长 Top 玩家（模拟数据）。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `ranking` 数组 | 排行榜模拟数据（排名 / 玩家名 / 在线小时数），后端排行接口未接入。 |
| `formatHours(h)` | 将小时数转为「X 天 X 小时」文本，更符合玩家阅读习惯。 |
| `.preview-rank__row.--top` | 前三名行背景加深 + 铜黄排名数字，突出荣誉感。 |
| `.preview-rank__note` | TODO-BACKEND 提示，注明待对接后端排行接口。 |

## TODO 备注清单
- `TODO-BACKEND: 排行数据为模拟数据，待对接后端在线时长排行接口（建议返回玩家名 + 在线时长字段）`

