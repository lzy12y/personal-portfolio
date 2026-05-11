export default function Photography() {
  return (
    <div className="bg-[#050505]">
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">摄影</h1>
          <p className="text-sm font-mono tracking-[0.3em] text-white/25 uppercase">PHOTOGRAPHY</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="group rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1 aspect-[4/3] flex items-center justify-center"
            >
              <span className="text-white/10 text-sm font-mono tracking-[0.2em]">PHOTO {i + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
