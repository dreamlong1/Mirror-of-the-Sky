/* eslint-disable */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

function WaterSurface() {
  const waterRef = useRef(null)
  const waterNormals = useTexture('/textures/waternormals.jpeg')

  useEffect(() => {
    waterNormals.wrapS = THREE.RepeatWrapping
    waterNormals.wrapT = THREE.RepeatWrapping
    waterNormals.repeat.set(8, 8)
    waterNormals.needsUpdate = true
  }, [waterNormals])

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2400, 2400)
    const surface = new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      // 让太阳光正对镜头打下来形成强烈的高光水面反光
      sunDirection: new THREE.Vector3(0, 0.4, -1).normalize(),
      sunColor: 0xffffff,
      // 把底色改为非常清淡透明的蓝色，主要依赖天空倒影
      waterColor: new THREE.Color('#78bfff'),
      // 大幅降低波浪扭曲度，使其接近天空之镜的平滑感
      distortionScale: 0.25,
      fog: true,
    })

    surface.rotation.x = -Math.PI / 2
    surface.position.set(0, -0.24, 0)
    surface.material.transparent = true
    surface.material.opacity = 0.98
    // 拉大水波纹路，显得更“广阔”和高级，涟漪平缓
    surface.material.uniforms.size.value = 1.6

    return surface
  }, [waterNormals])

  useFrame((_, delta) => {
    if (!waterRef.current) {
      return
    }

    waterRef.current.material.uniforms.time.value += delta * 0.35
  })

  return <primitive object={water} ref={waterRef} />
}

export default WaterSurface
