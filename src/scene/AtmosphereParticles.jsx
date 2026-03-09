import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AtmosphereParticles() {
  const pointsRef = useRef(null)

  const positions = useMemo(() => {
    // 增加粒子数，让光流更致密
    const count = 3000
    const data = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const stride = i * 3
      // 让粒子汇聚在中间极窄的河流地带
      data[stride] = THREE.MathUtils.randFloatSpread(10)
      // 严格贴近水面（水面Y是在-0.24左右），制造悬浮反光感
      data[stride + 1] = THREE.MathUtils.randFloat(0.01, 0.4)
      // 均匀的分布在深远到底部的Z轴
      data[stride + 2] = THREE.MathUtils.randFloat(-200, 30)
    }

    return data
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return
    }

    // 动态更新粒子的 Z 轴实现流向镜头的动画
    const posAttribute = pointsRef.current.geometry.attributes.position
    const array = posAttribute.array

    for (let i = 0; i < array.length; i += 3) {
      // 粒子向镜头 (+Z方向) 移动，并加一点稍微飘逸的横行摆动
      array[i + 2] += delta * 22
      array[i] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005

      // 当粒子飞过镜头后，让它重新循环回远端
      if (array[i + 2] > 20) {
        array[i + 2] = -300
      }
    }

    posAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* 调小发光粒子的尺寸，使其显得如星尘一般细碎精致，而非大块方块 */}
      <pointsMaterial
        color="#00FFFF"
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default AtmosphereParticles
