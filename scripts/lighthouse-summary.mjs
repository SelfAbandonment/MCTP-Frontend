#!/usr/bin/env node
// 汇总 Lighthouse 断言结果，供 Jenkins 构建描述使用。
// 输入是 lhci autorun 生成的 .lighthouseci/assertion-results.json。
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

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entry) {
  try {
    const rows = JSON.parse(fs.readFileSync('.lighthouseci/assertion-results.json', 'utf8'))
    console.log(summarizeAssertions(rows))
  } catch {
    console.log('Lighthouse: assertion results unavailable')
  }
}
