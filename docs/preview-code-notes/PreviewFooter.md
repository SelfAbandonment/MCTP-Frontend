---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_04aa7077d4a911f1a0da525400393706
    ReservedCode1: t5xBJAMeZFC734Rjyx+3VFutyAIVFGx6MYujNE+riYfrJlY4lQNo9FHzviXJlxp4K7G2faT3UnARxSkNbGm8896ZDgoy8WA9YCV0nHZTuzygYNFTRrqbsvvqeQRy+vq8RZUgyu0sEUduFGVHVWAXjbRJ5WsenEd2ZKNg254p1Yw2oK+ZJniO2Iq+HOw=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_04aa7077d4a911f1a0da525400393706
    ReservedCode2: t5xBJAMeZFC734Rjyx+3VFutyAIVFGx6MYujNE+riYfrJlY4lQNo9FHzviXJlxp4K7G2faT3UnARxSkNbGm8896ZDgoy8WA9YCV0nHZTuzygYNFTRrqbsvvqeQRy+vq8RZUgyu0sEUduFGVHVWAXjbRJ5WsenEd2ZKNg254p1Yw2oK+ZJniO2Iq+HOw=
---

# PreviewFooter.vue 说明

## 文件路径
`src/preview/components/PreviewFooter.vue`

## 文件用途
预览页 footer 组件：展示服务器标语、社交入口图标位（Discord / QQ群 / B站 / 邮箱 / 社区 / Wiki）、合规免责声明、版权与备案占位，并预留访问统计挂载位置。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `socials` 数组 | 社交入口占位数据（平台 key / 标签 / href 占位）。 |
| `v-for` + `<template v-if>` 内联 SVG | 按平台渲染通用图标（非官方 logo，规避商标），图标 + 文字。 |
| `.preview-footer__disclaimer` | 合规免责声明：非官方、与 Mojang / Microsoft 无关。 |
| `.preview-footer` `padding-bottom: calc(40px + env(safe-area-inset-bottom))` | 兼容 iPhone 刘海屏安全区。 |
| `preview-muted` 提示行 | 备案号 / 版权主体待补。 |
| `TODO-ANALYTICS` 注释位 | 预留访问统计（如 Cloudflare Web Analytics）挂载点。 |

## TODO 备注清单
- `TODO-BACKEND: 外部链接地址待补（当前 href 为空字符串；为空时拦截点击、不开新标签页，填入后自动恢复 `_blank` 打开）`
- `TODO-BACKEND: 备案号 / 版权主体待补`
- `TODO-CONTENT: 服务器标语为占位文案`
- `TODO-ANALYTICS: 可在此挂载访问统计脚本`
