// Pattern cycle: 2x2 large → 1x2 tall → 1x1 small → 1x1 small → 2x1 wide → 1x1 small
const PATTERN = [
  { span: 'col-span-2 row-span-2', aspect: 'aspect-[4/3]' },
  { span: 'col-span-1 row-span-2', aspect: 'aspect-[3/4]' },
  { span: 'col-span-1 row-span-1', aspect: 'aspect-[4/3]' },
  { span: 'col-span-1 row-span-1', aspect: 'aspect-[4/3]' },
  { span: 'col-span-2 row-span-1', aspect: 'aspect-[16/9]' },
  { span: 'col-span-1 row-span-1', aspect: 'aspect-[4/3]' },
]

function getLayout(i) {
  return PATTERN[i % PATTERN.length]
}

const IMAGES = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  src: null,
  alt: `Photo ${i + 1}`,
}))

export default function Photography() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(100px,auto)] gap-[3px]">
        {IMAGES.map((img, i) => {
          const { span, aspect } = getLayout(i)
          return (
            <div
              key={img.id}
              className={`${span} ${aspect} group relative overflow-hidden bg-white/[0.02] cursor-pointer`}
            >
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-white/[0.06] text-[10px] font-mono tracking-[0.25em] group-hover:text-white/[0.12] transition-colors">
                  {img.alt.toUpperCase()}
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
