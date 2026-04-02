import { GoldTitle } from "@/components/global/reusables";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Prept",
  description:
    "Prept was built by an engineer who failed interviews too. Here's our story.",
};

const stats = [
  { num: "2,400+", label: "Engineers practised" },
  { num: "94%", label: "Success rate (self-reported)" },
  { num: "120+", label: "Expert interviewers" },
];

const missionCards = [
  {
    icon: "🎯",
    title: "Our Mission",
    body: "Make real interview practice accessible to every engineer, regardless of their background or network.",
  },
  {
    icon: "⚡",
    title: "Why AI + Humans",
    body: "AI handles feedback at scale. Humans bring the nuance, war stories, and empathy that no model can replicate.",
  },
  {
    icon: "🌍",
    title: "Who We Serve",
    body: "Engineers at every level — new grads to staff engineers — preparing for roles at startups and FAANGs alike.",
  },
  {
    icon: "📈",
    title: "The Opportunity",
    body: "Millions of interviews happen annually. Most candidates prepare alone. We're changing that, one session at a time.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      {/* Hero */}
      <div className="border-b border-white/8 py-14 px-10">
        <div className="max-w-170 mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#C8F04A] mb-4">
            <GoldTitle>Our Story</GoldTitle>
          </p>
          <h1 className="font-serif text-[40px] font-normal leading-tight text-[#F0EDE8] mb-4">
            Built by an engineer who{" "}
            <em className="text-amber-400">failed</em> interviews too
          </h1>
          <p className="text-[15px] leading-[1.8] text-[#B0ADB8]">
            Prept started with a simple belief: the gap between talent and
            opportunity isn&apos;t skill — it&apos;s practice with the right people.
          </p>
        </div>
      </div>

      <div className="max-w-225 mx-auto px-10 py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center bg-[#C8F04A]/4 border border-[#C8F04A]/12 rounded-xl py-5 px-4"
            >
              <p className="font-serif text-[36px] text-amber-400 leading-none mb-1.5">
                {s.num}
              </p>
              <p className="text-[12.5px] text-[#8A8790]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-2 gap-5 mb-12">
          {missionCards.map((card) => (
            <div
              key={card.title}
              className="bg-white/3 border border-white/8 rounded-xl p-6"
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="text-[15px] font-medium text-[#F0EDE8] mb-2">
                {card.title}
              </h3>
              <p className="text-[13.5px] text-[#B0ADB8] leading-[1.7]">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Founder */}
        <div className="flex gap-5 items-start bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="w-13 h-13 rounded-full bg-linear-to-br from-[#C8F04A]/30 to-[#A78BFA]/30 flex items-center justify-center font-serif text-xl text-[#F0EDE8] shrink-0">
            R
          </div>
          <div>
            <h4 className="text-[15px] font-medium text-[#F0EDE8] mb-0.5">
              Rupanjan
            </h4>
            <p className="text-[12.5px] text-[#C8F04A] mb-2.5">
              Founder & Builder
            </p>
            <p className="text-[13.5px] text-[#B0ADB8] leading-[1.7]">
              A full-stack developer who built Prept after experiencing the
              frustration of preparing for interviews without real feedback.
              Prept is his attempt to give every engineer the mentorship he
              wished he had.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}