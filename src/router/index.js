import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BusinessPage from '@/components/BusinessPage.vue'
import { coverScreen } from '@/site/composables/usePageTransition'
import { coverWith, pickTransition, revealPending } from '@/site/transitions'
import { localRedirect } from '@/utils/errors'

const DEFAULT_TITLE = 'MCTP · MCREATOPIA'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/site/pages/IndexPage.vue'),
    meta: { title: DEFAULT_TITLE },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/site/pages/HomePage.vue'),
    meta: { requiresAuth: true, title: '个人中心 · MCTP' },
  },
  {
    path: '/dashboard',
    redirect: '/home',
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/site/pages/FeedbackPage.vue'),
    meta: { title: '反馈 · MCTP' },
  },
  {
    path: '/home/f/points',
    redirect: '/points',
  },
  {
    path: '/home/f/:key',
    name: 'feature',
    component: () => import('@/site/pages/FeaturePage.vue'),
    meta: { requiresAuth: true, title: '功能 · MCTP' },
  },
  {
    path: '/legal/:doc?',
    name: 'legal',
    component: () => import('@/site/pages/LegalPage.vue'),
    meta: { title: '协议条款 · MCTP' },
  },
  {
    path: '/home/announcements',
    redirect: '/manage/announcements',
  },
  {
    path: '/',
    component: BusinessPage,
    children: [
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true, title: '登录 · MCTP' },
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true, title: '创建账号 · MCTP' },
  },
  {
    path: '/points',
    component: () => import('@/views/PointsView.vue'),
    meta: { requiresAuth: true, title: '积分 · MCTP' },
  },
  {
    path: '/manage',
    redirect: '/manage/announcements',
  },
  {
    path: '/manage/announcements',
    component: () => import('@/views/ManageAnnouncementsView.vue'),
    meta: { requiresAuth: true, requiresStaff: true, title: '公告管理 · MCTP' },
  },
  {
    path: '/manage/players',
    component: () => import('@/views/ManagePlayersView.vue'),
    meta: { requiresAuth: true, requiresStaff: true, title: '玩家管理 · MCTP' },
  },
  {
    path: '/manage/points',
    component: () => import('@/views/ManagePointsView.vue'),
    meta: { requiresAuth: true, requiresStaff: true, title: '积分发放 · MCTP' },
  },
  {
    path: '/announcements',
    component: () => import('@/views/AnnouncementsView.vue'),
    meta: { title: '公告 · MCTP' },
  },
  {
    path: '/announcements/:id(\\d+)',
    component: () => import('@/views/AnnouncementDetailView.vue'),
    meta: { title: '公告详情 · MCTP' },
  },
  {
    path: '/session-unavailable',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'session' },
    meta: { title: '会话不可用 · MCTP' },
  },
  {
    path: '/forbidden',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'forbidden' },
    meta: { title: '无访问权限 · MCTP' },
  },
  {
    path: '/auth/microsoft/callback',
    component: () => import('@/views/MicrosoftCallbackView.vue'),
    meta: { title: '正在登录 · MCTP' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'missing' },
    meta: { title: '页面不存在 · MCTP' },
  },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return {
        el: to.hash,
        top: window.innerWidth <= 800 ? 136 : 100,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
  // 专属转场：新页面渲染出来后再揭开（没有专属转场时什么也不做）
  revealPending()
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  if (requiresAuth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (auth.isLoggedIn && (requiresAuth || to.meta.guestOnly)) {
    try {
      await auth.ensureSession()
    } catch {
      if (!auth.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
      return { path: '/session-unavailable', query: { redirect: to.fullPath } }
    }
  }
  if (to.meta.requiresStaff && !auth.isStaff) return '/forbidden'
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return localRedirect(to.query.redirect)
  }
  if (from.matched.length && to.path !== from.path && !(to.name && to.name === from.name)) {
    // 登录 / 注册、积分、部分功能页有专属转场（规则见 site/transitions/index.js），其他跳转仍是短转场
    const kind = pickTransition(to, from)
    if (kind) await coverWith(kind, { to, from })
    else await coverScreen()
  }
})

export default router
