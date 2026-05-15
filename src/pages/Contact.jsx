import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('感谢你的留言！（这是演示，未实际发送）')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="bg-[#050505] min-h-screen flex items-center">
      <section className="max-w-2xl mx-auto px-6 py-24 w-full">
        <p className="text-white/20 text-[10px] font-mono tracking-[0.3em] mb-16">CONTACT</p>

        <p
          className="text-white text-[40px] leading-tight tracking-[-0.01em] mb-16"
          style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 100 }}
        >
          开始对话
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-[11px] font-mono tracking-[0.2em] text-white/20 uppercase">Name</label>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-white/[0.08] pb-3 text-white/80 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/[0.06]"
                placeholder="你的名字"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-mono tracking-[0.2em] text-white/20 uppercase">Email</label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-white/[0.08] pb-3 text-white/80 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/[0.06]"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-[11px] font-mono tracking-[0.2em] text-white/20 uppercase">Message</label>
            <textarea
              id="message" name="message" rows={4} required
              value={form.message} onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-white/[0.08] pb-3 text-white/80 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none placeholder:text-white/[0.06]"
              placeholder="你的留言..."
            />
          </div>
          <button
            type="submit"
            className="group inline-flex items-center gap-2 pt-4 text-white/35 hover:text-white/70 transition-colors text-sm tracking-[0.1em]"
            style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 250 }}
          >
            <span className="w-8 h-px bg-white/20 group-hover:bg-white/40 group-hover:w-12 transition-all" />
            发送
          </button>
        </form>
      </section>
    </div>
  )
}
