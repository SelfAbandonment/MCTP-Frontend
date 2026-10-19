import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/manage',
    redirect: '/manage/announcements',
  },
  {
    path: '/manage/announcements',
    component: () => import('@/views/ManageAnnouncementsView.vue'),
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: '/manage/players',
    component: () => import('@/views/ManagePlayersView.vue'),
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: '/announcements',
    component: () => import('@/views/AnnouncementsView.vue'),
  },
  {
    path: '/session-unavailable',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'session' },
  },
  {
    path: '/forbidden',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'forbidden' },
  },
  {
    path: '/auth/microsoft/callback',
    component: () => import('@/views/MicrosoftCallbackView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/RouteStatusView.vue'),
    props: { mode: 'missing' },
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
