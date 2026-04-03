"use client";

import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/data";
import { InterviewCategory } from "@/lib/generated/prisma/enums";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InterviewerCard from "./interviewer-card";

const PAGE_SIZE = 6;

const ExploreGrid = ({ interviewers }: { interviewers: any[] }) => {
  const [activeCategory, setActiveCategory] =
    useState<InterviewCategory | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // =========================
  // FILTER LOGIC
  // =========================
  const filtered = useMemo(() => {
    return interviewers.filter((interviewer: any) => {
      const matchesCategory =
        !activeCategory || interviewer.categories.includes(activeCategory);

      const q = search.toLowerCase().trim();

      const matchesSearch =
        !q ||
        interviewer.name?.toLowerCase().includes(q) ||
        interviewer.company?.toLowerCase().includes(q) ||
        interviewer.title?.toLowerCase().includes(q) ||
        interviewer.bio?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [interviewers, activeCategory, search]);

  // =========================
  // PAGINATION LOGIC
  // =========================
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  // =========================
  // PAGE NUMBER LOGIC (…)
  // =========================
  const getPages = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - page) <= 1
      ) {
        pages.push(i);
      } else if (
        i === page - 2 ||
        i === page + 2
      ) {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ========================= */}
      {/* SEARCH + FILTER */}
      {/* ========================= */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, company or bio..."
            className="pl-9 bg-[#0f0f11] border-white/10 text-stone-100 placeholder:text-stone-600 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;

            return (
              <button
                key={String(cat.value)}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    isActive ? null : (cat.value as InterviewCategory)
                  )
                }
                className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-white/10 text-stone-500 hover:border-white/20 hover:text-stone-400"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================= */}
      {/* COUNT */}
      {/* ========================= */}
      <p className="text-xs text-stone-600">
        {filtered.length === 0
          ? "No interviewers found."
          : `${filtered.length} ${
              filtered.length === 1 ? "interviewer" : "interviewers"
            } found.`}
      </p>

      {/* ========================= */}
      {/* EMPTY STATE */}
      {/* ========================= */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-600 text-sm">
            No interviewers match your search.
          </p>
          <Button
            onClick={() => {
              setActiveCategory(null);
              setSearch("");
            }}
            variant="link"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* ========================= */}
          {/* GRID */}
          {/* ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((interviewer: any) => (
              <InterviewerCard
                key={interviewer.id}
                interviewer={interviewer}
              />
            ))}
          </div>

          {/* ========================= */}
          {/* PAGINATION */}
          {/* ========================= */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2 text-sm">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-white/10 rounded-md text-stone-400 disabled:opacity-40"
              >
                Prev
              </button>

              {/* Pages */}
              {getPages().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 text-stone-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(Number(p))}
                    className={`px-3 py-1 rounded-md border ${
                      page === p
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                        : "border-white/10 text-stone-500 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="px-3 py-1 border border-white/10 rounded-md text-stone-400 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreGrid;