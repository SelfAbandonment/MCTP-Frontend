import { onUnmounted, ref } from 'vue'
import { errorMessage } from '@/utils/errors'

export function usePagedResource(fetcher) {
  const items = ref([])
  const page = ref(1)
  const count = ref(0)
  const hasNext = ref(false)
  const hasPrevious = ref(false)
  const loading = ref(false)
  const error = ref('')
  let controller
  let generation = 0
  let lastParams = {}
  let requestedPage = 1

  async function load(nextPage = 1, params = lastParams) {
    const version = ++generation
    controller?.abort()
    controller = new AbortController()
    lastParams = params
    requestedPage = nextPage
    loading.value = true
    error.value = ''
    items.value = []
    try {
      const res = await fetcher({ ...params, page: nextPage }, controller.signal)
      if (version !== generation) return
      const data = res.data.data
      if (!Array.isArray(data?.results) || typeof data.count !== 'number') {
        throw new Error('接口返回格式不正确，请联系管理员')
      }
      items.value = data.results
      count.value = data.count
      hasNext.value = !!data.next
      hasPrevious.value = !!data.previous
      page.value = nextPage
    } catch (e) {
      if (e.code === 'ERR_CANCELED' || version !== generation) return
      error.value = errorMessage(e, '读取列表失败')
      hasNext.value = false
      hasPrevious.value = false
    } finally {
      if (version === generation) loading.value = false
    }
  }

  function retry() {
    return load(requestedPage, lastParams)
  }

  onUnmounted(() => {
    generation++
    controller?.abort()
  })
  return { items, page, count, hasNext, hasPrevious, loading, error, load, retry }
}
