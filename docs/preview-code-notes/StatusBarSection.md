---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_084df296d4a911f1a0da525400393706
    ReservedCode1: nfXXIYTzoq7l7wp432zG1ZPT2QuJ1i+sc4pNCeQeSQzf3d1acRIi6I0I7gmfVgjTg9aupRuxC6zWQLY2svDFALm7xLGeMEv3RipRg063bnO2S4hM4eQZupEA9xcgYXDd3iHQPinUXaXBONBtPt3dze8zM697xZ7i+2AK2kvLbWdUxofGDFKRoZDqHoE=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_084df296d4a911f1a0da525400393706
    ReservedCode2: nfXXIYTzoq7l7wp432zG1ZPT2QuJ1i+sc4pNCeQeSQzf3d1acRIi6I0I7gmfVgjTg9aupRuxC6zWQLY2svDFALm7xLGeMEv3RipRg063bnO2S4hM4eQZupEA9xcgYXDd3iHQPinUXaXBONBtPt3dze8zM697xZ7i+2AK2kvLbWdUxofGDFKRoZDqHoE=
---

# StatusBarSection.vue 说明

## 文件路径
`src/preview/components/StatusBarSection.vue`

## 文件用途
功能 A——服务器状态条组件：展示「在线人数 / TPS / 游戏版本」，接入后端 `GET /api/v1/health/` 做 10 秒轮询；后端提供在线人数/TPS 则展示真实值，否则回退模拟值并标注；在线人数与 TPS 滚入视口时数字滚动计数，状态点脉冲提示「实时」。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `useServiceHealth({ intervalMs: 10000 })` | 复用现有 composable 做 10 秒轮询，自带挂载/卸载与页面隐藏暂停。 |
| `pickNum(obj, keys)` | 兼容后端不同字段命名的数字读取（online / players_online / tps 等）。 |
| `resolvedOnline` / `resolvedTps` / `version` | 优先真实值、缺失回退 `mock`，保证无数据时不空白。 |
| `isLive` / `statusText` | 标注「实时数据 / 数值模拟 / 接口离线 / 连接中」。 |
| `displayOnline` / `displayTps` ref + `IntersectionObserver` | 滚入视口才触发首次计数。 |
| `animateCount(targetRef, end, duration, decimals)` | rAF + easeOutCubic 数字平滑增长。 |
| `watch([resolvedOnline, resolvedTps])` | 轮询拿到新真实值时重新计数。 |
| `.preview-status__live` + `preview-status-pulse` | 在线脉冲点。 |

## TODO 备注清单
- `TODO-BACKEND: 已接入 GET /api/v1/health/ 十秒轮询；请后端补充 online / tps 字段即可展示真实值`

