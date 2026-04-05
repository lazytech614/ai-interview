import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      {/* ── Page header skeleton ── */}
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-sm px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="h-5 w-16 sm:w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-12 w-72 sm:w-120 rounded-xl bg-white/[0.07] animate-pulse" />
            <div className="h-5 w-32 sm:w-48 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Content skeleton ── */}
      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10 flex flex-col gap-8">

        {/* Filters skeleton */}
        <div className="flex flex-col gap-4">
            <div className="relative max-w-sm">
                <div className="h-8 w-sm rounded-lg bg-white/10 animate-pulse" />
            </div>

            <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                    <div
                    key={i}
                    className="h-8 w-20 rounded-lg bg-white/10 animate-pulse"
                    />
                ))}
            </div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card className="relative border border-white/10 animate-pulse">
                <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 via-transparent to-transparent pointer-events-none" />

                <CardContent className="flex flex-col gap-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 min-h-15">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10" />

                        {/* Name + title */}
                        <div className="flex flex-col gap-1">
                        <div className="h-3 w-28 bg-white/10 rounded" />
                        <div className="h-2.5 w-36 bg-white/10 rounded" />
                        </div>
                    </div>

                    {/* Years badge */}
                    <div className="h-5 w-14 bg-white/10 rounded-md" />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 min-h-10">
                    <div className="h-2.5 w-full bg-white/10 rounded" />
                    <div className="h-2.5 w-5/6 bg-white/10 rounded" />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5">
                    {[...Array(4)].map((_, i) => (
                        <div
                        key={i}
                        className="h-5 w-16 rounded-lg bg-white/10"
                        />
                    ))}
                    </div>

                    {/* Session rates */}
                    <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                        key={i}
                        className="flex flex-col items-center gap-1 py-2 rounded-xl border border-white/8 bg-white/5"
                        >
                        <div className="h-2 w-10 bg-white/10 rounded" />
                        <div className="h-4 w-6 bg-white/10 rounded" />
                        <div className="h-2 w-12 bg-white/10 rounded" />
                        </div>
                    ))}
                    </div>

                    <Separator />

                    {/* Bottom row */}
                    <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-32 bg-white/10 rounded" />
                        <div className="h-2.5 w-28 bg-white/10 rounded" />
                    </div>

                    {/* Button */}
                    <div className="h-8 w-28 bg-white/10 rounded-md" />
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}