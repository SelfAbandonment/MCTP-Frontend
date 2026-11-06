<script setup>
/**
 * 文件用途：新版站点外壳（所有新页面的父路由组件）
 * 层级（z-index 由低到高）：页面 router-view → 导航栏 100 → 首次加载页 1100 → 转场 1200
 * 流程：打开网站 → BootLoader 播放并真实追踪加载 → 满格后播放转场（加载页 → 索引页）：
 *       透过 M 看到的是加载页，屏幕盖黑时卸载加载页，A 揭开的就是索引页；
 *       转场结束 booted=true → 导航栏掉落回弹 + 索引页入场动画。
 *       之后的页面跳转全部由路由守卫调用同一个转场。
 * 管理员：左下角有"切换成普通玩家视角"开关（AdminViewSwitch.vue），只影响显示，不改变权限。
 * 页脚：除索引页外（索引页是全屏 3D，自己在最后一段放精简页脚），所有页面最下面自动加 SiteFooter。
 */
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/utils/errors'
import BootLoader from './components/BootLoader.vue'
import PageTransition from './components/PageTransition.vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import AdminViewSwitch from './components/AdminViewSwitch.vue'
import { booted } from './siteState'
import { playTransition } from './composables/usePageTransition'
import './styles/site.css'

const route = useRoute()
const auth = useAuthStore()
const showLoader = ref(!booted.value)
const sessionError = ref('')
const pageRef = ref(null)

async function restoreSession() {
  sessionError.value = ''
  try {
    await auth.ensureSession()
  } catch (error) {
    sessionError.value = errorMessage(error, '无法读取玩家资料，请重试')
  }
}

onMounted(restoreSession)

function onBootDone() {
  playTransition({
    onCovered: () => (showLoader.value = false),
  }).then(() => (booted.value = true))
}
</script>

<template>
  <div class="site-shell">
    <a
      class="site-skip"
      href="#site-content"
      @click.prevent="pageRef?.focus()"
    >跳至内容</a>
    <div
      v-if="sessionError && route.name !== 'home'"
      class="session-error"
      role="alert"
    >
      {{ sessionError }}
      <button
        type="button"
        class="mc-btn is-ghost"
        @click="restoreSession"
      >
        重试
      </button>
    </div>
    <div
      id="site-content"
      ref="pageRef"
      tabindex="-1"
    >
      <router-view />
    </div>
    <SiteFooter v-if="route.name !== 'index'" />
    <SiteNav :show="booted" />
    <AdminViewSwitch v-if="booted" />
    <BootLoader
      v-if="showLoader"
      @done="onBootDone"
    />
    <PageTransition />
  </div>
</template>

<style scoped>
.site-skip {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1300;
  transform: translateY(-200%);
  background: var(--brass);
  color: var(--ink);
  padding: 10px 16px;
}
.site-skip:focus {
  transform: none;
}
.session-error {
  position: fixed;
  top: 110px;
  left: 5%;
  z-index: 101;
  padding: 16px;
  background: var(--casing-lo);
  color: var(--brass-hi);
}
#site-content:focus {
  outline: none;
}
</style>
