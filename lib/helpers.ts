import { HOURS_12 } from "@/components/dashboard/constants/constants";
import { DaySlots, TimeSlot } from "@/components/dashboard/types/types";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  addMinutes,
  isBefore,
  isAfter,
  set,
  differenceInMinutes,
} from "date-fns";

// "Mon, Mar 24, 2026" — used in appointment cards
export function formatDate(iso: any) {
  return format(new Date(iso), "EEE, MMM d, yyyy");
}

// "Monday, March 24, 2026" — used in the booking confirm card
export function formatDateFull(date: any) {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

// "9:30 AM" — used anywhere a time-only string is needed (slot buttons, appointment rows)
export function formatTime(date: any) {
  return format(new Date(date), "h:mm a");
}

// "1h 30m" or "45m" — used in appointment cards to show session length
export function formatDuration(start: any, end: any) {
  const mins = differenceInMinutes(new Date(end), new Date(start));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

// Returns { top, bottom } label for each date tab in SlotPicker.
// Today/Tomorrow get friendly labels; all other days show short weekday name.
// bottom is always "MMM d" (e.g. "Mar 24") regardless of which branch.
export function formatDateTab(date: any) {
  const bottom = format(date, "MMM d");
  if (isToday(date)) return { top: "Today", bottom };
  if (isTomorrow(date)) return { top: "Tomorrow", bottom };
  return { top: format(date, "EEE"), bottom };
}

// Produces an array of Date objects starting from today, one per day,
// for the next `daysAhead` days — used to populate the date tab strip.
export function generateDates(daysAhead: any) {
  return Array.from({ length: daysAhead }, (_, i) => addDays(new Date(), i));
}

// Splits an interviewer's daily availability window into fixed-length slots
// and marks each one as booked or available.
//
// - date:                the calendar day to generate slots for
// - availStartTime:      the stored availability start (only hours/minutes are used)
// - availEndTime:        the stored availability end (only hours/minutes are used)
// - bookedSlots:         existing SCHEDULED bookings to check for conflicts
// - slotDurationMinutes: length of each slot (45 min throughout the app)
//
// Past slots (cursor <= now) are skipped entirely so they never appear in the UI.
// A slot is marked isBooked if it overlaps any existing booking using a standard
// overlap check: slotStart < bookedEnd && slotEnd > bookedStart.
export function generateSlots(
  date: any,
  availabilities: { startTime: any; endTime: any }[],  // array now, not single
  bookedSlots: any[],
  slotDurationMinutes: number
) {
  const targetDate = new Date(date);
  const dayStart = set(targetDate, { hours: 0,  minutes: 0,  seconds: 0,  milliseconds: 0 });
  const dayEnd   = set(targetDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });
  const now = new Date();
  const slots = [];

  for (const { startTime, endTime } of availabilities) {
    const avStart = new Date(startTime);
    const avEnd   = new Date(endTime);

    // Skip windows that don't touch this day
    if (isAfter(avStart, dayEnd) || isBefore(avEnd, dayStart)) continue;

    // Clamp to both the day boundary and the availability window
    const start = isAfter(avStart, dayStart) ? avStart : dayStart;
    const end   = isBefore(avEnd, dayEnd)    ? avEnd   : dayEnd;

    let cursor = start;
    while (isBefore(cursor, end)) {
      const slotEnd = addMinutes(cursor, slotDurationMinutes);
      if (isAfter(slotEnd, end)) break;

      const isBooked = bookedSlots.some(
        (b: any) =>
          isBefore(cursor, new Date(b.endTime)) &&
          isAfter(slotEnd, new Date(b.startTime))
      );

      if (isAfter(cursor, now)) {
        slots.push({
          startTime: cursor,
          endTime: slotEnd,
          isBooked,
          available: !isBooked,
        });
      }
      cursor = slotEnd;
    }
  }

  // Sort all slots chronologically across all windows
  return slots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

export function getNext7Days(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function toDateKey(d: Date): string {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day   = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toISO(dateKey: string, h24: number, m: number): string {
  return new Date(
    `${dateKey}T${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
  ).toISOString();
}

export function to24(h12: number, ap: "AM" | "PM"): number {
  if (ap === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

export function from24(h24: number): { h12: number; ap: "AM" | "PM" } {
  const ap: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return { h12, ap };
}

export function getSlotDuration(slot: TimeSlot): string | null {
  if (slot.startH === null || slot.endH === null) return null;
  const startMin = to24(HOURS_12[slot.startH], slot.startAP) * 60 + slot.startM;
  const endMin   = to24(HOURS_12[slot.endH],   slot.endAP)   * 60 + slot.endM;
  const diff = endMin - startMin;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60), m = diff % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

export function makeEmptySlot(): TimeSlot {
  return {
    id: crypto.randomUUID(),
    startH: null, startM: 0, startAP: "AM",
    endH:   null, endM:   0, endAP:   "PM",
  };
}

export function parseInitial(
  initial?: Record<string, { startTime: string; endTime: string } | { startTime: string; endTime: string }[]>
): Record<string, DaySlots> {
  if (!initial) return {};
  const out: Record<string, DaySlots> = {};
  for (const [key, entries] of Object.entries(initial)) {
    // normalise: single object or array → always array
    const normalised = Array.isArray(entries) ? entries : [entries];
    out[key] = normalised.map(({ startTime, endTime }) => {
      const s = new Date(startTime);
      const e = new Date(endTime);
      const { h12: sh12, ap: sap } = from24(s.getHours());
      const { h12: eh12, ap: eap } = from24(e.getHours());
      return {
        id: crypto.randomUUID(),
        startH: HOURS_12.indexOf(sh12 as typeof HOURS_12[number]),
        startM: s.getMinutes(),
        startAP: sap,
        endH: HOURS_12.indexOf(eh12 as typeof HOURS_12[number]),
        endM: e.getMinutes(),
        endAP: eap,
      };
    });
  }
  return out;
}

/** Check if two slots overlap */
export function slotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  if (a.startH === null || a.endH === null || b.startH === null || b.endH === null) return false;
  const aStart = to24(HOURS_12[a.startH], a.startAP) * 60 + a.startM;
  const aEnd   = to24(HOURS_12[a.endH],   a.endAP)   * 60 + a.endM;
  const bStart = to24(HOURS_12[b.startH], b.startAP) * 60 + b.startM;
  const bEnd   = to24(HOURS_12[b.endH],   b.endAP)   * 60 + b.endM;
  return aStart < bEnd && bStart < aEnd;
}