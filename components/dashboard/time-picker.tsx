import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOURS_12, MINUTES } from "./constants/constants";

interface TimePickerProps {
  label: string;
  hIdx: number | null;
  mIdx: number;
  ap: "AM" | "PM";
  onHour:   (dir: 1 | -1) => void;
  onMinute: (dir: 1 | -1) => void;
  onAP:     (ap: "AM" | "PM") => void;
}

export function TimePicker({ label, hIdx, mIdx, ap, onHour, onMinute, onAP }: TimePickerProps) {
  const empty    = hIdx === null;
  const displayH = empty ? "--" : String(HOURS_12[hIdx]);
  const displayM = empty ? "--" : String(MINUTES[mIdx]).padStart(2, "0");

  const segBtn = "flex items-center justify-center w-full py-1.5 text-stone-500 hover:bg-white/5 transition-colors";
  const segVal = cn(
    "py-2 text-center text-lg font-medium border-y border-white/[0.06] w-full",
    empty ? "text-stone-600 text-sm" : "text-stone-100"
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium tracking-wider text-stone-500 uppercase">{label}</span>
      <div className="border border-white/6 rounded-xl overflow-hidden bg-[#141417]">
        <div className="flex">
          {/* Hour */}
          <div className="flex-1 flex flex-col border-r border-white/6">
            <button className={segBtn} onClick={() => onHour(1)}  aria-label="Increase hour"><ChevronUp   size={13} /></button>
            <div className={segVal}>{displayH}</div>
            <button className={segBtn} onClick={() => onHour(-1)} aria-label="Decrease hour"><ChevronDown size={13} /></button>
          </div>

          <div className="flex items-center justify-center px-1 border-r border-white/6">
            <span className="text-stone-600 font-medium">:</span>
          </div>

          {/* Minute */}
          <div className="flex-1 flex flex-col border-r border-white/6">
            <button className={segBtn} onClick={() => onMinute(1)}  aria-label="Increase minute"><ChevronUp   size={13} /></button>
            <div className={segVal}>{displayM}</div>
            <button className={segBtn} onClick={() => onMinute(-1)} aria-label="Decrease minute"><ChevronDown size={13} /></button>
          </div>

          {/* AM / PM */}
          <div className="flex flex-col w-11">
            {(["AM", "PM"] as const).map((period, i) => (
              <>
                {i === 1 && <div key="div" className="h-px bg-white/6" />}
                <button
                  key={period}
                  onClick={() => onAP(period)}
                  className={cn(
                    "flex-1 text-[10px] font-semibold tracking-wide transition-all",
                    ap === period
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-stone-600 hover:text-stone-400 hover:bg-white/3"
                  )}
                  aria-pressed={ap === period}
                >
                  {period}
                </button>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}