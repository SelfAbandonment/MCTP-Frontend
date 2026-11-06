import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BusinessPage from '@/components/BusinessPage.vue'
import { coverScreen } from '@/site/composables/usePageTransition'

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
    meta: { title: '主页面 · MCTP' },
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
    meta: { title: '功能 · MCTP' },
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
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, title: '玩家中心 · MCTP' },
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
      return { el: to.hash, top: 96, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (auth.isLoggedIn && (to.meta.requiresAuth || to.meta.guestOnly)) {
    try {
      await auth.ensureSession()
    } catch {
      if (!auth.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
      return { path: '/session-unavailable', query: { redirect: to.fullPath } }
    }
  }
  if (to.meta.requiresStaff && !auth.isStaff) return '/forbidden'
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { path: '/home' }
  }
  if (from.matched.length && to.path !== from.path && !(to.name && to.name === from.name)) {
    await coverScreen()
  }
})

export default router
