import { Link } from 'react-router-dom'

const projects = [
  {
    title: '深圳清华大学研究生院二期',
    desc: '大型学术建筑项目，包含多角度效果图展示，运用AIGC技术辅助设计推敲与表达。',
    tags: ['Revit', 'AIGC', 'Photoshop'],
    image: 'https://raw.githubusercontent.com/lzy12y/project-picture/main/TH/TH1.jpg',
    link: '/portfolio/tsinghua',
  },
  {
    title: '南山文体中心概念方案',
    desc: '以"流动的屋盖"为核心概念，探索公共建筑与城市肌理的融合，运用 AIGC 辅助生成多轮体量推演。',
    tags: ['Sketch', 'AIGC'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+1',
  },
  {
    title: '前海湾区住宅立面设计',
    desc: '结合海风与光照模拟，生成模块化立面单元，通过 AI 渲染快速验证材质与光影效果。',
    tags: ['Photoshop', '3D Printing'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+2',
  },
  {
    title: '城中村微更新可视化',
    desc: '利用无人机航拍获取场地数据，以 AI 辅助生成改造前后对比效果图与动态漫游演示。',
    tags: ['AIGC', 'Photoshop'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+3',
  },
]

export default function Portfolio() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-10">作品集</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          p.link ? (
            <Link
              key={i}
              to={p.link}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ) : (
            <div
              key={i}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  )
}
