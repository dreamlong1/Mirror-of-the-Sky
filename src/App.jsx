import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import './App.css'
import SeaSkyScene from './scene/SeaSkyScene.jsx'

function App() {
  return (
    <div className="app-shell">
      <Canvas
        className="sea-canvas"
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.6, 13.5], fov: 48, near: 0.1, far: 3000 }}
        gl={{ antialias: true }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          // 因为去掉了物理大太阳，调回常规的稍亮曝光
          gl.toneMappingExposure = 1.15
          // 更换回雾效，用白色模拟海平面处的天地交接的模糊感
          scene.fog = new THREE.FogExp2('#d6ebff', 0.0022)
        }}
      >
        <SeaSkyScene />
        <EffectComposer>
          <Bloom
            // 因为现在天是宝石蓝、太阳是白底纯色圆盘，我们可以开启较强光晕产生梦幻感
            intensity={0.25}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.15}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div className="hud-layer">
        <div className="hero-card">
          <h1>Mirror of the Sky</h1>
        </div>


      </div>

      <Loader
        dataStyles={{
          color: '#f4fbff',
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
        barStyles={{
          background: 'linear-gradient(90deg, #f7fbff, #8fd8ff)',
          height: '3px',
        }}
        containerStyles={{
          background:
            'radial-gradient(circle at top, rgba(109, 158, 255, 0.65), rgba(16, 29, 73, 0.92))',
        }}
      />
    </div>
  )
}

export default App
