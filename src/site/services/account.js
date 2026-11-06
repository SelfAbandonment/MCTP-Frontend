import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function fromApiUser(user) {
  return {
    uid: user.id,
    name: user.minecraft?.username || user.username,
    avatar: user.avatar || null,
    role: user.is_staff && user.is_active !== false ? 'admin' : 'user',
  }
}

export const account = computed(() => {
  const auth = useAuthStore()
  return auth.isLoggedIn && auth.user ? fromApiUser(auth.user) : null
})
export const isLoggedIn = computed(() => !!account.value)

/*
 * 管理员"切换成普通玩家视角"（只影响页面显示，不改变账号权限）：
 *  - isRealAdmin：账号本身是不是管理员（后端返回的 is_staff，且账号未停用），权限判断一律用它或 auth.isStaff；
 *  - viewAsPlayer：管理员是否正在以普通玩家视角查看页面，记在本机（localStorage），只能"降低"显示的权限；
 *  - isAdmin：页面上要不要显示管理员入口 / 标记 = 是管理员且没有切到玩家视角。
 * 路由守卫（requiresStaff）、接口权限都不看 viewAsPlayer：切到玩家视角后，直接打开管理页面照样能用。
 */
const VIEW_KEY = 'mctp-view-as-player'
function readView() {
  try {
    return globalThis.localStorage?.getItem(VIEW_KEY) === '1'
  } catch {
    return false
  }
}
export const viewAsPlayer = ref(readView())
export const isRealAdmin = computed(() => useAuthStore().isStaff)
export const isAdmin = computed(() => isRealAdmin.value && !viewAsPlayer.value)

export function setViewAsPlayer(on) {
  viewAsPlayer.value = !!on && isRealAdmin.value
  try {
    if (viewAsPlayer.value) globalThis.localStorage?.setItem(VIEW_KEY, '1')
    else globalThis.localStorage?.removeItem(VIEW_KEY)
  } catch {
    /* 隐私模式等存不进去时，只在本次打开期间生效 */
  }
}

export function logout() {
  setViewAsPlayer(false)
  useAuthStore().logout()
}
