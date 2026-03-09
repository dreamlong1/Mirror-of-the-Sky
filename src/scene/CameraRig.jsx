import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const basePosition = new THREE.Vector3(0, 2.6, 13.5)
const baseTarget = new THREE.Vector3(0, 1.05, -42)
const nextPosition = new THREE.Vector3()
const nextTarget = new THREE.Vector3()

function CameraRig() {
  const camera = useThree((state) => state.camera)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    nextPosition.set(
      basePosition.x + state.pointer.x * 0.95,
      basePosition.y + state.pointer.y * 0.45 + Math.sin(t * 0.18) * 0.08,
      basePosition.z + Math.cos(t * 0.15) * 0.25,
    )

    nextTarget.set(
      baseTarget.x + state.pointer.x * 0.7,
      baseTarget.y + state.pointer.y * 0.15,
      baseTarget.z,
    )

    camera.position.lerp(nextPosition, 1 - Math.exp(-delta * 1.8))
    camera.lookAt(nextTarget)
  })

  return null
}

export default CameraRig
