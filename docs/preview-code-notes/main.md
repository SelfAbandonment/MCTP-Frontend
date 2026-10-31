# main.js 说明（已回退为零改动）

## 文件路径
`src/main.js`

## 当前状态
**本分支不再修改 `src/main.js`**，与 `develop` 完全一致。

## 为什么回退
- 之前为了让 `v-reveal` / `v-tilt` 在预览页各组件复用，在 `main.js` 里做了全局注册，这会让主站入口无条件引入 GSAP ScrollTrigger，并且属于对现有框架的改动。
- 现改为在用到指令的组件里局部注册：

```js
import { reveal as vReveal } from '@/preview/directives/reveal'
import { tilt as vTilt } from '@/preview/directives/tilt'
```

  `<script setup>` 中以 `v` 开头的驼峰变量会被 Vue 自动识别为指令，模板里 `v-reveal` / `v-tilt` 写法不变。

## TODO 备注清单
- 无
