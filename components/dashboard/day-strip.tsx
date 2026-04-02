import { cn } from "@/lib/utils";
import { DaySlots } from "./types/types";
import { toDateKey } from "@/lib/helpers";
import { DAY_LABELS } from "./constants/constants";

interface DayStripProps {
  days: Date[];
  selectedIdx: number;
  slots: Record<string, DaySlots>;
  onSelect: (i: number) => void;
}

export function DayStrip({ days, selectedIdx, slots, onSelect }: DayStripProps) {
  const todayKey = toDateKey(new Date());

  return (
    <div role="tablist" aria-label="Select a day" className="grid grid-cols-7 gap-1.5">
      {days.map((day, i) => {
        const key          = toDateKey(day);
        const isActive     = i === selectedIdx;
        const isConfigured = (slots[key] ?? []).some((s) => s.startH !== null);
        const isToday      = key === todayKey;
        const slotCount    = (slots[key] ?? []).filter((s) => s.startH !== null).length;

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(i)}
            className={cn(
              "relative flex flex-col items-center gap-1 py-3 px-1 rounded-xl border text-center transition-all duration-150",
              isActive
                ? "border-amber-400/50 bg-amber-400/10"
                : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4"
            )}
          >
            <span className={cn("text-[10px] font-medium uppercase tracking-widest", isActive ? "text-amber-400" : "text-stone-500")}>
              {DAY_LABELS[day.getDay()]}
            </span>
            <span className={cn("text-sm font-semibold", isActive ? "text-amber-300" : "text-stone-300")}>
              {day.getDate()}
            </span>
            {isToday && <span className="text-[9px] text-stone-600">Today</span>}
            {isConfigured && (
              <span className="absolute top-2 right-2 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-400 text-[8px] font-bold text-black">
                {slotCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}