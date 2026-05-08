import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PLANES = [
  { id: 'top', label: '视频', sublabel: 'VIDEO', color: '#4ECDC4', icon: '🎬' },
  { id: 'right', label: '设计', sublabel: 'DESIGN', color: '#45B7D1', icon: '🏛' },
  { id: 'bottom', label: '创意', sublabel: 'IDEAS', color: '#FF6B6B', icon: '💡' },
  { id: 'left', label: '摄影', sublabel: 'PHOTOGRAPHY', color: '#96CEB4', icon: '📷' },
]

const POSITION = {
  top:    'translate(-50%, -50%) translateY(-35vh) rotateX(15deg)',
  bottom: 'translate(-50%, -50%) translateY(35vh) rotateX(-15deg)',
  left:   'translate(-50%, -50%) translateX(-35vw) rotateY(15deg)',
  right:  'translate(-50%, -50%) translateX(35vw) rotateY(-15deg)',
}

// 每个平面不同的 Z 轴深度区间
const ZONE = [
  [280, -40],  // top - 起始最深
  [230, -10],  // right
  [190,  10],  // bottom
  [150,  30],  // left - 起始最浅
]

function GuideLines() {
  const lines = useMemo(() => {
    const result = []
    for (let i = 0; i < 24; i++) {
      const deg = i * 15
      const rad = (deg * Math.PI) / 180
      const length = 300
      const x = 50 + Math.cos(rad) * length
      const y = 50 + Math.sin(rad) * length
      result.push({ x, y, key: i, major: deg % 90 === 0 })
    }
    return result
  }, [])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.25, zIndex: 1 }}
    >
      {lines.map(({ x, y, key, major }) => (
        <line
          key={key}
          x1="50%"
          y1="50%"
          x2={`${x}%`}
          y2={`${y}%`}
          stroke={major ? '#333' : '#1a1a1a'}
          strokeWidth={major ? '0.8' : '0.4'}
        />
      ))}
    </svg>
  )
}

//
// 单个 3D 平面 — 独立组件以保证 hooks 规则
//
function PlanePanel({ plane, index, cameraDepth }) {
  const planeZ = useTransform(cameraDepth, [0, 320], ZONE[index])
  const planeOpacity = useTransform(cameraDepth, [0, 160], [0.12, 1])
  const planeScale = useTransform(cameraDepth, [0, 200], [0.45, 1])
  const blurValue = useTransform(cameraDepth, [0, 300], [8, 0])
  const blurFilter = useTransform(blurValue, (v) => `blur(${v}px)`)

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        z: planeZ,
        opacity: planeOpacity,
        scale: planeScale,
        filter: blurFilter,
      }}
    >
      {/* 静态 3D 定位 */}
      <div
        style={{
          transform: POSITION[plane.id],
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: '340px',
            height: '220px',
            marginLeft: '-170px',
            marginTop: '-110px',
            background: `linear-gradient(135deg, ${plane.color}0A, ${plane.color}03)`,
            border: `1px solid ${plane.color}20`,
            boxShadow: `0 0 100px ${plane.color}08, inset 0 0 60px ${plane.color}04`,
          }}
        >
          {/* 网格纹理 */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />

          {/* 内容区 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl mb-3" style={{ filter: 'grayscale(0.3)' }}>
              {plane.icon}
            </span>
            <span
              className="text-2xl font-bold tracking-[0.2em] mb-1"
              style={{ color: plane.color }}
            >
              {plane.label}
            </span>
            <span className="text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase">
              {plane.sublabel}
            </span>
          </div>

          {/* 面板边缘微光 */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 40px ${plane.color}08`,
            }}
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
  const { scrollYProgress } = useScroll()
  const cameraDepth = useTransform(scrollYProgress, [0, 1], [0, 320])

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden z-0">
      {/* === 3D 透视环境 === */}
      <div
        className="absolute inset-0"
        style={{
          perspective: '400px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* ---------- 消失点光晕 ---------- */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '80px',
              height: '80px',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '4px',
              height: '4px',
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 12px 4px rgba(255,255,255,0.5)',
            }}
          />
        </div>

        {/* ---------- 透视引导线 ---------- */}
        <GuideLines />

        {/* ---------- 3D 场景层 ---------- */}
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            zIndex: 2,
          }}
        >
          {PLANES.map((plane, i) => (
            <PlanePanel
              key={plane.id}
              plane={plane}
              index={i}
              cameraDepth={cameraDepth}
            />
          ))}
        </div>

        {/* ---------- 底部提示 ---------- */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-mono tracking-[0.3em] pointer-events-none select-none"
          style={{ zIndex: 10 }}
        >
          SCROLL TO EXPLORE · TIME TUNNEL
        </div>
      </div>
    </div>
  )
}
