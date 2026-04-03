export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      {/* ── Page header skeleton ── */}
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-sm px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-8 w-64 rounded-xl bg-white/[0.07] animate-pulse" />
            <div className="h-3 w-48 rounded-full bg-white/5 animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-3 w-20 rounded-full bg-white/5 animate-pulse" />
            <div className="h-8 w-14 rounded-lg bg-amber-400/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Content skeleton ── */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Tabs skeleton */}
        <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-9 rounded-lg animate-pulse ${
                i === 0
                  ? "w-28 bg-amber-400/10"
                  : "w-28 bg-white/3"
              }`}
            />
          ))}
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-6"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-white/6 animate-pulse shrink-0" />
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="h-4 w-32 rounded-full bg-white/[0.07] animate-pulse" />
                    <div className="h-3 w-44 rounded-full bg-white/5 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="h-5 w-20 rounded-full bg-white/6 animate-pulse" />
                  <div className="h-5 w-24 rounded-full bg-amber-400/10 animate-pulse" />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="h-2.5 w-10 rounded-full bg-white/5 animate-pulse" />
                    <div className="h-4 w-20 rounded-full bg-white/6 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}