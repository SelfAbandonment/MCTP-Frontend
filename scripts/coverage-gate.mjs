#!/usr/bin/env node
// 校验 Node 原生覆盖率报告里的行覆盖率，低于阈值时让流水线失败。
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export function coverageValue(text) {
  const match = text.match(/all files\s*\|\s*([\d.]+)\s*\|/)
  return match ? Number(match[1]) : Number.NaN
}

export function checkCoverage(text, threshold) {
  const value = coverageValue(text)
  if (!Number.isFinite(value)) {
    return { ok: false, value, message: '无法解析覆盖率报告（缺少 "all files" 行）' }
  }
  return {
    ok: value >= threshold,
    value,
    message: `行覆盖率 ${value}%（下限 ${threshold}%）`,
  }
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entry) {
  const file = process.argv[2] ?? 'coverage.txt'
  const threshold = Number(process.argv[3] ?? '70')
  let text = ''
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {
    console.error(`覆盖率门禁失败：读取不到 ${file}`)
    process.exit(1)
  }
  const result = checkCoverage(text, threshold)
  if (result.ok) {
    console.log(`覆盖率门禁通过：${result.message}`)
  } else {
    console.error(`覆盖率门禁失败：${result.message}`)
    process.exit(1)
  }
}
