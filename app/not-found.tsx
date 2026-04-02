import Link from "next/link";

export default function NotFound() {
  const suggestions = [
    { label: "Pricing", href: "/#pricing" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "My dashboard", href: "/dashboard" },
    { label: "AI feedback", href: "/#features" },
    { label: "Session recordings", href: "/#features" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8] flex flex-col items-center justify-center px-6 text-center">
      {/* Big number */}
      <p className="font-serif text-[120px] text-amber-400/20 leading-none tracking-[-4px] select-none">
        404
      </p>

      <h2 className="font-serif text-[28px] font-normal text-[#F0EDE8] -mt-3 mb-3">
        This page took the wrong exit
      </h2>

      <p className="text-[14.5px] text-[#B0ADB8] leading-[1.8] max-w-105 mb-8">
        The page you&apos;re looking for has moved, been deleted, or never existed.
        Let&apos;s get you back on track.
      </p>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center mb-14">
        <Link
          href="/"
          className="bg-amber-400 text-[#0A0A0F] font-medium text-[13.5px] px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go home →
        </Link>
        <Link
          href="/explore"
          className="border border-white/8 text-[#F0EDE8] text-[13.5px] px-5 py-2.5 rounded-lg hover:border-white/18 transition-colors"
        >
          Browse interviewers
        </Link>
        <Link
          href="/contact"
          className="border border-white/8 text-[#F0EDE8] text-[13.5px] px-5 py-2.5 rounded-lg hover:border-white/18 transition-colors"
        >
          Contact support
        </Link>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-widest text-[#8A8790] mb-4">
          You might be looking for
        </p>
        <div className="flex gap-2.5 flex-wrap justify-center">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white/4 border border-white/8 rounded-full px-4 py-1.5 text-[13px] text-[#C4C1CC] hover:border-white/18 hover:text-[#F0EDE8] transition-all"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}