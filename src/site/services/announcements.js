import { communityApi } from '@/api/community'

export function fromApiAnnouncement(item) {
  if (!item || !Number.isInteger(item.id) || typeof item.title !== 'string') {
    throw new Error('公告接口返回的数据格式不正确')
  }
  return {
    id: item.id,
    cover: '',
    title: item.title,
    subtitle: item.summary || '',
    link: `/announcements/${item.id}`,
  }
}

export async function loadAnnouncements(signal) {
  const response = await communityApi.announcements({ page: 1 }, signal)
  const results = response.data?.data?.results
  if (!Array.isArray(results)) throw new Error('公告接口返回的数据格式不正确')
  return results.slice(0, 10).map(fromApiAnnouncement)
}
