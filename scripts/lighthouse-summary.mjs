#!/usr/bin/env node
// 汇总 Lighthouse 断言与分类得分，供 Jenkins 构建描述 / PR 评论使用。
// 输入是 lhci autorun 生成的 .lighthouseci/assertion-results.json 与 lhr-*.json。
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export function summarizeAssertions(rows) {
  if (!Array.isArray(rows)) return 'Lighthouse: assertion results unavailable'
  const errors = rows.filter((row) => row?.level === 'error')
  const warnings = rows.filter((row) => row?.level === 'warn')
  const audits = [
    ...new Set([...errors, ...warnings].map((row) => row?.auditId).filter(Boolean)),
  ]
  const detail = audits.length ? ` (${audits.join(', ')})` : ''
  return `Lighthouse: ${warnings.length} warnings, ${errors.length} errors${detail}`
}

export function summarizeScores(lhrs) {
  if (!Array.isArray(lhrs) || !lhrs.length) return ''
  const categories = [
    ['performance', '性能'],
    ['accessibility', '无障碍'],
    ['best-practices', '最佳实践'],
    ['seo', 'SEO'],
  ]
  const parts = []
  for (const [key, label] of categories) {
    const values = lhrs
      .map((lhr) => lhr?.categories?.[key]?.score)
      .filter((value) => typeof value === 'number')
      .sort((left, right) => left - right)
    if (!values.length) continue
    parts.push(`${label} ${Math.round(values[Math.floor(values.length / 2)] * 100)}`)
  }
  return parts.join(' · ')
}

export function buildSummary(assertions, lhrs = []) {
  const scores = summarizeScores(lhrs)
  if (!Array.isArray(assertions)) {
    return scores ? `Lighthouse ${scores}` : 'Lighthouse: assertion results unavailable'
  }
  const text = summarizeAssertions(assertions).replace(/^Lighthouse:\s*/, '')
  return scores ? `Lighthouse ${scores}；${text}` : summarizeAssertions(assertions)
}

function readReports() {
  let assertions = null
  let lhrs = []
  try {
    assertions = JSON.parse(fs.readFileSync('.lighthouseci/assertion-results.json', 'utf8'))
  } catch {
    // 报告缺失时由 buildSummary 输出降级文案
  }
  try {
    lhrs = fs
      .readdirSync('.lighthouseci')
      .filter((name) => /^lhr-.*\.json$/.test(name))
      .map((name) => JSON.parse(fs.readFileSync(`.lighthouseci/${name}`, 'utf8')))
  } catch {
    lhrs = []
  }
  return { assertions, lhrs }
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entry) {
  const { assertions, lhrs } = readReports()
  console.log(buildSummary(assertions, lhrs))
}
