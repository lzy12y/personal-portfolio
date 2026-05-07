import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ImageModal from '../components/ImageModal'

// 生成20张图片的URL（TH1到TH20）
const BASE_URL = 'https://raw.githubusercontent.com/lzy12y/project-picture/main/TH'

const images = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `${BASE_URL}/TH${i + 1}.jpg`,
  alt: `清华大学研究生院二期项目图片 ${i + 1}`,
}))

export default function TsinghuaProject() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  // 自动切换功能
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
      }, 4000) // 每4秒切换一次
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, images.length])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1

  return (
    <>
      {/* 背景模糊效果 */}
      <div
        className="fixed inset-0 -z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl brightness-50"
          onError={(e) => {
            e.target.src = `https://placehold.co/1920x1080/1e293b/94a3b8?text=Image+${currentIndex + 1}`
          }}
        />
      </div>

      {/* 内容容器 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* 返回按钮 */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回作品集
        </Link>

        {/* 项目标题 */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">深圳清华大学研究生院二期</h1>
          <p className="text-white/70 text-lg">
            悬停暂停 | 点击查看详情
          </p>
        </div>

        {/* 主画廊容器 */}
        <div className="relative w-full max-w-full flex items-center justify-center gap-12">
          {/* 左侧模糊图片 - 1920x1080比例 */}
          <button
            onClick={handlePrev}
            className="relative w-[80vw] h-[45vw] max-w-[1600px] max-h-[900px] rounded-2xl overflow-hidden transition-all duration-500 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              src={images[prevIndex].url}
              alt={images[prevIndex].alt}
              className="w-full h-full object-cover filter blur-2xl brightness-70 group-hover:brightness-90 transition-all"
              onError={(e) => {
                e.target.src = `https://placehold.co/1600x900/1e293b/94a3b8?text=Image+${prevIndex + 1}`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>

          {/* 中间主图 - 1920x1080比例 */}
          <button
            onClick={() => setSelectedImage(images[currentIndex])}
            className="relative w-[90vw] h-[50.625vw] max-w-[1920px] max-h-[1080px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group hover:scale-[1.01]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = `https://placehold.co/1920x1080/1e293b/94a3b8?text=Image+${currentIndex + 1}`
              }}
            />
            {/* 悬停时的放大提示 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
            {/* 图片序号 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-base">
              {currentIndex + 1} / {images.length}
            </div>
          </button>

          {/* 右侧模糊图片 - 1920x1080比例 */}
          <button
            onClick={handleNext}
            className="relative w-[80vw] h-[45vw] max-w-[1600px] max-h-[900px] rounded-2xl overflow-hidden transition-all duration-500 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              src={images[nextIndex].url}
              alt={images[nextIndex].alt}
              className="w-full h-full object-cover filter blur-2xl brightness-70 group-hover:brightness-90 transition-all"
              onError={(e) => {
                e.target.src = `https://placehold.co/1600x900/1e293b/94a3b8?text=Image+${nextIndex + 1}`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* 控制提示 */}
        <div className="mt-6 text-white/60 text-sm flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <span>{isPaused ? '已暂停' : '自动播放中'}</span>
        </div>
      </section>

      {/* 图片模态框 */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}
