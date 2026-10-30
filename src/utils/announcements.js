// Local mirrors of the backend announcement visibility rules
// (mctp_api/community/views.py: is_published and published_at <= now).
export const ANNOUNCEMENT_STATUS = {
  draft: { key: 'draft', label: '草稿' },
  scheduled: { key: 'scheduled', label: '定时' },
  published: { key: 'published', label: '已发布' },
}

export function announcementStatus(item, now = Date.now()) {
  if (!item?.is_published) return ANNOUNCEMENT_STATUS.draft
  const publishedAt = item.published_at ? new Date(item.published_at).getTime() : NaN
  if (Number.isFinite(publishedAt) && publishedAt > now) return ANNOUNCEMENT_STATUS.scheduled
  return ANNOUNCEMENT_STATUS.published
}

export function isVisibleNow(item, now = Date.now()) {
  return announcementStatus(item, now).key === 'published'
}
