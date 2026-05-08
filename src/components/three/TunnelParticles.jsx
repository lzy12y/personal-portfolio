import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

const COUNT = 500
const Z_DEPTH = 1000
const SPREAD_X = 28
const SPREAD_Y = 20

//
// InstancedMesh 粒子场
// - 滚动位置 → 控制远近（zOffsetRef）
// - 滚动速度 → 额外漂移（velocityRef）
// - 薄片朝向消失点（径向旋转）
//
function ParticleField({ velocityRef, zOffsetRef }) {
  const meshRef = useRef(null)
  const baseZ = useRef(new Float32Array(COUNT))
  const drift = useRef(0)

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const dummy = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scl = new THREE.Vector3()

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X
      const y = (Math.random() - 0.5) * SPREAD_Y
      const z = -Math.random() * Z_DEPTH
      baseZ.current[i] = z

      // 朝向消失点：长轴沿径向对齐
      const angle = Math.atan2(y, x)
      quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle)

      scl.set(
        0.008 + Math.random() * 0.022,
        0.3 + Math.random() * 2.8,
        0.02 + Math.random() * 0.35,
      )

      pos.set(x, y, z)
      dummy.compose(pos, quat, scl)
      mesh.setMatrixAt(i, dummy)
    }

    mesh.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const vel = velocityRef.current
    const zOff = zOffsetRef.current

    // 速度驱动的漂移累积
    drift.current += vel * 70 * delta
    if (drift.current > 600) drift.current -= 600
    if (drift.current < -600) drift.current += 600

    const dummy = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scl = new THREE.Vector3()

    for (let i = 0; i < COUNT; i++) {
      mesh.getMatrixAt(i, dummy)
      dummy.decompose(pos, quat, scl)

      const displayZ = baseZ.current[i] + zOff + drift.current

      // 飞过镜头 → 回绕到隧道远端
      if (displayZ > 5) {
        baseZ.current[i] = -Z_DEPTH + Math.random() * 12
        const nx = (Math.random() - 0.5) * SPREAD_X
        const ny = (Math.random() - 0.5) * SPREAD_Y
        pos.x = nx
        pos.y = ny
        const angle = Math.atan2(ny, nx)
        quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle)
      }

      pos.z = displayZ

      dummy.compose(pos, quat, scl)
      mesh.setMatrixAt(i, dummy)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, COUNT]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="white" toneMapped={false} />
    </instancedMesh>
  )
}

//
// Three.js Canvas 容器
//
export default function TunnelParticles({ velocityRef, zOffsetRef }) {
  return (
    <Canvas
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{ antialias: false, alpha: true }}
      camera={{ fov: 38, near: 0.1, far: 1500, position: [0, 0, 0] }}
    >
      <ParticleField velocityRef={velocityRef} zOffsetRef={zOffsetRef} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={1.5}
          radius={0.4}
        />
        <Noise opacity={0.025} />
      </EffectComposer>
    </Canvas>
  )
}
