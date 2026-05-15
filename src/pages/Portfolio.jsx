import { Link } from 'react-router-dom'

// Data — just add objects to grow the page, layout is automatic
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
    desc: '以"流动的屋盖"为核心概念，探索公共建筑与城市肌理的融合。',
    tags: ['Sketch', 'AIGC'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+1',
    link: null,
  },
  {
    title: '前海湾区住宅立面设计',
    desc: '结合海风与光照模拟，生成模块化立面单元。',
    tags: ['Photoshop', '3D Printing'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+2',
    link: null,
  },
  {
    title: '城中村微更新可视化',
    desc: '利用无人机航拍获取场地数据，AI辅助生成改造前后对比。',
    tags: ['AIGC', 'Photoshop'],
    image: 'https://placehold.co/600x400/1e293b/94a3b8?text=Project+3',
    link: null,
  },
]

// Pattern: featured(2col) → standard(1col) → standard(1col) → standard(1col) → wide(2col) → wide(2col)
const PATTERN = [2, 1, 1, 1, 2, 2]

function getSpan(i) {
  const s = PATTERN[i % PATTERN.length]
  return s === 2 ? 'col-span-2' : 'col-span-1'
}

function getAspect(i) {
  const s = PATTERN[i % PATTERN.length]
  if (s === 2) return 'aspect-[16/9]'
  return 'aspect-[4/3]'
}

export default function Portfolio() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="grid grid-cols-3 gap-[3px]">
        {projects.map((p, i) => {
          const span = getSpan(i)
          const aspect = getAspect(i)
          const isLarge = span === 'col-span-2'

          const inner = (
            <div className={`group relative w-full h-full ${aspect} overflow-hidden cursor-pointer bg-white/[0.01]`}>
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/[0.06] text-white/40 text-[9px] tracking-[0.08em]">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className={`text-white/85 tracking-[0.03em] ${isLarge ? 'text-xl lg:text-2xl' : 'text-sm'}`}
                  style={{ fontFamily: '"Gotham", "Montserrat", "Futura", "Century Gothic", sans-serif', fontWeight: isLarge ? 200 : 300 }}
                >
                  {p.title}
                </h3>
                {isLarge && <p className="text-sm text-white/35 leading-relaxed mt-1 max-w-xl">{p.desc}</p>}
              </div>
            </div>
          )

          return p.link ? (
            <Link key={i} to={p.link} className={span}>
              {inner}
            </Link>
          ) : (
            <div key={i} className={span}>
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}
