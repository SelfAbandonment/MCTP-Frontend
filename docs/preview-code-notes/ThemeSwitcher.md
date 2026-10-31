---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_011eff5fd4a911f180d5525400248c00
    ReservedCode1: wDLVHrEzkS4xGVlkRl8rGcsWfptHrROH4iCYC2xBHppBCBefGOCGeEGT9ECxhtjJW2+ry9m+07FOOHMZ7722ARzWFKxOhJrcs7nuzxs/eRaqVO0A8csAcPTpP7d4OqiIFL/mNJViQuG1QRTi+JiSXxuncTQlzqALwu6M6vJJVXKCUln1Lup+qSI8cYk=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_011eff5fd4a911f180d5525400248c00
    ReservedCode2: wDLVHrEzkS4xGVlkRl8rGcsWfptHrROH4iCYC2xBHppBCBefGOCGeEGT9ECxhtjJW2+ry9m+07FOOHMZ7722ARzWFKxOhJrcs7nuzxs/eRaqVO0A8csAcPTpP7d4OqiIFL/mNJViQuG1QRTi+JiSXxuncTQlzqALwu6M6vJJVXKCUln1Lup+qSI8cYk=
---

# ThemeSwitcher.vue 说明

## 文件路径
`src/preview/components/ThemeSwitcher.vue`

## 文件用途
预览页顶部右侧主题切换组件：渲染「黑夜 / 白天 / 护眼」三个按钮，点击切换主题并高亮当前项。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `const { theme } = storeToRefs(themeStore)` | 解包当前主题 ref，模板中用于高亮判断 `theme === item.key`。 |
| `const themeList = Object.values(themeStore.THEMES)` | 从 store 的主题枚举生成按钮列表；THEMES 为普通常量对象，无需响应式解包，直接用 store 实例属性读取。 |
| `v-for="item in themeList"` | 动态渲染三主题按钮，后续新增主题只需扩展 THEMES 即可自动出按钮。 |
| `:class="{ '--active': theme === item.key }"` + `:aria-pressed` | 当前主题高亮（铜黄底），并提供无障碍状态标识。 |
| `@click="themeStore.setTheme(item.key)"` | 点击触发 store 切换主题并持久化。 |

## TODO 备注清单
- 无（三主题切换已实做；后续可扩展自定义主题）。
