import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ImageModal from '../components/ImageModal'
import EditableText from '../components/EditableText'

const BASE_URL = 'https://raw.githubusercontent.com/lzy12y/project-picture/main/TH'
const images = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `${BASE_URL}/TH${i + 1}.jpg`,
  alt: `清华大学研究生院二期 — ${i + 1}`,
}))

export default function TsinghuaProject() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }, [])

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [])

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(next, 4000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, next])

  return (
    <div className="bg-[#050505] min-h-screen flex">
      <div className="flex flex-col lg:flex-row w-full">
        {/* ── Left: project info ── */}
        <div className="lg:w-[38%] flex flex-col justify-center px-8 lg:px-14 py-16 lg:py-24">
          {/* back */}
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-white/20 hover:text-white/45 transition-colors text-[11px] font-mono tracking-[0.2em] mb-16"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK
          </Link>

          {/* category */}
          <p className="text-white/15 text-[10px] font-mono tracking-[0.3em] mb-6">
            <EditableText id="tsinghua.category" fallback="ARCHITECTURE · ACADEMIC" />
          </p>

          {/* title */}
          <h1
            className="text-white text-3xl lg:text-4xl leading-tight tracking-[-0.01em] mb-8"
            style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 100 }}
          >
            <EditableText id="tsinghua.title" fallback="深圳清华大学研究生院二期" as="span" />
          </h1>

          {/* description */}
          <div className="space-y-4 text-white/40 text-sm leading-relaxed mb-10">
            <p>
              <EditableText
                id="tsinghua.desc1"
                fallback="大型学术建筑项目，位于深圳清华大学研究生院校园内。项目涵盖教学楼、实验中心及公共交流空间，总面积逾 40,000 平方米。"
                as="span"
              />
            </p>
            <p>
              <EditableText
                id="tsinghua.desc2"
                fallback={`设计以“知识方舟”为核心概念，通过体量穿插与架空处理，在严谨的学术氛围中注入流动性与开放性。运用 AIGC 技术辅助多轮方案推敲与效果图表达，实现从概念到视觉的高质量转化。`}
                as="span"
              />
            </p>
          </div>

          {/* metadata */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              ['tsinghua.meta.location', '地点', '深圳 · 南山'],
              ['tsinghua.meta.type', '类型', '学术建筑'],
              ['tsinghua.meta.area', '面积', '~40,000 m²'],
              ['tsinghua.meta.status', '状态', '方案阶段'],
            ].map(([id, label, fallback]) => (
              <div key={id}>
                <p className="text-white/20 text-[10px] font-mono tracking-[0.15em] mb-1">{label}</p>
                <p className="text-white/50 text-sm">
                  <EditableText id={id} fallback={fallback} />
                </p>
              </div>
            ))}
          </div>

          {/* tags */}
          <div className="flex flex-wrap gap-2">
            {['Revit', 'AIGC', 'Photoshop', 'Rhino', 'Lumion'].map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 text-[10px] tracking-[0.08em] border border-white/[0.06] text-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: image carousel ── */}
        <div
          className="lg:w-[62%] relative flex items-center justify-center bg-white/[0.01]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-6 lg:p-12">
            {/* current image */}
            <button
              onClick={() => setSelectedImage(images[currentIndex])}
              className="group relative w-full max-h-[80vh] aspect-[16/10] overflow-hidden"
            >
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-500"
                onError={(e) => {
                  e.target.src = `https://placehold.co/1920x1080/1e293b/94a3b8?text=Image+${currentIndex + 1}`
                }}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.02] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </button>

            {/* prev / next */}
            <button
              onClick={prev}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/20 text-[10px] font-mono tracking-[0.2em]">
              <span className={isPaused ? 'text-white/15' : 'text-white/25'}>{isPaused ? '◼' : '▶'}</span>
              <span>{String(currentIndex + 1).padStart(2, '0')} / {images.length}</span>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  )
}
