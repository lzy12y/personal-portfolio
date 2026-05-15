import { useState, useRef, useEffect } from 'react'
import { useEdit } from '../context/EditContext'

export default function EditableText({ id, fallback, as: Tag = 'span', className = '', style, multiline = false }) {
  const { editing, get, set } = useEdit()
  const value = get(id, fallback)
  const [draft, setDraft] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (draft !== null && inputRef.current) {
      inputRef.current.focus()
      if (multiline) inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
    }
  }, [draft, multiline])

  // Exit edit mode → cancel any in-progress edit
  useEffect(() => {
    if (!editing) setDraft(null)
  }, [editing])

  if (!editing) {
    return <Tag className={className} style={style}>{value}</Tag>
  }

  if (draft === null) {
    return (
      <Tag
        className={`${className} cursor-text border border-dashed border-transparent hover:border-white/15 rounded transition-colors`}
        style={style}
        onClick={() => setDraft(value)}
        title="Click to edit"
      >
        {value}
      </Tag>
    )
  }

  const commit = () => {
    set(id, draft)
    setDraft(null)
  }

  const InputTag = multiline ? 'textarea' : 'input'
  const shared = {
    ref: inputRef,
    value: draft,
    onChange: (e) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !multiline) { e.preventDefault(); commit() }
      if (e.key === 'Escape') { setDraft(null) }
    },
    className: `${className} bg-white/[0.04] border border-dashed border-white/20 rounded outline-none focus:border-white/40 px-1 -mx-1 transition-colors`,
    style: { ...style, resize: multiline ? 'vertical' : 'none' },
  }

  return <InputTag {...shared} rows={multiline ? 3 : undefined} />
}
