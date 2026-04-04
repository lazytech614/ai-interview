export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* ── HERO ── */}
      <section className="border-b border-white/8 pb-10">
        <div className="max-w-6xl mx-auto px-8 pt-20 pb-14 flex flex-col gap-8">
          
          {/* Back button */}
          <div className="h-4 w-32 bg-white/10 rounded" />

          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/10" />

            {/* Text */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="h-8 w-56 bg-white/10 rounded" />
              <div className="h-4 w-72 bg-white/10 rounded" />

              <div className="flex gap-2 mt-2">
                <div className="h-6 w-24 bg-white/10 rounded-full" />
                <div className="h-6 w-20 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* About */}
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
            <div className="h-5 w-24 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-11/12 bg-white/10 rounded" />
            <div className="h-3 w-10/12 bg-white/10 rounded" />

            {/* Rating */}
            <div className="absolute right-8 top-4 flex gap-2">
              <div className="h-5 w-10 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/10 rounded" />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
            <div className="h-5 w-32 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/10 rounded" />

            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-white/10 rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
            <div className="h-5 w-40 bg-white/10 rounded" />
            <div className="h-4 w-72 bg-white/10 rounded" />

            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 border-b border-white/5 pb-4 last:border-none">
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 bg-white/10 rounded" />
                    <div className="h-2 w-16 bg-white/10 rounded" />
                  </div>
                </div>

                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
              </div>
            ))}
          </div>

          {/* What to expect */}
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
            <div className="h-5 w-40 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/10 rounded" />

            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-full bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT (Slot picker skeleton) */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
            
            <div className="h-5 w-32 bg-white/10 rounded" />

            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full bg-white/10 rounded-xl"
              />
            ))}

            <div className="h-10 w-full bg-white/10 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}