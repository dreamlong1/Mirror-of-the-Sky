function DebugSlot({ size = [1, 1, 1], color = '#ffffff' }) {
  return (
    <mesh>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
    </mesh>
  )
}

function FloatingAnchors({ debug = false }) {
  return (
    <group name="floating-anchors">
      <group name="boat-slot" position={[0, 0.15, -18]} rotation={[0, 0.18, 0]}>
        {debug ? <DebugSlot size={[7, 1.4, 16]} color="#9bdcff" /> : null}
      </group>

      <group name="sign-slot" position={[7.5, 0.85, -15]} rotation={[0, -0.24, 0]}>
        {debug ? <DebugSlot size={[2.4, 4.5, 1.2]} color="#fefefe" /> : null}
      </group>
    </group>
  )
}

export default FloatingAnchors
