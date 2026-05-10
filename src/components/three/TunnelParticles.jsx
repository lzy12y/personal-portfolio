import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

const Z_DEPTH = 1000
const BASE_SPEED = 30

// Four real rectangular prisms — one per quadrant, varying aspect ratios
// [width, height, depth]
const CUBOIDS = [
  { id: 0, x: -14, y: 9,  z: -200, size: [11, 18, 70] },
  { id: 1, x: 15,  y: 8,  z: -480, size: [15, 15, 65] },
  { id: 2, x: -13, y: -9, z: -340, size: [17, 11, 75] },
  { id: 3, x: 14,  y: -8, z: -620, size: [14, 14, 70] },
]

// ── center halo particles ─────────────────────────────────────────────
// Small bright points orbiting the vanishing point, velocity-reactive

const HALO_COUNT = 60

function CenterHalo({ velocityRef }) {
  const pointsRef = useRef(null)
  const phases = useRef([])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(HALO_COUNT * 3)
    const arr = []
    for (let i = 0; i < HALO_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.5 + Math.random() * 22
      positions[i * 3]     = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
      arr.push(Math.random() * Math.PI * 2)
    }
    phases.current = arr
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    const geo = pointsRef.current?.geometry
    if (!geo) return

    const vel = velocityRef.current
    const speed = 0.25 + Math.abs(vel) * 0.015
    const pos = geo.attributes.position.array

    for (let i = 0; i < HALO_COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const r = Math.sqrt(pos[ix] ** 2 + pos[iy] ** 2)
      const a = Math.atan2(pos[iy], pos[ix]) + speed * delta * (0.4 + phases.current[i])
      pos[ix] = Math.cos(a) * r
      pos[iy] = Math.sin(a) * r
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="white"
        size={0.6}
        toneMapped={false}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  )
}

// ── center light streaks ──────────────────────────────────────────────
// Fine white lines that fly out from vanishing point toward camera

const STREAK_COUNT = 8

function CenterStreaks({ velocityRef }) {
  const linesRef = useRef(null)
  const stateRef = useRef(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(STREAK_COUNT * 2 * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Per-line random state: [angle, length, speed, currentZ]
    const state = new Float32Array(STREAK_COUNT * 4)
    for (let i = 0; i < STREAK_COUNT; i++) {
      state[i * 4]     = Math.random() * Math.PI * 2   // angle
      state[i * 4 + 1] = 2 + Math.random() * 5          // length
      state[i * 4 + 2] = 1.2 + Math.random() * 3        // speed (units/sec)
      state[i * 4 + 3] = -35 - Math.random() * 25       // currentZ (start behind camera)
    }
    stateRef.current = state
    return geo
  }, [])

  useFrame((_, delta) => {
    const geo = linesRef.current?.geometry
    if (!geo) return
    const state = stateRef.current
    const pos = geo.attributes.position.array
    const vel = velocityRef.current
    const dt = Math.min(delta, 0.1)
    const speedBonus = 1 + Math.abs(vel) * 0.015

    for (let i = 0; i < STREAK_COUNT; i++) {
      const j = i * 4
      const angle  = state[j]
      const length = state[j + 1]
      let speed    = state[j + 2]
      let curZ     = state[j + 3]

      // Move toward camera
      curZ += speed * speedBonus * dt

      // Reset when past camera
      if (curZ > 4) {
        curZ = -40 - Math.random() * 30
        state[j]     = Math.random() * Math.PI * 2   // new random angle on reset
        state[j + 1] = 2 + Math.random() * 5
        state[j + 2] = 1.2 + Math.random() * 3
      }

      state[j + 3] = curZ

      // Radius spreads as line approaches camera
      const r = 0.3 + (curZ + 40) * (22 - 0.3) / (4 + 40) // map curZ [-40,4] → [0.3,22]
      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      const tailZ = curZ - length
      const tailR = Math.max(r * 0.25, 0.1)

      const vi = i * 2 // vertex index base
      // Tail
      pos[vi * 3]     = cosA * tailR
      pos[vi * 3 + 1] = sinA * tailR
      pos[vi * 3 + 2] = tailZ
      // Head
      pos[(vi + 1) * 3]     = cosA * r
      pos[(vi + 1) * 3 + 1] = sinA * r
      pos[(vi + 1) * 3 + 2] = curZ
    }

    geo.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        color="white"
        toneMapped={false}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </lineSegments>
  )
}

// ── cuboid field ──────────────────────────────────────────────────────

const LABELS = ['摄影', '设计', '视频', '创意']
const ENG_LABELS = ['PHOTOGRAPHY', 'DESIGN', 'VIDEO', 'IDEAS']

function CuboidField({ velocityRef, zOffsetRef }) {
  const groupRefs = useRef([])
  const baseZ = useRef(CUBOIDS.map(c => c.z))
  const drift = useRef(0)

  const edgeGeos = useMemo(() =>
    CUBOIDS.map(c => new THREE.EdgesGeometry(new THREE.BoxGeometry(...c.size)))
  , [])

  const chTextures = useMemo(() =>
    LABELS.map(label => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const ctx = canvas.getContext('2d')
      const chars = [...label]
      const fontSize = 340
      ctx.font = `${fontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // vertical layout — stack characters top to bottom
      const cx = 512
      const gap = fontSize * 1.15
      const totalH = (chars.length - 1) * gap
      const startY = 512 - totalH / 2

      chars.forEach((ch, idx) => {
        const y = startY + idx * gap
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'
        ctx.lineWidth = 4
        ctx.strokeText(ch, cx, y)
        ctx.fillStyle = '#ffffff'
        ctx.fillText(ch, cx, y)
      })

      const tex = new THREE.CanvasTexture(canvas)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
  , [])

  const enTextures = useMemo(() =>
    ENG_LABELS.map(word => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const ctx = canvas.getContext('2d')

      // fill entire canvas with repeated English word in a grid
      const fontSize = word.length > 6 ? 52 : 64
      ctx.font = `600 ${fontSize}px "Helvetica Neue", Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(255,255,255,0.22)'

      const cols = word.length > 6 ? 4 : 5
      const cellW = 1024 / cols
      const cellH = fontSize * 1.6
      const rows = Math.ceil(1024 / cellH) + 1

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cellW + cellW / 2
          const y = row * cellH + cellH / 2
          ctx.fillText(word, x, y)
        }
      }

      const tex = new THREE.CanvasTexture(canvas)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
  , [])

  useFrame((_, delta) => {
    const vel = velocityRef.current
    const zOff = zOffsetRef.current
    const dt = Math.min(delta, 0.1)

    drift.current += vel * 70 * dt
    if (drift.current > 600) drift.current -= 600
    if (drift.current < -600) drift.current += 600

    CUBOIDS.forEach((c, i) => {
      const group = groupRefs.current[i]
      if (!group) return

      baseZ.current[i] += BASE_SPEED * dt
      let displayZ = baseZ.current[i] + zOff + drift.current

      if (displayZ > 5) {
        baseZ.current[i] = -Z_DEPTH - Math.random() * 250
        displayZ = baseZ.current[i] + zOff + drift.current
      }

      group.position.set(c.x, c.y, displayZ)
    })
  })

  return (
    <>
      {CUBOIDS.map((c, i) => (
        <group
          key={c.id}
          ref={(el) => { groupRefs.current[i] = el }}
          position={[c.x, c.y, c.z]}
          frustumCulled={false}
        >
          <mesh>
            <boxGeometry args={c.size} />
            <meshStandardMaterial
              color="white"
              toneMapped={false}
              roughness={0.4}
              metalness={0}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={edgeGeos[i]}>
            <lineBasicMaterial
              color="#0a0a0a"
              toneMapped={false}
            />
          </lineSegments>
          {/* English text — full-face background grid, avoids Chinese area */}
          <mesh position={[0, 0, c.size[2] / 2 + 0.03]}>
            <planeGeometry args={[c.size[0] * 0.96, c.size[1] * 0.96]} />
            <meshBasicMaterial
              map={enTextures[i]}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          {/* Chinese text — offset toward vanishing point, sits on top */}
          <mesh position={[
            -Math.sign(c.x) * c.size[0] * 0.28,
            -Math.sign(c.y) * c.size[1] * 0.28,
            c.size[2] / 2 + 0.06,
          ]}>
            <planeGeometry args={[c.size[0] * 0.65, c.size[1] * 0.65]} />
            <meshBasicMaterial
              map={chTextures[i]}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

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
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 8]} intensity={0.9} />

      <CenterHalo velocityRef={velocityRef} />
      <CenterStreaks velocityRef={velocityRef} />
      <CuboidField velocityRef={velocityRef} zOffsetRef={zOffsetRef} />

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
