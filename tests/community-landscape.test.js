import test from 'node:test'
import assert from 'node:assert/strict'
import { Matrix4, Vector3, Quaternion } from 'three'
import { createCommunityLandscape } from '../src/composables/createCommunityLandscape.js'

test('camera remains finite at desktop, mobile and wide viewports', () => {
  const world = createCommunityLandscape()
  try {
    for (const [width, height] of [[1440, 820], [580, 470], [2400, 700]]) {
      world.resize(width, height)
      for (const chapter of [0, 1, 2]) {
        world.update(10, chapter, 0, 0, true)
        assert.ok(world.camera.projectionMatrix.elements.every(Number.isFinite))
        assert.ok(world.camera.matrixWorld.elements.every(Number.isFinite))
        assert.ok(world.camera.right > world.camera.left)
      }
    }
  } finally {
    world.dispose()
  }
})

test('river surface is above its soil, not hidden inside terrain', () => {
  const world = createCommunityLandscape()
  try {
    const soil = world.scene.getObjectByName('terrain-soil')
    const surface = world.scene.getObjectByName('terrain-surface')
    assert.ok(soil.count > 500)
    const matrix = new Matrix4()
    const position = new Vector3()
    const scale = new Vector3()
    const rotation = new Quaternion()
    for (let i = 0; i < soil.count; i++) {
      soil.getMatrixAt(i, matrix)
      matrix.decompose(position, rotation, scale)
      const soilTop = position.y + scale.y / 2
      surface.getMatrixAt(i, matrix)
      matrix.decompose(position, rotation, scale)
      assert.ok(position.y + scale.y / 2 > soilTop, `buried surface at instance ${i}`)
    }
  } finally {
    world.dispose()
  }
})

test('train follows the railway and a fixed animation time is deterministic', () => {
  const world = createCommunityLandscape()
  try {
    const train = world.scene.getObjectByName('community-train')
    const blades = world.scene.getObjectByName('windmill-blades')
    world.update(0, 0, 0, 0, true)
    const start = train.position.clone()
    world.update(12, 2, 0, 0, true)
    assert.ok(start.distanceTo(train.position) > 1)
    assert.ok(Math.abs((train.position.x / 12.7) ** 2 + (train.position.z / 8.1) ** 2 - 1) < 1e-10)
    const position = train.position.clone()
    const rotation = blades.rotation.z
    world.update(12, 2, 0, 0, true)
    assert.deepEqual(train.position, position)
    assert.equal(blades.rotation.z, rotation)
  } finally {
    world.dispose()
  }
})

test('scene teardown disposes shared geometry once and clears the scene', () => {
  const world = createCommunityLandscape()
  const geometries = new Set()
  const disposalCounts = new Map()
  world.scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry)
  })
  geometries.forEach((geometry) => {
    disposalCounts.set(geometry, 0)
    geometry.addEventListener('dispose', () => {
      disposalCounts.set(geometry, disposalCounts.get(geometry) + 1)
    })
  })
  world.dispose()
  assert.equal(world.scene.children.length, 0)
  assert.ok([...disposalCounts.values()].every((count) => count === 1))
})
