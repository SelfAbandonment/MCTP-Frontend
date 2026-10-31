---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0209d4a6d4a911f1a0da525400393706
    ReservedCode1: /GgRytjrfaXBW0jPPGfN0DcQkTGlpPPrxkEH6sdBUa2vyEe97+pgnBZJ16oCiCZpufy9o11O11+6++zfnpY1heHHRpqX2dT2B6f72dwyH7WlET8L7Wxf23duOZTcMpZI7sXa+zqoHKrYLFxeHav0Wl3b+MsSLefjglT77nrMvLotbcsGUUlYqklqF5M=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0209d4a6d4a911f1a0da525400393706
    ReservedCode2: /GgRytjrfaXBW0jPPGfN0DcQkTGlpPPrxkEH6sdBUa2vyEe97+pgnBZJ16oCiCZpufy9o11O11+6++zfnpY1heHHRpqX2dT2B6f72dwyH7WlET8L7Wxf23duOZTcMpZI7sXa+zqoHKrYLFxeHav0Wl3b+MsSLefjglT77nrMvLotbcsGUUlYqklqF5M=
---

# AnnouncementSection.vue 说明

## 文件路径
`src/preview/components/AnnouncementSection.vue`

## 文件用途
预览页主界面第一屏的公告区：以横向轮播展示公告（自动播放、悬停/聚焦暂停、圆点与左右切换），并显示「最后更新于」时间戳。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `announcements` 数组 | 模拟公告数据（标签 / 标题 / 摘要 / 日期），待对接后端。 |
| `lastUpdate` | `computed`：自动取所有公告中最新的日期作为「最后更新于」，新增公告无需手动同步。 |
| `current` / `go/next/prev` | 当前索引与循环切换逻辑。 |
| `paused` | 悬停/聚焦时暂停自动播放，避免用户看不清就被切走。 |
| `setInterval(4500)` + `onBeforeUnmount(clearInterval)` | 每 4.5 秒自动切下一条；离开页面清除定时器防泄漏；`prefers-reduced-motion` 时不自动播放。 |
| `.preview-announce__track` + `transform: translateX(-current*100%)` | flex 横排轨道位移实现滑动轮播，带 0.45s 过渡。 |
| `.preview-announce__arrow / __dot` | 上一条 / 下一条箭头与圆点指示，当前项铜黄拉长。 |
| `.preview-announce__updated` | 「最后更新于」小字。 |

## TODO 备注清单
- `TODO-BACKEND: 公告为模拟数据，待对接后端公告接口（含标题 / 摘要 / 标签 / 日期）`

