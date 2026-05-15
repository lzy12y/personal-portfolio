import { useEffect } from 'react'
import { useEdit } from '../context/EditContext'

export default function EditToggle() {
  const { editing, login, exit } = useEdit()

  // keyboard shortcut: Ctrl+Shift+E
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        login()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [login])

  return (
    <>
      {/* hidden corner trigger */}
      <button
        onClick={login}
        className="fixed bottom-2 right-2 w-4 h-4 opacity-0 hover:opacity-10 bg-white rounded-full transition-opacity z-[999]"
        title="Edit mode"
      />

      {/* editing indicator */}
      {editing && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 bg-white/[0.06] backdrop-blur border border-white/[0.08] rounded-full px-5 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/80 animate-pulse" />
          <span className="text-white/50 text-[10px] font-mono tracking-[0.2em]">EDITING</span>
          <button
            onClick={exit}
            className="text-white/25 hover:text-white/50 text-[10px] font-mono tracking-[0.15em] transition-colors"
          >
            EXIT
          </button>
        </div>
      )}
    </>
  )
}
