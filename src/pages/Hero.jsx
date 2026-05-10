import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SIDE_LINKS = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about',     label: 'About' },
  { to: '/contact',   label: 'Contact' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [exiting, setExiting] = useState(false)

  const handleClick = () => setExiting(true)

  return (
    <div
      className="fixed inset-0 bg-[#050505] flex items-center justify-center cursor-pointer z-50"
      onClick={handleClick}
    >
      {/* subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <AnimatePresence onExitComplete={() => navigate('/tunnel')}>
        {!exiting && (
          <>
            {/* name behind photo */}
            <motion.p
              key="name"
              className="absolute text-white text-[128px] font-thin tracking-[1.5em] select-none pointer-events-none"
              style={{
                fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif',
                fontWeight: 100,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
              }}
              exit={{
                scale: 2.5,
                filter: 'blur(20px)',
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeIn' }}
            >
              LIZIYI
            </motion.p>

            {/* photo — edges blurred into black via mask */}
            <motion.img
              key="photo"
              src="/images/me+.png"
              alt="me"
              className="relative z-10 w-auto max-h-[70vh] max-w-[70vw] object-contain select-none"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 58%, transparent 92%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 58%, transparent 92%)',
              }}
              exit={{
                scale: 3.5,
                filter: 'blur(28px)',
                opacity: 0,
              }}
              transition={{ duration: 0.55, ease: 'easeIn' }}
            />

            {/* caption — bottom left of page */}
            <motion.div
              key="caption"
              className="absolute bottom-8 left-[12%] flex items-end gap-4"
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: 'easeIn' }}
            >
              <span className="block w-12 h-px bg-white mb-2 flex-shrink-0" />
              <p
                className="text-white text-[24px] font-thin tracking-[-0.01em] select-none"
                style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 100, lineHeight: 1.55 }}
              >
                Hello, I am Li Ziyi,<br />
                a designer and creator,<br />
                looking for new ideas and creativity
              </p>
            </motion.div>

            {/* right-edge vertical nav */}
            <motion.nav
              key="sidenav"
              className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-12 select-none"
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
            >
              {SIDE_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={e => e.stopPropagation()}
                  className="text-white text-[14px] font-thin tracking-[0.12em]"
                  style={{
                    fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif',
                    fontWeight: 100,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>

            {/* hint */}
            <motion.p
              key="hint"
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/10 text-[10px] font-mono tracking-[0.3em] select-none"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              CLICK TO ENTER · 点击进入
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
