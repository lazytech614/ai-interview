"use client";

import { useState } from "react";

const cookieCategories = [
  {
    id: "necessary",
    title: "Strictly Necessary",
    required: true,
    description:
      "These cookies are essential for Prept to function. They handle authentication (via Clerk), session state, and security (Arcjet CSRF protection). You cannot disable them.",
  },
  {
    id: "functional",
    title: "Functional",
    required: false,
    defaultOn: true,
    description:
      "Remembers your preferences such as dark/light mode, last interview category viewed, and notification settings. Disabling these means your settings won't persist between sessions.",
  },
  {
    id: "analytics",
    title: "Analytics",
    required: false,
    defaultOn: true,
    description:
      "Anonymised usage data that helps us understand which features are valuable, where users drop off, and how to improve the product. We use privacy-first analytics — no third-party ad networks.",
  },
  {
    id: "marketing",
    title: "Marketing",
    required: false,
    defaultOn: false,
    description:
      "Used only if you opt in to receive relevant ads on third-party platforms. We never enable these by default. Enabling this allows retargeting on platforms like LinkedIn.",
  },
];

export default function CookiesPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      cookieCategories.map((c) => [c.id, c.required || c.defaultOn || false])
    )
  );
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  function rejectAll() {
    setPrefs(
      Object.fromEntries(
        cookieCategories.map((c) => [c.id, c.required || false])
      )
    );
    setSaved(false);
  }

  function savePrefs() {
    // Persist to cookie / localStorage as needed
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-[760px] mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#C8F04A]">
          Legal
        </span>
        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Cookie Policy
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-10 border-b border-white/[0.08]">
          Last updated: January 14, 2025
        </p>

        <p className="text-[14.5px] leading-[1.8] text-[#B0ADB8] mb-10">
          We use cookies and similar technologies to make Prept work, understand
          how it&apos;s used, and improve your experience. Here&apos;s exactly what we use
          and why.
        </p>

        <h2 className="font-serif text-[22px] font-normal text-[#F0EDE8] mb-5">
          Manage Your Preferences
        </h2>

        <div className="space-y-3.5 mb-8">
          {cookieCategories.map((cat) => (
            <div
              key={cat.id}
              className="border border-white/[0.08] rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <h3 className="text-[14.5px] font-medium text-[#F0EDE8]">
                  {cat.title}
                </h3>
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] text-[#8A8790]">
                    {cat.required
                      ? "Always on"
                      : prefs[cat.id]
                      ? "On"
                      : "Off"}
                  </span>
                  <button
                    onClick={() => !cat.required && toggle(cat.id)}
                    disabled={cat.required}
                    aria-label={`Toggle ${cat.title}`}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      cat.required
                        ? "bg-[#C8F04A]/30 cursor-not-allowed"
                        : prefs[cat.id]
                        ? "bg-[#C8F04A]"
                        : "bg-white/20 cursor-pointer"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white transition-all duration-200 ${
                        prefs[cat.id] || cat.required ? "left-[19px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="px-5 py-3.5 border-t border-white/[0.08]">
                <p className="text-[13.5px] text-[#B0ADB8] leading-[1.7]">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={rejectAll}
            className="px-5 py-2.5 border border-white/[0.08] rounded-lg text-[13.5px] font-medium text-[#F0EDE8] hover:border-white/[0.18] transition-colors"
          >
            Reject all optional
          </button>
          <button
            onClick={savePrefs}
            className="px-5 py-2.5 bg-[#C8F04A] text-[#0A0A0F] rounded-lg text-[13.5px] font-medium hover:opacity-90 transition-opacity"
          >
            {saved ? "Saved ✓" : "Save preferences →"}
          </button>
        </div>
      </div>
    </main>
  );
}