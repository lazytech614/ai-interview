"use client";

import { useState, useMemo, useEffect } from "react";
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

type Tab = "all" | "upcoming" | "past";
type StatusFilter = "ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AppointmentsClient({ appointments }: { appointments: any[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // ✅ Pagination state
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

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

  const baseList =
    tab === "upcoming" ? upcoming : tab === "past" ? past : appointments;

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

  // ✅ Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [tab, search, statusFilter]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
          <p className="text-base text-stone-400 font-light">
            No sessions booked yet.
          </p>
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
        {[
          { key: "all", label: "All", count: appointments.length },
          { key: "upcoming", label: "Upcoming", count: upcoming.length },
          { key: "past", label: "Past", count: past.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/25"
                : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
            }`}
          >
            {label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
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

      {/* ── Search + Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" size={14} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="pl-8 pr-8 bg-white/3 border-white/10 text-stone-300 h-9 text-sm rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal size={13} />
              {statusFilter === "ALL"
                ? "Status"
                : STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={statusFilter === opt.value}
                onCheckedChange={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-stone-500">
            Clear
          </button>
        )}
      </div>

        {paginated.length === 0 &&  (search || statusFilter !== "ALL") && (
          <div className="py-20 text-center">
            <p className="text-stone-600 text-sm">
              No interviewers match your search.
            </p>
            <Button
              onClick={clearFilters}
              variant="link"
            >
              Clear Filters
            </Button>
          </div>
        )}

      {/* ── Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginated.map((b) => (
          <AppointmentCard
            key={b.id}
            booking={b}
            mode="interviewee"
            isPast={isPast || new Date(b.endTime) <= now}
          />
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;

            if (
              p === 1 ||
              p === totalPages ||
              Math.abs(p - page) <= 1
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    page === p
                      ? "bg-amber-400 text-black"
                      : "border-white/10 text-stone-400"
                  }`}
                >
                  {p}
                </button>
              );
            }

            if (p === page - 2 || p === page + 2) {
              return <span key={p}>...</span>;
            }

            return null;
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}