import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TITLE = 'MCTP · 方块社区'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: DEFAULT_TITLE },
  },
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
    path: '/announcements',
    component: () => import('@/views/AnnouncementsView.vue'),
    meta: { title: '公告 · MCTP' },
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
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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

router.beforeEach(async (to) => {
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
    return { path: '/dashboard' }
  }
})

export default router
