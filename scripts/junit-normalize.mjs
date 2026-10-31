#!/usr/bin/env node
// Node 的 JUnit reporter 会输出 <testsuites> 下直接挂 <testcase> 的结构，
// Jenkins 的 junit 发布器要求 <testsuite> 包裹，这里做一次最小规范化。
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export function normalizeJunit(xml) {
  if (/<testsuite[\s>]/.test(xml)) return xml
  const match = xml.match(/<testsuites>([\s\S]*)<\/testsuites>/)
  if (!match) return xml
  const body = match[1]
  const count = (pattern) => (body.match(pattern) ?? []).length
  const times = [...body.matchAll(/<testcase\b[^>]*\btime="([\d.]+)"/g)].map((item) => Number(item[1]))
  const total = times.reduce((sum, value) => sum + value, 0)
  const attrs = [
    'name="mctp-frontend"',
    `tests="${count(/<testcase\b/g)}"`,
    `failures="${count(/<failure\b/g)}"`,
    `errors="${count(/<error\b/g)}"`,
    `skipped="${count(/<skipped\b/g)}"`,
    `time="${total.toFixed(3)}"`,
  ].join(' ')
  return `<testsuites>\n<testsuite ${attrs}>${body}</testsuite>\n</testsuites>\n`
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entry) {
  const path = process.argv[2] ?? 'junit.xml'
  fs.writeFileSync(path, normalizeJunit(fs.readFileSync(path, 'utf8')))
}
