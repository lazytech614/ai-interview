"use client";

import { useState } from "react";
import { ClipboardList, Clock, Wallet } from "lucide-react";
import AppointmentsSection from "@/components/dashboard/appointments-section";
import AvailabilitySection from "@/components/dashboard/availability-section";
import EarningsSection from "@/components/dashboard/earnings-section";

type Tab = "earnings" | "appointments" | "availability";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "earnings", label: "Earnings", icon: <Wallet size={15} /> },
  { key: "appointments", label: "Appointments", icon: <ClipboardList size={15} /> },
  { key: "availability", label: "Availability", icon: <Clock size={15} /> },
];

export function DashboardTabs({ appointments, availability, stats, withdrawalHistory }: any) {
  const [tab, setTab] = useState<Tab>("earnings");

  return (
    <div className="flex flex-col gap-8">
      {/* ── Custom Tabs ── */}
      <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === key
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/25"
                : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
            }`}
          >
            <span className={tab === key ? "text-amber-400" : "text-stone-600"}>
              {icon}
            </span>
            <span className="hidden xs:inline sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === "earnings" && (
        <EarningsSection stats={stats} history={withdrawalHistory} />
      )}
      {tab === "appointments" && (
        <AppointmentsSection appointments={appointments} />
      )}
      {tab === "availability" && (
        <AvailabilitySection initial={availability} />
      )}
    </div>
  );
}