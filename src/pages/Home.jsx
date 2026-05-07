import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const PHRASES = ['艺术家', '设计师', '创意爱好者']
const TYPING_SPEED = 120
const DELETING_SPEED = 60
const PAUSE = 2000

function useTypewriter(phrases) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    let timeout

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), PAUSE)
    } else if (deleting && text === '') {
      setDeleting(false)
      setPhraseIndex((phraseIndex + 1) % phrases.length)
    } else {
      timeout = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
      }, deleting ? DELETING_SPEED : TYPING_SPEED)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, phraseIndex, phrases])

  return text
}

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    const createParticles = () => {
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 8000)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`
        ctx.fill()
      }

      // draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()
    window.addEventListener('resize', () => { resize(); createParticles() })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

export default function Home() {
  const canvasRef = useRef(null)
  const typed = useTypewriter(PHRASES)

  useParticles(canvasRef)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950" />

      {/* particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">
          李子易个人作品集
        </h1>
        <div className="h-10 flex items-center justify-center">
          <span className="text-xl sm:text-2xl text-blue-300 font-mono">
            {typed}
            <span className="animate-pulse">|</span>
          </span>
        </div>
        <p className="mt-6 text-gray-400 max-w-xl mx-auto text-lg">
          热爱技术与设计，致力于构建优雅的数字体验
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/portfolio"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/25"
          >
            查看作品
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 border border-gray-500 text-gray-300 hover:text-white hover:border-white rounded-lg font-medium transition-colors"
          >
            了解更多
          </Link>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
