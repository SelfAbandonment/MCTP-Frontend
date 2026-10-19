/**
 * Headless Edge screenshot helper over the Chrome DevTools Protocol.
 * Also reports scroll height / console errors, which plain --screenshot cannot.
 *
 * Usage:
 *   node scripts/cdp-capture.mjs "<url>" "<outDir>" "0,900,1800" [width] [height]
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const url = process.argv[2]
const outDir = process.argv[3] || 'D:/code/MCTP/_review/cdp'
const scrolls = (process.argv[4] || '0').split(',').map((value) => Number(value) || 0)
const width = Number(process.argv[5] || 1440)
const height = Number(process.argv[6] || 900)
const prefix = process.argv[7] || 'shot'
const port = Number(process.env.CDP_PORT || 9333)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForEndpoint() {
  for (let i = 0; i < 100; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return
    } catch {
      // not up yet
    }
    await sleep(150)
  }
  throw new Error('Edge CDP endpoint did not start')
}

const proc = spawn(
  edge,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--enable-unsafe-swiftshader',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${process.env.TEMP}\\edge-cdp`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let ws
let nextId = 0
const pending = new Map()
const consoleErrors = []

function rpc(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = (nextId += 1)
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function main() {
  await mkdir(outDir, { recursive: true })
  await waitForEndpoint()
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('No page target')

  ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
      return
    }
    if (message.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(message.params.exceptionDetails?.text || 'exception')
    }
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      consoleErrors.push(message.params.entry.text)
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      consoleErrors.push(message.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '))
    }
  })

  await rpc('Page.enable')
  await rpc('Runtime.enable')
  await rpc('Log.enable')
  await rpc('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  })
  if (process.env.CDP_REDUCED === '1') {
    await rpc('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    })
  }
  await rpc('Page.navigate', { url })
  await sleep(8000)

  if (process.env.CDP_EVAL) {
    const evaluation = await rpc('Runtime.evaluate', {
      expression: process.env.CDP_EVAL,
      awaitPromise: true,
      returnByValue: true,
    })
    console.log('EVAL:', JSON.stringify(evaluation.result?.value ?? evaluation.result?.description ?? null))
    await sleep(2200)
  }

  for (const scroll of scrolls) {
    await rpc('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${scroll}, left: 0, behavior: 'instant' })`,
    })
    await sleep(1400)
    const metrics = await rpc('Runtime.evaluate', {
      expression:
        'JSON.stringify({ y: Math.round(scrollY), height: document.body.scrollHeight, width: document.documentElement.scrollWidth, innerWidth, innerHeight })',
      returnByValue: true,
    })
    const info = JSON.parse(metrics.result.value)
    const shot = await rpc('Page.captureScreenshot', { format: 'png', fromSurface: true })
    const file = join(outDir, `${prefix}-${scroll}.png`)
    await writeFile(file, Buffer.from(shot.data, 'base64'))
    console.log(`${file}  y=${info.y} docHeight=${info.height} scrollWidth=${info.width} viewport=${info.innerWidth}x${info.innerHeight}`)
  }

  if (consoleErrors.length) {
    console.log('CONSOLE ERRORS:')
    for (const error of [...new Set(consoleErrors)].slice(0, 25)) console.log(' -', error)
  } else {
    console.log('CONSOLE ERRORS: none')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    try {
      ws?.close()
    } catch {
      // ignore
    }
    proc.kill()
  })
