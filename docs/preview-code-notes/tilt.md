# tilt.js（v-tilt 指令）说明

## 文件路径
`src/preview/directives/tilt.js`

## 文件用途
预览页 3D 卡片倾斜指令：鼠标在卡片上移动时按相对位置做轻微 `perspective + rotateX/rotateY`，离开回正；仅桌面精细指针 + 非减少动效启用。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `prefersReducedMotion` / `hasFinePointer` | 减少动效用户与触屏设备跳过，保证可用性与无障碍。 |
| `binding.value` | 可传数字（最大角度，默认 8）或 `{ max }` 对象。 |
| `onMove` | 把鼠标位置换算为 -0.5~0.5，`rAF` 合并高频更新后设置 `transform`。 |
| `onLeave` | 清空 transform 回正。 |
| `el._tiltCleanup` + `unmounted` | 卸载时解绑事件与取消 rAF，避免内存泄漏。 |
| CSS `transition: transform 0.12s` | 让倾斜跟随更顺滑（在指令内内联设置）。 |

## 注册与使用
- 注册：各组件内局部注册 `import { tilt as vTilt } from '@/preview/directives/tilt'`（不再改 `src/main.js`）。
- 使用：`<article v-tilt="8">`（玩法卡片 / 下载项 / STAFF 卡片）。
- 皮肤卡片未使用（避免与拖拽旋转冲突）。

## TODO 备注清单
- 无
