import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ANNOUNCEMENT_CATEGORIES,
  announcementCategory,
  announcementQuery,
  announcementStatus,
  isVisibleNow,
} from '../src/utils/announcements.js'

const NOW = Date.parse('2026-10-30T12:00:00Z')

test('drafts are never visible regardless of timestamp', () => {
  const item = { is_published: false, published_at: '2026-10-01T00:00:00Z' }
  assert.equal(announcementStatus(item, NOW).key, 'draft')
  assert.equal(isVisibleNow(item, NOW), false)
})

test('future publication is scheduled, not visible', () => {
  const item = { is_published: true, published_at: '2026-11-01T00:00:00Z' }
  assert.equal(announcementStatus(item, NOW).key, 'scheduled')
  assert.equal(announcementStatus(item, NOW).label, '定时')
  assert.equal(isVisibleNow(item, NOW), false)
})

test('published records at or before now are visible', () => {
  for (const published_at of ['2026-10-01T00:00:00Z', '2026-10-30T11:59:59Z']) {
    assert.equal(announcementStatus({ is_published: true, published_at }, NOW).key, 'published')
  }
})

test('legacy published records without a timestamp stay visible', () => {
  assert.equal(announcementStatus({ is_published: true, published_at: null }, NOW).key, 'published')
})

test('missing items are treated as drafts instead of throwing', () => {
  assert.equal(announcementStatus(null, NOW).key, 'draft')
  assert.equal(announcementStatus(undefined, NOW).label, '草稿')
})

test('category codes mirror the backend choices and labels', () => {
  assert.deepEqual(
    ANNOUNCEMENT_CATEGORIES.map((category) => category.key),
    ['notice', 'event', 'update', 'maintenance'],
  )
  assert.equal(announcementCategory({ category: 'event' }).label, '活动')
  assert.equal(announcementCategory({ category: 'maintenance' }).key, 'maintenance')
})

test('unknown categories keep their raw code instead of pretending to be notice', () => {
  assert.deepEqual(announcementCategory({ category: 'pinned' }), { key: 'pinned', label: 'pinned' })
})

test('missing categories fall back to the backend default', () => {
  for (const item of [null, undefined, {}, { category: null }]) {
    assert.deepEqual(announcementCategory(item), { key: 'notice', label: '公告' })
  }
})

test('query builder trims search and drops blank filters', () => {
  assert.deepEqual(announcementQuery(), {})
  assert.deepEqual(announcementQuery({ search: '  开服  ' }), { search: '开服' })
  assert.deepEqual(announcementQuery({ search: '  ', category: '', status: '' }), {})
  assert.deepEqual(announcementQuery({ search: '活动', category: 'event', status: 'published' }), {
    search: '活动',
    category: 'event',
    status: 'published',
  })
})
