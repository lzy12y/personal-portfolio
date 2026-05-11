import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, useScroll, useVelocity, useTransform, useMotionValueEvent } from 'framer-motion'
import TunnelParticles from './TunnelParticles'

const PLANES = [
  { id: 'left',   label: '摄影', sublabel: 'PHOTOGRAPHY',  icon: '📷' },
  { id: 'right',  label: '设计', sublabel: 'DESIGN',       icon: '🏛' },
  { id: 'top',    label: '视频', sublabel: 'VIDEO',        icon: '🎬' },
  { id: 'bottom', label: '创意', sublabel: 'IDEAS',        icon: '💡' },
]

// fit tunnel surfaces: left/right walls, ceiling, floor
const POSITION = {
  left:   'translate(-50%, -50%) translateX(-32vw) rotateY(-75deg)',
  right:  'translate(-50%, -50%) translateX(32vw) rotateY(75deg)',
  top:    'translate(-50%, -50%) translateY(-32vh) rotateX(75deg)',
  bottom: 'translate(-50%, -50%) translateY(32vh) rotateX(-75deg)',
}

// ceiling/floor → wide panels; left/right walls → tall panels
const DIMENSIONS = {
  top:    { w: 520, h: 120 },
  bottom: { w: 520, h: 120 },
  left:   { w: 140, h: 380 },
  right:  { w: 140, h: 380 },
}

// Z offsets per spec: top=-100, bottom=100
const Z_OFFSET = { top: -100, bottom: 100, left: 0, right: 50 }

//
// 消失点放射光束 — 从远方而来的光线，随速度增强
//
function LightRays({ velocity }) {
  const rayOpacity = useTransform(velocity, [0, 400], [0.45, 1])

  const beams = useMemo(() => {
    const angles = [12, 68, 135, 190, 240, 295, 340]
    return angles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180
      return { rad, key: i, len: 55 + (i % 3) * 35 }
    })
  }, [])

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: rayOpacity, filter: 'blur(1.5px)' }}
    >
      <defs>
        {beams.map(({ key, rad }) => {
          const gx = 50 + Math.cos(rad) * 50
          const gy = 50 + Math.sin(rad) * 50
          return (
            <linearGradient
              key={key}
              id={`beam-${key}`}
              x1="50%"
              y1="50%"
              x2={`${gx}%`}
              y2={`${gy}%`}
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="15%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          )
        })}
      </defs>
      {beams.map(({ rad, len, key }) => {
        const x = 50 + Math.cos(rad) * len
        const y = 50 + Math.sin(rad) * len
        return (
          <line
            key={key}
            x1="50%"
            y1="50%"
            x2={`${x}%`}
            y2={`${y}%`}
            stroke={`url(#beam-${key})`}
            strokeWidth="2"
          />
        )
      })}
    </motion.svg>
  )
}

//
// 透视引导线 — 随速度微颤
//
function GuideLines({ velocity }) {
  const jitter = useTransform(velocity, [0, 600], [0, 2.5])
  const [tremble, setTremble] = useState(0)
  useMotionValueEvent(jitter, 'change', (v) => setTremble(v))

  const lines = useMemo(() => {
    const result = []
    for (let i = 0; i < 24; i++) {
      const deg = i * 15
      const rad = (deg * Math.PI) / 180
      result.push({ rad, key: i, major: deg % 90 === 0 })
    }
    return result
  }, [])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.18, zIndex: 1 }}
    >
      {lines.map(({ rad, key, major }) => {
        const length = 300
        const jRad = (tremble * Math.PI) / 180
        const x = 50 + Math.cos(rad + jRad) * length
        const y = 50 + Math.sin(rad + jRad) * length
        return (
          <line
            key={key}
            x1="50%"
            y1="50%"
            x2={`${x}%`}
            y2={`${y}%`}
            stroke={major ? '#333' : '#1a1a1a'}
            strokeWidth={major ? '0.5' : '0.3'}
          />
        )
      })}
    </svg>
  )
}

//
// single tunnel surface panel
//
function PlanePanel({ plane, cameraDepth, velocityBlur, velocityScaleY }) {
  const localZ      = useTransform(cameraDepth, (v) => v + Z_OFFSET[plane.id])
  const planeScale  = useTransform(localZ, [-500, 200], [0.28, 1.1])
  const planeOpacity = useTransform(localZ, [-500, -200], [0.03, 1])
  const depthBlur   = useTransform(localZ, [-500, 0], [6, 0])
  const totalBlur   = useTransform(
    [depthBlur, velocityBlur],
    ([d, v]) => `blur(${Math.max(d, v)}px)`,
  )
  // 合成完整 3D transform：translateZ + scale + velocity scaleY
  const fullTransform = useTransform(
    [localZ, planeScale, velocityScaleY],
    ([z, s, vy]) => `translateZ(${z}px) scale(${s}) scaleY(${vy})`,
  )

  const dim = DIMENSIONS[plane.id]

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: fullTransform,
        opacity: planeOpacity,
        filter: totalBlur,
      }}
    >
      <div
        style={{
          transform: POSITION[plane.id],
          transformStyle: 'preserve-3d',
        }}
      >
        {/* wall panel — monochrome, no color */}
        <div
          className="relative"
          style={{
            width: `${dim.w}px`,
            height: `${dim.h}px`,
            marginLeft: `${-dim.w / 2}px`,
            marginTop: `${-dim.h / 2}px`,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* faint grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* label + icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <span className="text-base opacity-30" style={{ filter: 'grayscale(1)' }}>
              {plane.icon}
            </span>
            <span className="text-xs font-medium tracking-[0.15em] text-white/55">
              {plane.label}
            </span>
            <span className="text-[8px] font-mono tracking-[0.3em] text-white/15 uppercase">
              {plane.sublabel}
            </span>
          </div>

          {/* subtle inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.015)' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

//
// === PerspectiveContainer ===
//
export default function PerspectiveContainer() {
  const { scrollYProgress, scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  // camera depth: scroll 0→1 maps to Z -500→200 (far → near)
  const cameraDepth = useTransform(scrollYProgress, [0, 1], [-500, 200])

  // 速度 ref — 供 R3F 粒子系统读取
  const velocityRef = useRef(0)
  useMotionValueEvent(scrollVelocity, 'change', (v) => {
    velocityRef.current = v
  })

  // 粒子 Z 偏移 — 滚动位置直接控制远近（-100 深 → 5 近）
  const particleZ = useTransform(scrollYProgress, [0, 1], [-100, 5])
  const particleZRef = useRef(-100)
  useMotionValueEvent(particleZ, 'change', (v) => {
    particleZRef.current = v
  })

  // velocity-driven effects — 阈值 600 让反馈更敏锐
  const velocityBlur   = useTransform(scrollVelocity, [0, 600], [0, 15])
  const velocityScaleY  = useTransform(scrollVelocity, [0, 600], [1, 1.3])

  // 键盘 ↑↓ 控制 — RAF 平滑滚动
  useEffect(() => {
    const keyState = { up: false, down: false }
    const SPEED = 2 // px/frame

    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp')    { e.preventDefault(); keyState.up = true }
      if (e.key === 'ArrowDown')  { e.preventDefault(); keyState.down = true }
    }
    const onKeyUp = (e) => {
      if (e.key === 'ArrowUp')    keyState.up = false
      if (e.key === 'ArrowDown')  keyState.down = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let raf
    const tick = () => {
      if (keyState.up)   window.scrollBy(0, -SPEED)
      if (keyState.down) window.scrollBy(0, SPEED)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden z-0">
      {/* --- Three.js 粒子场（底层） --- */}
      <TunnelParticles velocityRef={velocityRef} zOffsetRef={particleZRef} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          perspective: '300px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* --- vanishing point glow (enhanced) --- */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* 超大外层 — 弥散柔光 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '260px',
              height: '260px',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          {/* 中层光晕 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '120px',
              height: '120px',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.06) 35%, transparent 65%)',
              filter: 'blur(35px)',
            }}
          />
          {/* 内层光晕 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '40px',
              height: '40px',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              filter: 'blur(12px)',
            }}
          />
          {/* 呼吸光环 1 — 主环 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: '70px',
              height: '70px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.12, 0.55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 呼吸光环 2 — 更大更慢 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: '110px',
              height: '110px',
              border: '1px solid rgba(255,255,255,0.025)',
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.06, 0.35] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          {/* 呼吸光环 3 — 小且快 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          {/* 中心亮点 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '4px',
              height: '4px',
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 20px 8px rgba(255,255,255,0.55), 0 0 60px 20px rgba(255,255,255,0.15)',
            }}
          />
        </div>

        {/* --- light rays from vanishing point --- */}
        <LightRays velocity={scrollVelocity} />

        {/* --- guide lines (velocity-trembling) --- */}
        <GuideLines velocity={scrollVelocity} />

        {/* --- 3D scene layer --- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            zIndex: 2,
          }}
        >
          {PLANES.map((plane) => (
            <PlanePanel
              key={plane.id}
              plane={plane}
              cameraDepth={cameraDepth}
              velocityBlur={velocityBlur}
              velocityScaleY={velocityScaleY}
            />
          ))}
        </div>

        {/* --- bottom hint --- */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/10 text-[10px] font-mono tracking-[0.3em] pointer-events-none select-none"
          style={{ zIndex: 10 }}
        >
          SCROLL TO EXPLORE · TIME TUNNEL
        </div>
      </div>
    </div>
  )
}
