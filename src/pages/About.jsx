export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">关于我</h1>
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>我是一名扎根深圳三年的建筑设计师。在快速迭代的职业生涯中，我始终致力于探索建筑设计与数字技术的交界点。</p>
        <p>我热衷于方案的推敲与表达，并构建了一套以 AIGC 工具为核心的高效可视化工作流。通过将 AI 深度集成到效果图制作、概念生成及动态演示中，我能够更敏锐地捕捉方案潜力，实现从创意到视觉的高质量转化。</p>
        <p>在传统建模与渲染之外，我也在跨领域技能中寻找灵感。无论是操控无人机进行场地勘测，还是利用 3D 打印将数字构想转化为实体触感，这些工具让我能从多维视角理解空间。我希望以技术为笔，在理性的设计逻辑与感性的视觉叙事之间，找到最动人的表达。</p>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">技能</h2>
        <div className="flex flex-wrap gap-3">
          {['Photoshop', 'Sketch', 'Revit', 'Rhino', 'Lumion', 'Enscape', 'AIGC', '3D Printing', 'Drone', 'VR/AR'].map(skill => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
