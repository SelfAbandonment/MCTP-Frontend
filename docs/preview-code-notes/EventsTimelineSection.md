---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0bea56c3d4a911f1a0da525400393706
    ReservedCode1: 8/k8TsAInmaTgFqzbzo74utY7CrhzZ3kVz7Vnrt7+fmisBablJNkl8WJOyGUu/D5J633MwZih9L+EwK2lF7WP5mkSDpUaY7c+BpkA297MKAe8y8whIzl3XYiOVq6wUNW96lwWtYK5VrWTFeuOTfAd7AqLVTttVGMue6F20jtfT0FjLTvZQVwSmvKrjY=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0bea56c3d4a911f1a0da525400393706
    ReservedCode2: 8/k8TsAInmaTgFqzbzo74utY7CrhzZ3kVz7Vnrt7+fmisBablJNkl8WJOyGUu/D5J633MwZih9L+EwK2lF7WP5mkSDpUaY7c+BpkA297MKAe8y8whIzl3XYiOVq6wUNW96lwWtYK5VrWTFeuOTfAd7AqLVTttVGMue6F20jtfT0FjLTvZQVwSmvKrjY=
---

# EventsTimelineSection.vue 说明

## 文件路径
`src/preview/components/EventsTimelineSection.vue`

## 文件用途
功能 F——活动预告与历史时间线组件：以纵向时间线展示活动；每条可点击展开详情，预告类展开后显示「报名入口」占位，形成功能闭环演示。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `RAW_EVENTS` 数组 | 活动原始数据（日期 / 标题 / 描述 / 报名链接 `link`），不再手写类型。 |
| `today` + `events = RAW_EVENTS.map(...)` | 按本地日期自动计算 `type`：日期 ≥ 今天为 `upcoming`（预告），否则 `past`（已结束），避免过期活动仍显示「预告」。 |
| `openIndex` + `toggle(i)` | 单开手风琴：点击头部展开/收起该条详情，避免同时展开过多。 |
| `aria-expanded` | 折叠按钮无障碍状态。 |
| `.preview-events__item::before` | 竖线连接时间轴；最后一条不画。 |
| `.preview-events__dot.--upcoming / --past` | 预告=铜黄实心，历史=灰描边。 |
| `.preview-events__chevron` | 展开箭头，展开时旋转 90°。 |
| `.preview-events__signup` | 预告类展开后的报名按钮：`link` 为空时显示「报名入口（占位）」并拦截点击（hash 路由下 `href="#"` 会跳回首页），填入后显示「立即报名」。 |

## TODO 备注清单
- `TODO-BACKEND: 活动数据为模拟数据，待对接后端活动接口（建议返回 title / date / desc / link）`
- `TODO-BACKEND: 报名入口链接待补，当前为占位 #`

