export default function About() {
  return (
    <div className="bg-[#050505] min-h-screen flex items-center">
      <section className="max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          {/* Left — name block */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white/20 text-[10px] font-mono tracking-[0.3em] mb-6">ABOUT</p>
              <p
                className="text-white text-[56px] leading-none tracking-[-0.02em]"
                style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 100 }}
              >
                李<br />子易
              </p>
              <p className="text-white/25 text-sm mt-4 tracking-[0.05em]">建筑设计师 · 深圳</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-16 h-px bg-white/10 mb-6" />
              <p className="text-white/15 text-[11px] font-mono tracking-[0.2em] leading-relaxed">
                ARCHITECTURE<br />
                AIGC EXPLORER<br />
                VISUAL STORYTELLER
              </p>
            </div>
          </div>

          {/* Right — text block */}
          <div className="flex flex-col justify-center">
            <p className="text-white/70 text-xl leading-relaxed mb-10 tracking-[0.01em]"
               style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: 250 }}>
              在理性的设计逻辑与感性的视觉叙事之间，<br />寻找最动人的表达。
            </p>
            <div className="space-y-5 text-white/40 text-sm leading-relaxed">
              <p>我是一名扎根深圳三年的建筑设计师，始终致力于探索建筑设计与数字技术的交界点。我热衷于方案的推敲与表达，并构建了一套以 AIGC 工具为核心的高效可视化工作流。</p>
              <p>通过将 AI 深度集成到效果图制作、概念生成及动态演示中，我能够更敏锐地捕捉方案潜力，实现从创意到视觉的高质量转化。在传统建模与渲染之外，我也在跨领域技能中寻找灵感——从无人机航拍到 3D 打印，这些工具让我能从多维视角理解空间。</p>
            </div>

            {/* skills */}
            <div className="mt-14 flex flex-wrap gap-2">
              {['Photoshop', 'Sketch', 'Revit', 'Rhino', 'Lumion', 'Enscape', 'AIGC', '3D Printing', 'Drone', 'VR/AR'].map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-[11px] tracking-[0.05em] border border-white/[0.06] text-white/30 hover:text-white/55 hover:border-white/[0.12] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
