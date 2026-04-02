import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABEL } from "@/lib/data";
import { formatTime } from "@/lib/helpers";
import { InterviewCategory } from "@/lib/generated/prisma/enums";

const DURATION_LABEL: Record<number, string> = {
  45: "45 mins",
  60: "1 hour",
  90: "1.5 hours",
};

export default function InterviewerCard({ interviewer }: any) {
  const {
    id,
    name,
    imageUrl,
    title,
    company,
    yearsExp,
    bio,
    categories,
    sessionRates,
    availabilities,
  } = interviewer;
  const availability = availabilities?.[0];

  // sessionRates can be an array [{duration, credits}] or a plain object {45: 1, 60: 2, 90: 5}
  const rates: { duration: number; credits: number }[] = Array.isArray(sessionRates)
    ? sessionRates
    : Object.entries(sessionRates ?? {}).map(([dur, cred]) => ({
        duration: Number(dur),
        credits: Number(cred),
      }));

  const sortedRates = [...rates].sort((a, b) => a.duration - b.duration);
  const lowestCredits = sortedRates[0]?.credits;

  return (
    <Card className="relative border border-white/10 hover:border-amber-400/20">
      <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 via-transparent to-transparent pointer-events-none" />

      <CardContent className="flex flex-col gap-5">
        {/* Top row — avatar + name + years */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 border border-white/10 shrink-0">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium">
                {name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-stone-200 leading-tight">
                {name}
              </p>
              {title && company && (
                <p className="text-xs text-stone-500 mt-0.5">
                  {title} · {company}
                </p>
              )}
            </div>
          </div>

          {yearsExp && (
            <Badge
              variant="outline"
              className="shrink-0 border-white/10 text-stone-500 text-xs"
            >
              {yearsExp}+ yrs
            </Badge>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2">
            {bio}
          </p>
        )}

        {/* Categories */}
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 4).map((cat: InterviewCategory) => (
              <span
                key={cat}
                className="text-xs px-2.5 py-1 rounded-lg border border-amber-400/20 bg-amber-400/5 text-amber-400"
              >
                {CATEGORY_LABEL[cat] ?? cat}
              </span>
            ))}
            {categories.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-stone-600">
                +{categories.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Session rates grid */}
        {sortedRates.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {sortedRates.map(({ duration, credits }) => (
              <div
                key={duration}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl border border-white/8 bg-white/2"
              >
                <span className="text-xs text-stone-600 font-medium tracking-wide uppercase">
                  {DURATION_LABEL[duration] ?? `${duration}m`}
                </span>
                <span className="font-serif text-base leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  {credits}
                </span>
                <span className="text-xs text-stone-700">credits</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Bottom row — starting from + availability + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            {lowestCredits !== undefined && (
              <p className="text-sm font-serif leading-none text-stone-400">
                Starting from{" "}
                <span className="bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  {lowestCredits} credit
                </span>
              </p>
            )}
            {availability ? (
              <p className="text-xs text-stone-600">
                🟢 {formatTime(availability.startTime)} –{" "}
                {formatTime(availability.endTime)}
              </p>
            ) : (
              <p className="text-xs text-stone-700">No availability set</p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-400/20 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/40"
            asChild
          >
            <Link href={`/interviewers/${id}`}>View profile →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}