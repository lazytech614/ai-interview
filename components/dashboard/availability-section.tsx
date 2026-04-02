"use client";

import { Clock, Plus, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrayTitle } from "../global/reusables";
import { DayStrip } from "./day-strip";
import { DAY_LABELS, MONTH_LABELS } from "./constants/constants";
import { SlotEditor } from "./slot-editor";
import { AvailabilitySectionProps } from "./types/types";
import { useAvailability } from "./hooks/use-availability";

export default function AvailabilitySection({ initial }: AvailabilitySectionProps) {
  const {
    days, selectedIdx, setSelectedIdx,
    selectedDay, selectedKey,
    daySlots, slots,
    savedKeys, validationError, loading, error,
    addSlot, removeSlot, nudgeHour, nudgeMinute, setAP,
    handleSave, applyToAll,
    configuredCount,
  } = useAvailability(initial);

  return (
    <section className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
            <Clock size={18} className="text-amber-400" />
          </span>
          <h2 className="font-serif text-xl tracking-tight">
            <GrayTitle>Weekly availability</GrayTitle>
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1">
            Set one or more booking windows per day, across the next 7 days.
          </p>
        </div>
        {configuredCount > 0 && (
          <Badge variant="outline" className="shrink-0 border-green-500/20 bg-green-500/10 text-green-400">
            {configuredCount}/7 days set
          </Badge>
        )}
      </div>

      <div className="h-px bg-white/5" />

      <DayStrip
        days={days}
        selectedIdx={selectedIdx}
        slots={slots}
        onSelect={(i) => setSelectedIdx(i)}
      />

      {/* Selected day label */}
      <div className="flex items-center gap-2 text-sm text-stone-400">
        <ChevronRight size={14} className="text-amber-400" />
        <span>{DAY_LABELS[selectedDay.getDay()]}, {MONTH_LABELS[selectedDay.getMonth()]} {selectedDay.getDate()}</span>
        {savedKeys.has(selectedKey) && (
          <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5">
            ✓ Saved
          </Badge>
        )}
      </div>

      {/* Slot list */}
      <div className="flex flex-col gap-3">
        {daySlots.map((slot: any, i: number) => (
          <SlotEditor
            key={slot.id}
            slot={slot}
            index={i}
            onRemove={() => removeSlot(slot.id)}
            onHour={(field, dir) => nudgeHour(slot.id, field, dir)}
            onMinute={(field, dir) => nudgeMinute(slot.id, field, dir)}
            onAP={(field, ap) => setAP(slot.id, field, ap)}
          />
        ))}

        <button
          onClick={addSlot}
          disabled={daySlots.length >= 4}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-stone-600 hover:border-amber-400/30 hover:text-amber-400 transition-all text-xs disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={13} /> Add time slot {daySlots.length >= 4 && "(max 4)"}
        </button>
      </div>

      {/* Errors */}
      {(validationError || error) && (
        <p className="text-xs text-red-400">
          {validationError ?? (typeof error === "string" ? error : (error as Error)?.message)}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="gold"
          disabled={daySlots.length === 0 || loading}
          onClick={handleSave}
          className="self-start"
        >
          {loading ? "Saving…" : "Save availability"}
        </Button>
        <Button
          variant="ghost" size="sm"
          disabled={daySlots.length === 0}
          onClick={applyToAll}
          className="text-stone-500 hover:text-stone-300 gap-1.5 text-xs"
        >
          <Copy size={12} /> Apply to all days
        </Button>
      </div>
    </section>
  );
}