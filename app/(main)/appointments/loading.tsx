export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      {/* ── Page header skeleton ── */}
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-sm px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="h-5 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-12 w-120 rounded-xl bg-white/[0.07] animate-pulse" />
            <div className="h-5 w-48 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Content skeleton ── */}
      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10 flex flex-col gap-8">
        {/* Tabs skeleton */}
        <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-10 rounded-lg animate-pulse ${
                i === 0
                  ? "w-28 bg-amber-400/10"
                  : "w-28 bg-white/3"
              }`}
            />
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-x-2">
          <div className="relative max-w-sm">
            <div className="h-9 w-sm rounded-xl bg-white/10 animate-pulse" />
          </div>
          <div className="h-9 w-20 bg-white/10 animate-pulse rounded-lg" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <article className="relative bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 animate-pulse">
      
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full">
          
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-white/10" />

          {/* Name + meta */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-40 bg-white/10 rounded" />
            <div className="h-3 w-28 bg-white/5 rounded" />
            
            {/* Categories */}
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 w-14 bg-amber-400/10 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Status + credits */}
        <div className="flex flex-col gap-2 items-end">
          <div className="h-5 w-20 bg-white/10 rounded-md" />
          <div className="h-5 w-24 bg-white/5 rounded-md" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5" />

      {/* Date Time Duration */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-10 bg-white/5 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* AI Feedback */}
      <div className="rounded-xl border border-white/8 bg-[#141417] px-4 py-3 flex flex-col gap-2">
        <div className="h-3 w-20 bg-white/5 rounded" />
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-4/5 bg-white/10 rounded" />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        
        {/* Left buttons */}
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-amber-400/10 rounded-md" />
          <div className="h-8 w-24 bg-white/10 rounded-md" />
        </div>

        {/* Rating badge */}
        <div className="h-6 w-28 bg-white/10 rounded-md" />

        {/* Cancel button */}
        <div className="h-8 w-28 bg-red-400/10 rounded-md" />
      </div>

      {/* Bottom CTA */}
      <div className="h-8 w-36 bg-white/10 rounded-md self-center" />
    </article>
          ))}
        </div>
      </div>
    </main>
  );
}