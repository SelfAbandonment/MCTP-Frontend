---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0a14f3e5d4a911f180d5525400248c00
    ReservedCode1: dazHmJOHDjQhedjTUc3D2yYcjfWTCbGlOX37wU0Vujmhya27h3KpFJWDZa6+sW9L2IgB9LHVvvE3777LN2G9qfKQXKrY9XFolcbvA7GztAz/EPtDxjspedeLMtR1U9vroud92M/UdnpJPxvCWuTCJZTlYU7S/82ICLSRRlqmzxyS08NHASy1e1B+L3g=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0a14f3e5d4a911f180d5525400248c00
    ReservedCode2: dazHmJOHDjQhedjTUc3D2yYcjfWTCbGlOX37wU0Vujmhya27h3KpFJWDZa6+sW9L2IgB9LHVvvE3777LN2G9qfKQXKrY9XFolcbvA7GztAz/EPtDxjspedeLMtR1U9vroud92M/UdnpJPxvCWuTCJZTlYU7S/82ICLSRRlqmzxyS08NHASy1e1B+L3g=
---

# SkinPreviewSection.vue 说明

## 文件路径
`src/preview/components/SkinPreviewSection.vue`

## 文件用途
功能 C——皮肤预览 + 玩家基本信息组件：通过 Crafatar 展示头像 / 全身皮肤，支持「拖拽旋转」查看；断网或服务不可用时回退本地 SVG 像素头像，避免审核环境破图。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import skinFallback from '.../skin-fallback.svg'` | 本地像素头像兜底，断网也能显示。 |
| `AVATAR_URL` / `BODY_URL` | Crafatar URL 模板常量，后续换自建服务只改这里。 |
| `rotation` / `dragging` / `errored`（reactive，以 uuid 为键） | 按玩家分别记录旋转角度、拖拽起点、远端图是否失败。 |
| `onDown/onMove/onUp` | 指针拖拽按水平位移换算 `rotateY`（限 ±45°），松手回正；`setPointerCapture` 保证拖出区域仍跟手。 |
| `:style="{ transform: rotateY(...) }"` + `.is-dragging` | 非拖拽时 0.35s 过渡回正，拖拽中关闭过渡保证跟手。 |
| `@error="errored[uuid]=true"` + `v-if/v-else` | 远端图失败即切本地兜底图，杜绝破图。 |
| `width/height` + `loading="lazy"` + `draggable="false"` | 防布局抖动与图片拖拽干扰。 |
| `.preview-skin__hint` | 「拖拽旋转」操作提示。 |

## TODO 备注清单
- `TODO-BACKEND: 玩家真实数据（UUID / 入服时间 / 在线状态）待对接后端玩家信息接口`
- `TODO-ASSET: 若 Crafatar 在部分网络不可用，可替换为自建皮肤渲染地址（改 AVATAR_URL / BODY_URL）`

