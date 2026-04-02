import { useState, useCallback, useEffect } from "react";
import { setAvailability } from "@/actions/dashboard";
import useFetch from "@/hooks/use-fetch";
import { AvailabilitySectionProps, DaySlots, TimeSlot } from "../types/types";
import { getNext7Days, getSlotDuration, makeEmptySlot, parseInitial, slotsOverlap, to24, toDateKey, toISO } from "@/lib/helpers";
import { HOURS_12, MINUTES } from "../constants/constants";

export function useAvailability(initial: AvailabilitySectionProps["initial"]) {
  const days = getNext7Days();

  const [selectedIdx, setSelectedIdx]       = useState(0);
  const [slots, setSlots]                   = useState<Record<string, DaySlots>>(parseInitial(initial));
  const [savedKeys, setSavedKeys]           = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, fn: saveFn } = useFetch(setAvailability);

  const selectedDay = days[selectedIdx];
  const selectedKey = toDateKey(selectedDay);
  const daySlots: DaySlots = slots[selectedKey] ?? [];

  // ── flash "Saved" badge ──────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.success) return;
    setSavedKeys((prev) => new Set(prev).add(selectedKey));
    const t = setTimeout(() => {
      setSavedKeys((prev) => { const n = new Set(prev); n.delete(selectedKey); return n; });
    }, 3000);
    return () => clearTimeout(t);
  }, [data]); // eslint-disable-line

  // ── slot mutation helpers ────────────────────────────────────────────────
  const addSlot = useCallback(() => {
    setSlots((prev) => ({
      ...prev,
      [selectedKey]: [...(prev[selectedKey] ?? []), makeEmptySlot()],
    }));
    setValidationError(null);
  }, [selectedKey]);

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => ({
      ...prev,
      [selectedKey]: (prev[selectedKey] ?? []).filter((s) => s.id !== id),
    }));
    setValidationError(null);
  }, [selectedKey]);

  const updateSlot = useCallback((id: string, patch: Partial<TimeSlot>) => {
    setValidationError(null);
    setSlots((prev) => ({
      ...prev,
      [selectedKey]: (prev[selectedKey] ?? []).map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }));
  }, [selectedKey]);

  // ── nudge helpers (hour / minute / AM-PM) ────────────────────────────────
  const nudgeHour = useCallback((id: string, field: "startH" | "endH", dir: 1 | -1) => {
    setSlots((prev) => {
      const day = prev[selectedKey] ?? [];
      return {
        ...prev,
        [selectedKey]: day.map((s) => {
          if (s.id !== id) return s;
          const cur  = s[field] ?? 0;
          const next = (cur + dir + 12) % 12;
          return { ...s, [field]: next };
        }),
      };
    });
    setValidationError(null);
  }, [selectedKey]);

  const nudgeMinute = useCallback((id: string, field: "startM" | "endM", dir: 1 | -1) => {
    setSlots((prev) => {
      const day = prev[selectedKey] ?? [];
      return {
        ...prev,
        [selectedKey]: day.map((s) => {
          if (s.id !== id) return s;
          const cur  = MINUTES.indexOf(s[field] as typeof MINUTES[number]);
          const next = (cur + dir + 4) % 4;
          return { ...s, [field]: MINUTES[next] };
        }),
      };
    });
    setValidationError(null);
  }, [selectedKey]);

  const setAP = useCallback((id: string, field: "startAP" | "endAP", ap: "AM" | "PM") => {
    updateSlot(id, { [field]: ap });
  }, [updateSlot]);

  // ── save ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const complete = daySlots.filter((s) => s.startH !== null && s.endH !== null);
    if (complete.length === 0) { setValidationError("Add at least one complete time slot."); return; }

    // validate each slot
    for (const s of complete) {
      if (!getSlotDuration(s)) { setValidationError("Each slot's end time must be after its start time."); return; }
    }

    // check overlaps
    for (let i = 0; i < complete.length; i++) {
      for (let j = i + 1; j < complete.length; j++) {
        if (slotsOverlap(complete[i], complete[j])) {
          setValidationError("Slots must not overlap."); return;
        }
      }
    }

    const payload = complete.map((s) => ({
      startTime: toISO(selectedKey, to24(HOURS_12[s.startH!], s.startAP), s.startM),
      endTime:   toISO(selectedKey, to24(HOURS_12[s.endH!],   s.endAP),   s.endM),
    }));

    saveFn({ date: selectedKey, slots: payload });
  }, [daySlots, selectedKey, saveFn]);

  // ── apply current day's slots to all days ────────────────────────────────
  const applyToAll = useCallback(() => {
    const copy = daySlots.map((s) => ({ ...s, id: crypto.randomUUID() }));
    setSlots((prev) => {
      const next = { ...prev };
      days.forEach((d) => { next[toDateKey(d)] = copy.map((s) => ({ ...s, id: crypto.randomUUID() })); });
      return next;
    });
  }, [daySlots, days]);

  const configuredCount = days.filter(
    (d) => (slots[toDateKey(d)] ?? []).some((s) => s.startH !== null)
  ).length;

  return {
    days, selectedIdx, setSelectedIdx,
    selectedDay, selectedKey,
    daySlots, slots,
    savedKeys, validationError, loading, error,
    addSlot, removeSlot, nudgeHour, nudgeMinute, setAP,
    handleSave, applyToAll,
    configuredCount,
  };
}