// Pattern cycle: full-width → 1col → 2col → 2col → 1col → full-width
const PATTERN = [
  { span: 'col-span-full', aspect: 'aspect-[21/9]' },
  { span: 'col-span-1',    aspect: 'aspect-[16/9]' },
  { span: 'col-span-2',    aspect: 'aspect-[16/9]' },
  { span: 'col-span-2',    aspect: 'aspect-[16/9]' },
  { span: 'col-span-1',    aspect: 'aspect-[16/9]' },
  { span: 'col-span-full', aspect: 'aspect-[21/9]' },
]

function getLayout(i) {
  return PATTERN[i % PATTERN.length]
}

const ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  src: null,
  alt: `Video ${i + 1}`,
}))

export default function Video() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="grid grid-cols-3 auto-rows-[minmax(90px,auto)] gap-[3px]">
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
