import { computed } from 'vue'
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
export const isAdmin = computed(() => useAuthStore().isStaff)

export function logout() {
  useAuthStore().logout()
}
