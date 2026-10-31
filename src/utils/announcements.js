// Local mirrors of the backend announcement taxonomy and visibility rules
// (mctp_api/community/models.py and views.py: category choices, is_pinned and
// is_published with published_at <= now).
export const ANNOUNCEMENT_STATUS = {
  draft: { key: 'draft', label: '草稿' },
  scheduled: { key: 'scheduled', label: '定时' },
  published: { key: 'published', label: '已发布' },
}

export const ANNOUNCEMENT_CATEGORIES = [
  { key: 'notice', label: '公告' },
  { key: 'event', label: '活动' },
  { key: 'update', label: '更新' },
  { key: 'maintenance', label: '维护' },
]

export function announcementStatus(item, now = Date.now()) {
  if (!item?.is_published) return ANNOUNCEMENT_STATUS.draft
  const publishedAt = item.published_at ? new Date(item.published_at).getTime() : NaN
  if (Number.isFinite(publishedAt) && publishedAt > now) return ANNOUNCEMENT_STATUS.scheduled
  return ANNOUNCEMENT_STATUS.published
}

export function isVisibleNow(item, now = Date.now()) {
  return announcementStatus(item, now).key === 'published'
}

export function announcementCategory(item) {
  const key = item?.category ?? ''
  const known = ANNOUNCEMENT_CATEGORIES.find((category) => category.key === key)
  if (known) return known
  // Unknown codes keep their raw label instead of pretending to be `notice`.
  return key ? { key, label: key } : ANNOUNCEMENT_CATEGORIES[0]
}

export function announcementQuery({ search = '', category = '', status = '' } = {}) {
  const params = {}
  const term = (search || '').trim()
  if (term) params.search = term
  if (category) params.category = category
  if (status) params.status = status
  return params
}
