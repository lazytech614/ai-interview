import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimeSlot } from "./types/types";
import { getSlotDuration } from "@/lib/helpers";
import { TimePicker } from "./time-picker";
import { MINUTES } from "./constants/constants";

interface SlotEditorProps {
  slot: TimeSlot;
  index: number;
  onRemove: () => void;
  onHour:   (field: "startH" | "endH", dir: 1 | -1) => void;
  onMinute: (field: "startM" | "endM", dir: 1 | -1) => void;
  onAP:     (field: "startAP" | "endAP", ap: "AM" | "PM") => void;
}

export function SlotEditor({ slot, index, onRemove, onHour, onMinute, onAP }: SlotEditorProps) {
  const duration = getSlotDuration(slot);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/6 bg-white/2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-stone-600 uppercase tracking-widest">
          Slot {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {duration && (
            <Badge variant="outline" className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-[10px] px-2 py-0.5">
              {duration}
            </Badge>
          )}
          <button
            onClick={onRemove}
            className="text-stone-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
            aria-label="Remove slot"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TimePicker
          label="Start"
          hIdx={slot.startH}
          mIdx={MINUTES.indexOf(slot.startM as typeof MINUTES[number])}
          ap={slot.startAP}
          onHour={(dir) => onHour("startH", dir)}
          onMinute={(dir) => onMinute("startM", dir)}
          onAP={(ap) => onAP("startAP", ap)}
        />
        <TimePicker
          label="End"
          hIdx={slot.endH}
          mIdx={MINUTES.indexOf(slot.endM as typeof MINUTES[number])}
          ap={slot.endAP}
          onHour={(dir) => onHour("endH", dir)}
          onMinute={(dir) => onMinute("endM", dir)}
          onAP={(ap) => onAP("endAP", ap)}
        />
      </div>
    </div>
  );
}