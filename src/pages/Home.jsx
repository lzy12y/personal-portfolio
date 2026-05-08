import PerspectiveContainer from '../components/three/PerspectiveContainer'

export default function Home() {
  return (
    <>
      {/* 滚动驱动层 — 创造 400vh 滚动空间 */}
      <div style={{ height: '400vh' }} />
      {/* 固定 3D 场景 */}
      <PerspectiveContainer />
    </>
  )
}
