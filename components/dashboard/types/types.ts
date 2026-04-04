import { SessionRate } from "@/lib/generated/prisma/client";
import { InterviewCategory } from "@/lib/generated/prisma/enums";

export interface TimeSlot {
  id: string;           // local uuid for keying
  startH: number | null;
  startM: number;
  startAP: "AM" | "PM";
  endH: number | null;
  endM: number;
  endAP: "AM" | "PM";
}

// one day can have multiple slots
export type DaySlots = TimeSlot[];

export interface AvailabilitySectionProps {
  initial?: Record<string, { startTime: string; endTime: string } | { startTime: string; endTime: string }[]>;
}

export type FormData = {
  title: string;
  company: string;
  yearsExp: number;
  bio: string;
  categories: InterviewCategory[];
  sessionRates: SessionRate;
};