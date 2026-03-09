import { Environment, Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'

function SkyEnvironment() {
  return (
    <>
      {/* 纯净的宝石天蓝底色 */}
      <color attach="background" args={['#64aaff']} />

      {/* 极高亮度的发光球，借助后期的 Bloom 泛化成大太阳 */}
      <mesh position={[0, 75, -350]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color={[6, 6, 6]} transparent opacity={1} fog={false} />
      </mesh>

      {/* ===== 云朵系统 ===== */}
      {/* 使用 MeshBasicMaterial 确保云朵纯白通透、不受复杂光照影响 */}
      <Clouds limit={800} material={THREE.MeshBasicMaterial}>

        {/* --- 太阳周围：左右两侧分开，露出太阳光芒 --- */}
        <Cloud
          seed={1}
          bounds={[70, 12, 50]}
          segments={80}
          volume={28}
          color="#ffffff"
          opacity={0.92}
          position={[-80, 95, -280]}
        />
        <Cloud
          seed={2}
          bounds={[65, 12, 50]}
          segments={80}
          volume={26}
          color="#ffffff"
          opacity={0.9}
          position={[75, 90, -270]}
        />
        {/* 太阳正上方薄云，营造光线穿透感 */}
        <Cloud
          seed={3}
          bounds={[100, 8, 40]}
          segments={50}
          volume={16}
          color="#f8fcff"
          opacity={0.55}
          position={[0, 105, -290]}
        />

        {/* --- 天空右上区域：大朵分散积云 --- */}
        <Cloud
          seed={10}
          bounds={[50, 14, 35]}
          segments={65}
          volume={24}
          color="#ffffff"
          opacity={0.88}
          position={[180, 120, -320]}
        />
        <Cloud
          seed={11}
          bounds={[35, 10, 25]}
          segments={45}
          volume={18}
          color="#ffffff"
          opacity={0.82}
          position={[250, 135, -350]}
        />

        {/* --- 天空左上区域：高处的孤立积云 --- */}
        <Cloud
          seed={20}
          bounds={[45, 12, 30]}
          segments={55}
          volume={22}
          color="#ffffff"
          opacity={0.85}
          position={[-200, 130, -310]}
        />
        <Cloud
          seed={21}
          bounds={[30, 10, 22]}
          segments={40}
          volume={15}
          color="#fdfeff"
          opacity={0.78}
          position={[-280, 110, -360]}
        />

        {/* --- 中部偏远：地平线附近低矮的扁平云 --- */}
        <Cloud
          seed={30}
          bounds={[90, 6, 40]}
          segments={50}
          volume={12}
          color="#f0f7ff"
          opacity={0.6}
          position={[-120, 55, -400]}
        />
        <Cloud
          seed={31}
          bounds={[80, 6, 35]}
          segments={45}
          volume={10}
          color="#eef5ff"
          opacity={0.55}
          position={[140, 50, -420]}
        />

        {/* --- 两侧中低空：让天空两边也有云的存在感 --- */}
        <Cloud
          seed={40}
          bounds={[55, 15, 35]}
          segments={60}
          volume={25}
          color="#ffffff"
          opacity={0.86}
          position={[320, 80, -250]}
        />
        <Cloud
          seed={41}
          bounds={[40, 12, 28]}
          segments={50}
          volume={20}
          color="#ffffff"
          opacity={0.8}
          position={[-340, 75, -260]}
        />

        {/* --- 小朵零散点缀：增加随机感 --- */}
        <Cloud
          seed={50}
          bounds={[22, 8, 18]}
          segments={30}
          volume={12}
          color="#ffffff"
          opacity={0.75}
          position={[160, 100, -230]}
        />
        <Cloud
          seed={51}
          bounds={[25, 9, 20]}
          segments={32}
          volume={14}
          color="#ffffff"
          opacity={0.72}
          position={[-150, 110, -240]}
        />
        <Cloud
          seed={52}
          bounds={[18, 7, 15]}
          segments={25}
          volume={10}
          color="#fafeff"
          opacity={0.68}
          position={[100, 140, -280]}
        />
        <Cloud
          seed={53}
          bounds={[20, 8, 16]}
          segments={28}
          volume={11}
          color="#fafeff"
          opacity={0.65}
          position={[-60, 145, -300]}
        />
      </Clouds>

      {/* 补充一个微弱的全景反射供海水吸取天光 */}
      <Environment background={false} preset="city" environmentIntensity={0.8} />
    </>
  )
}

export default SkyEnvironment
