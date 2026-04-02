import { GoldTitle } from "@/components/global/reusables";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Prept",
  description: "Join the Prept team and help engineers succeed globally.",
};

// Sample career openings
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    type: "Full-time",
    location: "Remote",
    link: "/careers/senior-frontend-engineer",
  },
  {
    id: 2,
    title: "Product Manager – AI Tools",
    type: "Full-time",
    location: "Remote / India",
    link: "/careers/product-manager-ai",
  },
  {
    id: 3,
    title: "Technical Content Writer",
    type: "Part-time",
    location: "Remote",
    link: "/careers/technical-writer",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-190 mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-widest text-amber-400">
          <GoldTitle>Join Us</GoldTitle>
        </span>

        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Careers
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-11 border-b border-white/8">
          Be part of a team dedicated to helping engineers grow and succeed globally.
        </p>

        <div className="space-y-6">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={job.link}
              className="block bg-[#1B1B20] border border-white/10 rounded-xl p-6 transition-all hover:border-amber-400/40 hover:bg-[#25252B]"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl font-medium text-[#F0EDE8] hover:text-amber-400">
                  {job.title}
                </h2>
                <span className="text-xs text-stone-400">{job.type}</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">{job.location}</p>
              <span className="mt-3 inline-block text-amber-400 text-xs font-medium hover:underline">
                Apply →
              </span>
            </a>
          ))}
        </div>

        <div className="mt-14 text-center text-stone-500 text-[13px]">
          <p>
            Can’t find the role you’re looking for? Send your CV to{" "}
            <a href="mailto:careers@prept.io" className="text-amber-400 hover:opacity-80">
              careers@prept.io
            </a>{" "}
            and we’ll keep you in mind for future opportunities.
          </p>
        </div>
      </div>
    </main>
  );
}