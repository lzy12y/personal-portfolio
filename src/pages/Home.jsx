import PerspectiveContainer from '../components/three/PerspectiveContainer'

export default function Home() {
  return (
    <>
      {/* 滚动驱动层 — 100vh */}
      <div style={{ height: '100vh' }} />
      {/* 固定 3D 场景 */}
      <PerspectiveContainer />
    </>
  )
}
