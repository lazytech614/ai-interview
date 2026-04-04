"use client";

import { useState } from "react";
import { CATEGORIES, YEARS_OPTIONS } from "@/lib/data";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const InterviewerOnboardingForm = ({ form, setForm }: any) => {
  const [search, setSearch] = useState("");

  const toggleCategory = (category: string) => {
    if (form.categories.includes(category)) {
      setForm({
        ...form,
        categories: form.categories.filter((c: string) => c !== category),
      });
    } else {
      setForm({
        ...form,
        categories: [...form.categories, category],
      });
    }
  };

  const setRate = (duration: 45 | 60 | 90, value: number) => {
    setForm((prev: any) => ({
      ...prev,
      sessionRates: {
        ...prev.sessionRates,
        [duration]: value,
      },
    }));
  };

  // Filter categories based on search
  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">

      {/* Existing Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Current Title</Label>
          <Input
            placeholder="Senior Software Engineer"
            value={form.title}
            onChange={(e) =>
              setForm((prev: any) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Company</Label>
          <Input
            placeholder="Google, Meta, Amazon"
            value={form.company}
            onChange={(e) =>
              setForm((prev: any) => ({ ...prev, company: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Years */}
      <div className="flex flex-wrap gap-2">
        {YEARS_OPTIONS.map((year) => (
          <button
            key={year.value}
            type="button"
            onClick={() =>
              setForm((prev: any) => ({
                ...prev,
                yearsExp: year.value,
              }))
            }
            className={`text-xs px-4 py-2 rounded-lg border ${
              form.yearsExp === year.value
                ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                : "border-white/10 text-stone-500"
            }`}
          >
            {year.label}
          </button>
        ))}
      </div>

      {/* 🔥 Categories Section */}
      <div className="flex flex-col gap-4">
        <Label>Categories</Label>

        {/* 🔍 Search */}
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />

        {/* ✅ Selected Chips */}
        {form.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.categories.map((cat: string) => {
              const label =
                CATEGORIES.find((c) => c.value === cat)?.label || cat;

              return (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="cursor-pointer text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30"
                >
                  {label} ✕
                </div>
              );
            })}
          </div>
        )}

        {/* 📦 Category List */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {filteredCategories.map((category) => {
            if (!category.value) return null;

            const active = form.categories.includes(category.value);

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => toggleCategory(category.value as string)}
                className={`text-xs px-4 py-2 rounded-lg border transition ${
                  active
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-white/10 text-stone-500 hover:border-white/30"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Rates (unchanged) */}
      <div className="flex flex-col gap-4">
        <Label>Session Credit Rates</Label>

        <div>
          <p className="text-xs text-stone-400 mb-2">45 mins</p>
          <button className="text-xs px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-400 cursor-not-allowed">
            1 Credit (Fixed)
          </button>
        </div>

        <div>
          <p className="text-xs text-stone-400 mb-2">60 mins</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setRate(60, val)}
                className={`text-xs px-4 py-2 rounded-lg border ${
                  form.sessionRates?.[60] === val
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-white/10 text-stone-500"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-stone-400 mb-2">90 mins</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setRate(90, val)}
                className={`text-xs px-4 py-2 rounded-lg border ${
                  form.sessionRates?.[90] === val
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : "border-white/10 text-stone-500"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <Textarea
        rows={4}
        maxLength={300}
        placeholder="Tell interviewee about your background..."
        value={form.bio}
        onChange={(e) =>
          setForm((prev: any) => ({ ...prev, bio: e.target.value }))
        }
      />
    </div>
  );
};

export default InterviewerOnboardingForm;