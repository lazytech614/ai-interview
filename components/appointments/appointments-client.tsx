"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Tab = "upcoming" | "past" | "all";
type StatusFilter = "ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AppointmentsClient({ appointments }: { appointments: any[] }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const now = new Date();

  const upcoming = useMemo(
    () =>
      appointments.filter(
        (a) => a.status === "SCHEDULED" && new Date(a.startTime) > now
      ),
    [appointments]
  );

  const past = useMemo(
    () =>
      appointments.filter(
        (a) => a.status !== "SCHEDULED" || new Date(a.endTime) <= now
      ),
    [appointments]
  );

  const baseList = tab === "upcoming" ? upcoming : tab === "past" ? past : appointments;

  const filtered = useMemo(() => {
    let list = baseList;

    if (statusFilter !== "ALL") {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => {
        const interviewer = a.interviewer?.name?.toLowerCase() ?? "";
        const interviewee = a.interviewee?.name?.toLowerCase() ?? "";
        return interviewer.includes(q) || interviewee.includes(q);
      });
    }

    return list;
  }, [baseList, statusFilter, search]);

  const isPast = tab === "past";
  const hasFilters = search.trim() || statusFilter !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
        <span className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <CalendarDays size={28} className="text-amber-400" />
        </span>
        <div>
          <p className="text-base text-stone-400 font-light">No sessions booked yet.</p>
          <p className="text-sm text-stone-600 mt-1">
            Browse expert interviewers and book your first session.
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/explore">Browse interviewers →</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
        {(
          [
            { key: "upcoming", label: "Upcoming", count: upcoming.length },
            { key: "past", label: "Past", count: past.length },
            { key: "all", label: "All", count: appointments.length },
          ] as { key: Tab; label: string; count: number }[]
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === key
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/25"
                : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
            }`}
          >
            {label}
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md min-w-5 text-center ${
                tab === key
                  ? "bg-amber-400/20 text-amber-300"
                  : "bg-white/5 text-stone-600"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-55] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="pl-8 pr-8 bg-white/3 border-white/10 text-stone-300 placeholder:text-stone-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/30 h-9 text-sm rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 h-9 rounded-xl border-white/10 bg-white/3 text-stone-400 hover:text-stone-200 hover:bg-white/8 hover:border-white/20 ${
                statusFilter !== "ALL"
                  ? "border-amber-400/30 text-amber-400 bg-amber-400/5"
                  : ""
              }`}
            >
              <SlidersHorizontal size={13} />
              {statusFilter === "ALL"
                ? "Status"
                : STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#111113] border border-white/10 text-stone-300"
          >
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={statusFilter === opt.value}
                onCheckedChange={() => setStatusFilter(opt.value)}
                className="focus:bg-white/8 focus:text-stone-200 cursor-pointer"
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-stone-600 hover:text-stone-400 flex items-center gap-1 transition-colors"
          >
            <X size={11} />
            Clear
          </button>
        )}

        <p className="text-xs text-stone-600 ml-auto">
          {filtered.length} session{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <span className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
            <Search size={20} className="text-stone-600" />
          </span>
          <div>
            <p className="text-sm text-stone-500">No sessions match your filters.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-amber-400/70 hover:text-amber-400 mt-1 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <AppointmentCard
              key={b.id}
              booking={b}
              mode="interviewee"
              isPast={isPast || b.status !== "SCHEDULED" || new Date(b.endTime) <= now}
            />
          ))}
        </div>
      )}
    </div>
  );
}