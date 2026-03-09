import { Suspense } from 'react'
import CameraRig from './CameraRig.jsx'
import SkyEnvironment from './SkyEnvironment.jsx'
import WaterSurface from './WaterSurface.jsx'
import AtmosphereParticles from './AtmosphereParticles.jsx'
import FloatingAnchors from './FloatingAnchors.jsx'

function SeaSkyScene() {
  return (
    <>
      <CameraRig />

      <ambientLight intensity={1.2} color="#ffffff" />
      <hemisphereLight intensity={1.8} color="#e0f0ff" groundColor="#3ca5ff" />
      {/* 强光主太阳，制造高光和白天的通透感 */}
      <directionalLight intensity={5.5} position={[0, 15, -120]} color="#ffffff" />
      {/* 辅助柔化光线 */}
      <directionalLight intensity={1.5} position={[-30, 10, -10]} color="#b2d8ff" />

      <Suspense fallback={null}>
        <SkyEnvironment />
        <WaterSurface />
      </Suspense>

      <AtmosphereParticles />
    </>
  )
}

export default SeaSkyScene
