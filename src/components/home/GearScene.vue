<script setup>
/**
 * 首页主视觉：Create（机械动力）大齿轮的实时 3D 渲染。
 *
 * 模型是 Blockbench JSON（来自 Create 仓库，授权见 public/scene/create/NOTICE.md），
 * 这里只做数据解析 + three.js 渲染，不依赖 Create 的 Java/Flywheel 代码。
 * three.js 走动态 import，页面 load 之后再挂载，避免抢首屏 LCP。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/animations/motion'

const host = ref(null)
const canvas = ref(null)

const reduced = prefersReducedMotion()
const base = import.meta.env.BASE_URL || '/'
const asset = (name) => `${base}scene/create/${name}`

let disposed = false
let rafId = 0
let renderer = null
let scene = null
let camera = null
let group = null
let observer = null
let startTime = 0

// ── Blockbench model → BufferGeometry ─────────────────────────────
function faceCorners(face, x1, y1, z1, x2, y2, z2) {
  switch (face) {
    case 'north': return [[x2, y2, z1], [x1, y2, z1], [x1, y1, z1], [x2, y1, z1]]
    case 'south': return [[x1, y2, z2], [x2, y2, z2], [x2, y1, z2], [x1, y1, z2]]
    case 'east': return [[x2, y2, z1], [x2, y2, z2], [x2, y1, z2], [x2, y1, z1]]
    case 'west': return [[x1, y2, z2], [x1, y2, z1], [x1, y1, z1], [x1, y1, z2]]
    case 'up': return [[x1, y2, z1], [x2, y2, z1], [x2, y2, z2], [x1, y2, z2]]
    case 'down': return [[x1, y1, z2], [x2, y1, z2], [x2, y1, z1], [x1, y1, z1]]
    default: return null
  }
}

function rotateY(point, origin, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  const dx = point[0] - origin[0]
  const dz = point[2] - origin[2]
  return [
    origin[0] + dx * Math.cos(rad) - dz * Math.sin(rad),
    point[1],
    origin[2] + dx * Math.sin(rad) + dz * Math.cos(rad),
  ]
}

const toUnit = (p) => [p[0] / 16 - 0.5, p[1] / 16 - 0.5, p[2] / 16 - 0.5]

function buildGeometry(THREE, model, textureKey) {
  const texSize = (model.texture_size && model.texture_size[0]) || 16
  const pos = []
  const uv = []
  const idx = []

  for (const element of model.elements) {
    const faces = element.faces || {}
    const usesTexture = Object.values(faces).some((f) => f && f.texture === textureKey)
    if (!usesTexture) continue

    const [x1, y1, z1] = element.from
    const [x2, y2, z2] = element.to
    const rotation = element.rotation

    for (const name of ['north', 'south', 'east', 'west', 'up', 'down']) {
      const face = faces[name]
      if (!face || !face.uv) continue
      let corners = faceCorners(name, x1, y1, z1, x2, y2, z2)
      if (!corners) continue
      if (rotation && rotation.axis === 'y') {
        corners = corners.map((p) => rotateY(p, rotation.origin, rotation.angle))
      }

      const [u1, v1, u2, v2] = face.uv
      const U1 = u1 / texSize
      const U2 = u2 / texSize
      const V1 = 1 - v1 / texSize
      const V2 = 1 - v2 / texSize
      const base = pos.length / 3
      corners.forEach((corner) => {
        const unit = toUnit(corner)
        pos.push(unit[0], unit[1], unit[2])
      })
      uv.push(U1, V1, U2, V1, U2, V2, U1, V2)
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geometry.setIndex(idx)
  geometry.computeVertexNormals()
  return geometry
}

async function loadJSON(name) {
  const response = await fetch(asset(name))
  if (!response.ok) throw new Error(`scene asset missing: ${name}`)
  return response.json()
}

async function boot() {
  const THREE = await import('three')
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
  if (disposed || !canvas.value || !host.value) return

  const [wheelModel, shaftModel] = await Promise.all([
    loadJSON('large_cogwheel_shaftless.json'),
    loadJSON('cogwheel_shaft.json'),
  ])
  if (disposed) return

  // 游戏里的轴贯穿整格；首屏只露出轮面之上的一段，取 4×4×4 立方体
  const shaftElement = shaftModel.elements[0]
  shaftElement.from = [6, 9.4, 6]
  shaftElement.to = [10, 13.4, 10]
  Object.values(shaftElement.faces).forEach((face) => { face.uv = [6, 6, 10, 10] })

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.98
  renderer.outputColorSpace = THREE.SRGBColorSpace

  scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.85

  camera = new THREE.PerspectiveCamera(30, 1, 0.01, 60)
  camera.position.set(0.45, 2.05, 6.05)
  camera.lookAt(0, 0, 0)

  const textureLoader = new THREE.TextureLoader()
  const [wheelTex, axisTopTex] = await Promise.all([
    textureLoader.loadAsync(asset('large_cogwheel.png')),
    textureLoader.loadAsync(asset('axis_top.png')),
  ])
  for (const texture of [wheelTex, axisTopTex]) {
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
  }

  group = new THREE.Group()

  const wheelMesh = new THREE.Mesh(
    buildGeometry(THREE, wheelModel, '#4'),
    new THREE.MeshStandardMaterial({
      map: wheelTex,
      roughness: 0.84,
      metalness: 0.02,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    }),
  )
  wheelMesh.castShadow = true
  wheelMesh.receiveShadow = true
  group.add(wheelMesh)

  const shaftMesh = new THREE.Mesh(
    buildGeometry(THREE, shaftModel, '#1'),
    new THREE.MeshStandardMaterial({
      color: 0x9aa3a8,
      roughness: 0.48,
      metalness: 0.55,
      side: THREE.DoubleSide,
    }),
  )
  shaftMesh.castShadow = true
  group.add(shaftMesh)

  group.rotation.set(0.42, -0.34, 0.08)
  scene.add(group)

  scene.add(new THREE.AmbientLight(0xffffff, 0.24))

  const key = new THREE.DirectionalLight(0xfff4e6, 2.8)
  key.position.set(3, 4.4, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.radius = 5
  key.shadow.bias = -0.0006
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.1, far: 12 })
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.65)
  fill.position.set(-3.6, 1.4, 2.6)
  scene.add(fill)

  const rim = new THREE.DirectionalLight(0xffffff, 1.1)
  rim.position.set(-1.6, 2.4, -3.6)
  scene.add(rim)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.32 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.62
  floor.receiveShadow = true
  scene.add(floor)

  observer = new ResizeObserver(resize)
  observer.observe(host.value)
  resize()

  startTime = performance.now()
  if (reduced) render(0)
  else loop()
}

function resize() {
  if (!renderer || !camera || !host.value) return
  const { clientWidth: width, clientHeight: height } = host.value
  if (!width || !height) return
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  if (reduced) render(0)
}

function render(elapsed) {
  if (!renderer || !scene || !camera) return
  if (group) group.rotation.y = -0.34 + elapsed * 0.16
  renderer.render(scene, camera)
}

function loop() {
  rafId = requestAnimationFrame(loop)
  render((performance.now() - startTime) / 1000)
}

function start() {
  if (disposed) return
  boot().catch((error) => {
    // WebGL 不可用或资产缺失时保留 CSS 背景，不阻塞首屏
    if (import.meta.env.DEV) console.warn('gear scene unavailable', error)
  })
}

function scheduleStart() {
  if (document.readyState === 'complete') setTimeout(start, 220)
  else window.addEventListener('load', () => setTimeout(start, 220), { once: true })
}

onMounted(scheduleStart)

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  renderer?.dispose()
})
</script>

<template>
  <div
    ref="host"
    class="gear-scene"
  >
    <canvas
      ref="canvas"
      class="gear-scene__canvas"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.gear-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gear-scene__canvas {
  display: block;
  width: 100%;
  height: 100%;
  filter: saturate(1.02) contrast(1.04);
}
</style>
