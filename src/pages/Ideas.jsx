// Pattern cycle: wide → square → square → square → wide → wide
const PATTERN = [
  { span: 'col-span-2', aspect: 'aspect-[2/1]' },
  { span: 'col-span-1', aspect: 'aspect-[1/1]' },
  { span: 'col-span-1', aspect: 'aspect-[1/1]' },
  { span: 'col-span-1', aspect: 'aspect-[1/1]' },
  { span: 'col-span-2', aspect: 'aspect-[2/1]' },
  { span: 'col-span-2', aspect: 'aspect-[2/1]' },
]

function getLayout(i) {
  return PATTERN[i % PATTERN.length]
}

const ITEMS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  src: null,
  alt: `Idea ${i + 1}`,
}))

export default function Ideas() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(100px,auto)] gap-[3px]">
        {ITEMS.map((item, i) => {
          const { span, aspect } = getLayout(i)
          return (
            <div
              key={item.id}
              className={`${span} ${aspect} group relative overflow-hidden bg-white/[0.02] cursor-pointer`}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-white/[0.06] text-[10px] font-mono tracking-[0.25em] group-hover:text-white/[0.12] transition-colors">
                  {item.alt.toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/30" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
