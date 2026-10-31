/**
 * 文件用途：预览页路由定义
 * 作用：把 /preview 预览页接入主路由表，仅追加、不删改现有路由；
 *       骨架阶段为单页，后续可在 children 中扩展二级页面（玩法详情等）。
 */

export default [
  {
    path: '/preview',
    name: 'preview',
    // 原因：改为路由懒加载（动态 import）。原先静态 import 会把预览页的组件、GSAP ScrollTrigger、
    //       主题 CSS 与 Google Fonts 字体请求一起打进主站入口包，访问现有任何页面都会加载它们；
    //       懒加载后只有进入 /preview 才下载预览页代码，现有页面体积与行为完全不受影响。
    // 作用：预览页入口组件统一放在 src/preview/ 下，便于与现有框架代码隔离。
    component: () => import('@/preview/PreviewApp.vue'),
    // 原因：现有 App.vue 依据 route.meta.chrome 决定是否渲染全局 Header/Footer；
    // 预览页需要独立全屏（开场动画 + 自建顶部导航），因此关闭全局框架，避免两套导航叠加。
    // 作用：meta.chrome=false 时，App.vue 中 SiteHeader/SiteFooter 均不渲染。
    meta: { chrome: false, title: '机械动力官网预览 · MCTP' },
  },
]
