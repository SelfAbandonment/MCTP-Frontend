---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_02eb69ced4a911f180d5525400248c00
    ReservedCode1: NhUy8m0yA5iCodCSC77wufQeiQYUY23ByNz14OaDdwoLVyYUAyJ/Y5vKkfxc2RkGhCaM0EkLfNZATzqAnR8R+DtGQEXgebYtGYS3NZkEezxF7MKE9rfboDPFki/FeygN1ewkaGWdxAw52OscaD1xvZDdltpGMdF+eoTvpOK+eCONaA88y8ZoDGiyaqI=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_02eb69ced4a911f180d5525400248c00
    ReservedCode2: NhUy8m0yA5iCodCSC77wufQeiQYUY23ByNz14OaDdwoLVyYUAyJ/Y5vKkfxc2RkGhCaM0EkLfNZATzqAnR8R+DtGQEXgebYtGYS3NZkEezxF7MKE9rfboDPFki/FeygN1ewkaGWdxAw52OscaD1xvZDdltpGMdF+eoTvpOK+eCONaA88y8ZoDGiyaqI=
---

# AdBannerSection.vue 说明

## 文件路径
`src/preview/components/AdBannerSection.vue`

## 文件用途
预览页主界面第一屏的广告区：横版主展示位 + 横版/竖版两套构图参考（占位 SVG），供服主挑选风格。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import adWide / adTall` | 两套占位构图（横版 1200×300 / 竖版 600×900）走 Vite 资源导入。 |
| `variants` 数组 | 两套构图参考数据，供下方缩略图 v-for 渲染。 |
| `<img class="preview-ad__banner">` | 横版主展示位，宽度 100% 自适应容器，带 `width/height` + `loading="lazy"` 防 CLS。 |
| `.preview-ad__refs` | 两套构图参考缩略图（统一高度裁切），供服主挑横版/竖版。 |

## TODO 备注清单
- `TODO-ASSET: 广告素材待补；当前为横版/竖版两套占位构图（ad-banner-wide.svg / ad-banner-tall.svg）`