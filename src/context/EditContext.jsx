import { createContext, useContext, useState, useCallback, useRef } from 'react'

const EditContext = createContext(null)

const STORAGE_KEY = 'site_edits'
const AUTH_KEY = 'edit_auth'
const PASSWORD = 'ziyi2024'

function loadEdits() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function saveEdits(edits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits))
}

export function EditProvider({ children }) {
  const [editing, setEditing] = useState(() => {
    // restore editing state from session on initial load
    return sessionStorage.getItem(AUTH_KEY) === '1'
  })
  const [edits, setEdits] = useState(loadEdits)
  const editingRef = useRef(editing)
  editingRef.current = editing

  const get = useCallback((key, fallback) => {
    return edits[key] ?? fallback
  }, [edits])

  const set = useCallback((key, value) => {
    setEdits(prev => {
      const next = { ...prev, [key]: value }
      saveEdits(next)
      return next
    })
  }, [])

  const login = useCallback(() => {
    if (editingRef.current) {
      // already editing → exit
      setEditing(false)
      sessionStorage.removeItem(AUTH_KEY)
      return
    }
    const input = (prompt('Enter edit password:') || '').trim()
    if (input === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setEditing(true)
    } else if (input !== '') {
      alert('Wrong password')
    }
  }, [])

  const exit = useCallback(() => {
    setEditing(false)
    sessionStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <EditContext.Provider value={{ editing, get, set, login, exit }}>
      {children}
    </EditContext.Provider>
  )
}

export function useEdit() {
  return useContext(EditContext)
}
