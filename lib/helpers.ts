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
    availStartTime: any,
    availEndTime: any,
    bookedSlots: any,
    slotDurationMinutes: any
) {
  const avStart = new Date(availStartTime);
  const avEnd = new Date(availEndTime);
  const targetDate = new Date(date);

  // Check if selected date falls within the availability range
  const dayStart = set(targetDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  const dayEnd   = set(targetDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });

  // No overlap between this day and the availability window
  if (isAfter(avStart, dayEnd) || isBefore(avEnd, dayStart)) {
    return [];
  }

  // Clamp the slot window to both the day boundary and the availability range
  const start = isAfter(avStart, dayStart) ? avStart : dayStart;
  const end   = isBefore(avEnd, dayEnd)    ? avEnd   : dayEnd;

  const now = new Date();
  const slots = [];
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
  return slots;
}