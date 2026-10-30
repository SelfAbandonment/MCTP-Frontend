import { computed, onMounted, onUnmounted, ref } from 'vue'
import { communityApi } from '@/api/community'
import { errorMessage } from '@/utils/errors'

// Polls the public health endpoint while the component is mounted and the tab
// is visible. Kept out of the panel component so the panel only renders state.
export function useServiceHealth({ intervalMs = 30000 } = {}) {
  const health = ref(null)
  const loading = ref(false)
  const error = ref('')
  const lastChecked = ref(null)
  const online = computed(() => health.value?.status === 'ok' || health.value?.status === 'healthy')
  let timer
  let mounted = true

  async function check() {
    if (loading.value) return
    loading.value = true
    try {
      const res = await communityApi.health()
      if (!mounted) return
      health.value = res.data.data
      error.value = ''
    } catch (e) {
      if (!mounted) return
      health.value = null
      error.value = errorMessage(e, '暂时无法读取服务状态')
    } finally {
      if (mounted) {
        loading.value = false
        lastChecked.value = new Date().toISOString()
      }
    }
  }

  onMounted(() => {
    check()
    timer = setInterval(() => {
      if (!document.hidden) check()
    }, intervalMs)
  })

  onUnmounted(() => {
    mounted = false
    clearInterval(timer)
  })

  return { health, loading, error, lastChecked, online, check }
}
