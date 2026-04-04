export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      {/* ── Page header skeleton ── */}
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-sm px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="h-5 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-12 w-120 rounded-xl bg-white/[0.07] animate-pulse" />
            <div className="h-5 w-48 rounded-full bg-white/5 animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-20 rounded-xl bg-white/[0.07] animate-pulse" />
            <div className="h-6 w-5 rounded-full bg-amber-400/70 opacity-10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Content skeleton ── */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Tabs skeleton */}
        <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
          {[...Array(4)].map((_, i) => (
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

        {/* Cards grid skeleton */}
        <section className="flex flex-col gap-6 animate-pulse">
      
        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
                {/* Icon */}
                <div className="w-4 h-4 bg-white/10 rounded" />

                {/* Value */}
                <div className="h-8 w-7 bg-white/10 rounded-full" />

                {/* Unit */}
                <div className="h-3 w-16 bg-white/10 rounded" />

                {/* Label */}
                <div className="h-3 w-28 bg-white/10 rounded" />
            </div>
            ))}
        </div>

        {/* ── Withdrawal trigger card ── */}
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex flex-col gap-2">
            <div className="h-5 w-40 bg-white/10 rounded" />
            <div className="h-3 w-64 bg-white/10 rounded" />
            </div>

            <div className="h-10 w-40 bg-white/10 rounded-xl" />
        </div>

        {/* ── Withdrawal history ── */}
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            
            {/* Title */}
            <div className="h-4 w-40 bg-white/10 rounded" />

            {/* List */}
            <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
                <div
                key={i}
                className="flex items-center justify-between bg-[#141417] border border-white/8 rounded-xl px-5 py-4"
                >
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-40 bg-white/10 rounded" />
                    <div className="h-3 w-28 bg-white/10 rounded" />
                </div>

                <div className="h-6 w-20 bg-white/10 rounded-full" />
                </div>
            ))}
            </div>
        </div>

        </section>
      </div>
    </main>
  );
}