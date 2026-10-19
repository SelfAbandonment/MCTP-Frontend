import * as THREE from 'three'

// Original geometry only; no game textures or third-party models are used.
export function createCommunityLandscape() {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-25, 25, 20, -20, 0.1, 180)
  const island = new THREE.Group()
  scene.add(island)
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const materials = new Map()
  const movingClouds = []

  function material(color) {
    if (!materials.has(color)) {
      materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.9 }))
    }
    return materials.get(color)
  }

  function box(parent, color, x, y, z, width = 1, height = 1, depth = 1) {
    const mesh = new THREE.Mesh(geometry, material(color))
    mesh.position.set(x, y, z)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  scene.add(new THREE.HemisphereLight(0xfff5dc, 0x6c8261, 1.7))
  const sunlight = new THREE.DirectionalLight(0xffe8bd, 3)
  sunlight.position.set(-16, 30, 15)
  sunlight.castShadow = true
  sunlight.shadow.mapSize.set(2048, 2048)
  Object.assign(sunlight.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, far: 85 })
  sunlight.shadow.normalBias = 0.06
  sunlight.shadow.bias = -0.0002
  sunlight.shadow.radius = 4
  scene.add(sunlight)

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.13 }))
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -5.5
  ground.receiveShadow = true
  scene.add(ground)

  function hash(x, z) {
    const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
    return value - Math.floor(value)
  }

  function river(x, z) {
    return Math.abs(x - (Math.sin(z * 0.19) * 3 - 2)) < 1.65
  }

  const grasses = ['#91a66a', '#a4b67b', '#8da264', '#b1bd83', '#9bad70']
  const terrain = []
  for (let x = -15; x <= 15; x++) {
    for (let z = -11; z <= 11; z++) {
      if ((x / 16) ** 6 + (z / 12) ** 6 > 1 || (Math.abs(x) > 13 && hash(x, z) > 0.7)) continue
      const water = river(x, z)
      const height = water ? 1.45 : 2 + Math.floor(hash(Math.floor(x / 3), Math.floor(z / 3)) * 2) * 0.16
      terrain.push({ x, z, height, water })
    }
  }
  const soil = new THREE.InstancedMesh(geometry, material('#ffffff'), terrain.length)
  soil.name = 'terrain-soil'
  const grass = new THREE.InstancedMesh(geometry, material('#ffffff'), terrain.length)
  grass.name = 'terrain-surface'
  const matrix = new THREE.Matrix4()
  const color = new THREE.Color()
  terrain.forEach(({ x, z, height, water }, index) => {
    matrix.compose(new THREE.Vector3(x, -0.9, z), new THREE.Quaternion(), new THREE.Vector3(1, water ? 2.3 : 3.6, 1))
    soil.setMatrixAt(index, matrix)
    soil.setColorAt(index, color.set(['#cfb38b', '#bca281', '#ad9677'][Math.floor(hash(x, z) * 3)]))
    matrix.compose(new THREE.Vector3(x, height - 1.25, z), new THREE.Quaternion(), new THREE.Vector3(1, water ? 0.28 : 0.55, 1))
    grass.setMatrixAt(index, matrix)
    grass.setColorAt(index, color.set(water ? '#87b9b0' : grasses[Math.floor(hash(x, z) * grasses.length)]))
  })
  soil.castShadow = true
  soil.receiveShadow = true
  grass.receiveShadow = true
  island.add(soil, grass)

  function tree(x, z, scale = 1) {
    const group = new THREE.Group()
    group.position.set(x, 1.3, z)
    group.scale.setScalar(scale)
    box(group, '#766044', 0, 1.4, 0, 0.45, 2.8, 0.45)
    box(group, '#536f46', 0, 3, 0, 2.5, 1.5, 2.3)
    box(group, '#66834e', -0.5, 4, 0.1, 2.1, 1.2, 2)
    box(group, '#789359', 0.15, 4.8, 0, 1.4, 0.8, 1.5)
    island.add(group)
  }
  const trees = [[-11, -7, 1.1], [-8, -8, 0.85], [9, -8, 1.2], [12, -5, 0.9], [12, 3, 1], [-12, 3, 0.75], [7, 7, 0.8], [10, 7, 0.65]]
  trees.forEach(([x, z, scale]) => tree(x, z, scale))

  const cottage = new THREE.Group()
  cottage.position.set(5, 1.25, -3)
  island.add(cottage)
  box(cottage, '#e9d6a9', 0, 1.65, 0, 5, 3.3, 4)
  box(cottage, '#d6c195', 0, 0.15, 0, 5.5, 0.3, 4.5)
  for (let step = 0; step < 5; step++) {
    box(cottage, step % 2 ? '#a65336' : '#b3623e', 0, 3.4 + step * 0.36, 0, 6 - step * 1.05, 0.4, 5)
  }
  box(cottage, '#756b4b', -0.8, 1.05, 2.03, 1.05, 2.1, 0.12)
  box(cottage, '#9fbdb0', 1.3, 1.95, 2.06, 1.15, 1.1, 0.12)
  box(cottage, '#f0e4c0', 1.3, 1.95, 2.15, 0.1, 1.2, 0.12)
  box(cottage, '#f0e4c0', 1.3, 1.95, 2.15, 1.2, 0.1, 0.12)
  box(cottage, '#88a99c', 2.54, 1.9, -0.2, 0.1, 1.1, 1.3)
  box(cottage, '#cfb68b', -1.7, 4.8, -0.8, 0.7, 2.4, 0.8)
  for (let i = 0; i < 4; i++) {
    box(island, '#c0b18a', 4.2, 1.1, i * 1.05, 1.5, 0.16, 0.8)
  }

  const windmill = new THREE.Group()
  windmill.position.set(-7, 1.2, -3.5)
  island.add(windmill)
  box(windmill, '#e5d9b6', 0, 2.4, 0, 2.2, 4.8, 2.2)
  box(windmill, '#b35e3a', 0, 5, 0, 2.7, 0.5, 2.7)
  box(windmill, '#8c5338', 0, 5.5, 0, 1.8, 0.5, 2.2)
  box(windmill, '#6b795e', 0, 0.9, 1.12, 0.7, 1.8, 0.1)
  const blades = new THREE.Group()
  blades.name = 'windmill-blades'
  blades.position.set(0, 4.1, 1.45)
  windmill.add(blades)
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Group()
    blade.rotation.z = i * Math.PI / 2
    box(blade, '#826b44', 0, 1.65, 0, 0.14, 3.5, 0.14)
    box(blade, '#f0dfb5', 0.4, 2.1, 0, 0.7, 1.9, 0.12)
    for (let j = 0; j < 4; j++) {
      box(blade, '#b49a68', 0.4, 1.3 + j * 0.5, 0.1, 0.75, 0.045, 0.08)
    }
    blades.add(blade)
  }
  box(blades, '#806245', 0, 0, 0.15, 0.5, 0.5, 0.4)

  // Both the train and sleepers sample this same continuous track.
  function trackPoint(angle) {
    return new THREE.Vector3(Math.cos(angle) * 12.7, 1.45, Math.sin(angle) * 8.1)
  }
  for (let i = 0; i < 120; i++) {
    const angle = i / 120 * Math.PI * 2
    const point = trackPoint(angle)
    const tangent = new THREE.Vector3(-12.7 * Math.sin(angle), 0, 8.1 * Math.cos(angle)).normalize()
    const sleeper = box(island, '#a28c67', point.x, point.y, point.z, 1.25, 0.15, 0.22)
    sleeper.rotation.y = Math.atan2(tangent.x, tangent.z)
    if (river(Math.round(point.x), Math.round(point.z))) {
      box(island, '#bca17b', point.x, 1.27, point.z, 1.5, 0.2, 0.8).rotation.y = sleeper.rotation.y
      if (i % 3 === 0) box(island, '#8c785a', point.x, -0.1, point.z, 0.24, 2.7, 0.24)
    }
  }
  for (const offset of [-0.36, 0.36]) {
    const points = []
    for (let i = 0; i <= 180; i++) {
      const angle = i / 180 * Math.PI * 2
      const point = trackPoint(angle)
      point.x += Math.cos(angle) * offset
      point.z += Math.sin(angle) * offset
      point.y += 0.12
      points.push(point)
    }
    const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), 180, 0.045, 4, true), material('#6a6c5c'))
    island.add(rail)
  }
  const train = new THREE.Group()
  train.name = 'community-train'
  box(train, '#a14c32', 0, 0.55, 0, 0.85, 0.7, 1.6)
  box(train, '#ccaa6a', 0, 1.05, -0.45, 0.85, 0.6, 0.65)
  box(train, '#445f52', 0, 1.4, -0.45, 1.1, 0.15, 0.9)
  box(train, '#4e5a47', 0, 1.05, 0.55, 0.23, 0.6, 0.23)
  for (const x of [-0.47, 0.47]) {
    for (const z of [-0.5, 0.5]) box(train, '#424a3c', x, 0.18, z, 0.15, 0.35, 0.35)
  }
  island.add(train)
  const carriage = new THREE.Group()
  box(carriage, '#697c51', 0, 0.45, 0, 0.9, 0.6, 1.3)
  box(carriage, '#ddc38b', 0, 0.95, 0, 0.8, 0.45, 1)
  box(carriage, '#a75c3d', 0, 1.2, 0, 1.1, 0.13, 1.5)
  island.add(carriage)

  for (let x = -11; x < 12; x += 2) {
    if (river(x, 4) || (x > 2 && x < 6)) continue
    if (hash(x, 4) > 0.3) {
      box(island, '#6e8750', x, 1.5, 4.5, 0.1, 0.8, 0.1)
      box(island, '#e3bb6d', x, 1.95, 4.5, 0.32, 0.25, 0.32)
    }
  }
  for (let i = 0; i < 5; i++) {
    const cloud = new THREE.Group()
    box(cloud, '#f9f7e9', 0, 0, 0, 3.8, 0.6, 1.5).castShadow = false
    box(cloud, '#f9f7e9', 0.4, 0.45, 0, 2, 0.6, 1.3).castShadow = false
    cloud.position.set(-20 + i * 10, 9 + i % 2 * 3, -15 - i % 3 * 3)
    scene.add(cloud)
    movingClouds.push({ cloud, start: cloud.position.x })
  }

  let view = 0
  const target = new THREE.Vector3(0, 1, 0)
  const palettes = [0xffe8bd, 0xffd6a0, 0xffedd1]
  function resize(width, height) {
    const aspect = width / height
    const size = aspect < 1 ? 23 : 18
    camera.left = -size * aspect
    camera.right = size * aspect
    camera.top = size
    camera.bottom = -size
    camera.updateProjectionMatrix()
  }

  function update(time, chapter, pointerX, pointerY, instant) {
    view = instant ? chapter : THREE.MathUtils.lerp(view, chapter, 0.035)
    const angle = 0.72 + view * 0.22 + pointerX * 0.07
    camera.position.set(Math.sin(angle) * 40, 28 + pointerY * 2 - view * 1.5, Math.cos(angle) * 40)
    camera.lookAt(target)
    sunlight.color.setHex(palettes[chapter])
    blades.rotation.z = -time * 0.28 + 0.2
    for (const [object, offset] of [[train, 0], [carriage, -0.17]]) {
      const angle = time * 0.075 + 1.1 + offset
      object.position.copy(trackPoint(angle))
      object.rotation.y = Math.atan2(-12.7 * Math.sin(angle), 8.1 * Math.cos(angle))
    }
    movingClouds.forEach(({ cloud, start }, index) => {
      cloud.position.x = start + Math.sin(time * 0.04 + index) * 1.5
    })
  }

  function dispose() {
    const geometries = new Set()
    const allMaterials = new Set()
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry)
      if (object.isInstancedMesh) object.dispose()
      if (object.material) {
        const list = Array.isArray(object.material) ? object.material : [object.material]
        list.forEach((item) => allMaterials.add(item))
      }
    })
    geometries.forEach((item) => item.dispose())
    allMaterials.forEach((item) => item.dispose())
    sunlight.shadow.map?.dispose()
    scene.clear()
  }

  return { scene, camera, resize, update, dispose }
}
