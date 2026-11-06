/**
 * 文件用途：画廊转场——"画面融化"
 * 盖上：当前页面像被加热的蜡一样扭曲（SVG 位移滤镜，越来越强），
 *       同时深色的"颜料"从屏幕顶端一条一条往下淌（每一条速度不同、底部是圆的水滴），淌满整个屏幕；
 * 切换：盖满后进入画廊；
 * 揭开：颜料继续往下流、从屏幕底部流走，露出后面的画廊（看起来就是旧画面融化后流下去了）。
 */
import { canvasLayer, currentMain, ease, loop } from './util'

const COLOR = '#17131d' // 画廊背景的深紫黑

function ensureFilter() {
  if (document.getElementById('mctp-melt-svg')) return document.getElementById('mctp-melt-map')
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.id = 'mctp-melt-svg'
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.innerHTML = `<filter id="mctp-melt" x="-10%" y="-10%" width="120%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.04" numOctaves="2" seed="7" result="n" />
    <feDisplacementMap id="mctp-melt-map" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
  </filter>`
  document.body.appendChild(svg)
  return document.getElementById('mctp-melt-map')
}

export function meltEffect() {
  let fx = null
  let drips = []

  function draw(offset) {
    const { ctx, w, h } = fx
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = COLOR
    for (const d of drips) {
      // 每一条：从 top 画到 bottom，底部一个圆头（水滴）
      const bottom = d.len * offset.cover
      const top = (h + 200) * offset.leave * d.speed - 40
      if (bottom <= top) continue
      ctx.fillRect(d.x, top, d.w, bottom - top)
      ctx.beginPath()
      ctx.arc(d.x + d.w / 2, bottom, d.w / 2, 0, Math.PI)
      ctx.fill()
    }
  }

  return {
    async cover() {
      fx = canvasLayer()
      const { w, h } = fx
      drips = []
      let x = -4
      while (x < w + 4) {
        const dw = 10 + Math.random() * 22
        drips.push({ x, w: dw + 2, len: (h + 60) * (1 + Math.random() * 0.6), speed: 0.8 + Math.random() * 0.5 })
        x += dw
      }
      const main = currentMain()
      const map = ensureFilter()
      if (main) main.style.filter = 'url(#mctp-melt)'
      await loop(1200, (p) => {
        map?.setAttribute('scale', String(ease.inQuad(p) * 140))
        if (main) main.style.transform = `translateY(${ease.inQuad(p) * 60}px)`
        // 每一条的长度 = 自己的总长 × 进度；总长最短的那条也比屏幕高，所以进度到 1 时一定盖满
        draw({ cover: ease.inQuad(p), leave: 0 })
      })
      fx.ctx.fillStyle = COLOR
      fx.ctx.fillRect(0, 0, w, h)
      map?.setAttribute('scale', '0')
    },
    async reveal() {
      // 颜料从上往下流走：每条的上沿按各自速度往下移
      await loop(1100, (p) => draw({ cover: 1.6, leave: ease.inCubic(p) * 1.3 }))
      fx.el.remove()
    },
  }
}
