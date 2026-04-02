import { GoldTitle } from "@/components/global/reusables";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Prept",
  description: "Understand Prept's refund policy, eligibility, and process.",
};

const refundRules = [
  {
    condition: "Cancelled 24+ hours before the session",
    refund: "Full refund (100%)",
  },
  {
    condition: "Cancelled 12-24 hours before the session",
    refund: "50% refund",
  },
  {
    condition: "Cancelled less than 12 hours before the session",
    refund: "No refund",
  },
  {
    condition: "Missed session (no-show)",
    refund: "No refund",
  },
];

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-190 mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-widest text-amber-400">
          <GoldTitle>Legal</GoldTitle>
        </span>
        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Refund Policy
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-11 border-b border-white/8">
          Last updated: January 14, 2025 · Effective date: January 14, 2025
        </p>

        <div className="bg-[#C8F04A]/5 border border-[#C8F04A]/15 rounded-xl px-5 py-4 mb-10">
          <p className="text-[13.5px] text-[#F0EDE8] leading-relaxed">
            Prept is committed to providing a fair and transparent refund process.
            This page outlines eligibility, timelines, and steps for requesting refunds.
          </p>
        </div>

        <Section title="1. Refund Eligibility">
          <p className="body-text">
            Refunds are applicable only under certain conditions. Please review
            the table below for details on eligibility based on timing and circumstances:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr>
                  {["Condition", "Refund"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3.5 py-2.5 bg-white/4 text-[#8A8790] font-medium text-[12px] uppercase tracking-[0.06em] border-b border-white/8"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refundRules.map((row) => (
                  <tr key={row.condition} className="border-b border-white/6">
                    <td className="px-3.5 py-2.5 text-[#B0ADB8]">{row.condition}</td>
                    <td className="px-3.5 py-2.5 text-[#B0ADB8]">{row.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="2. How to Request a Refund">
          <p className="body-text">
            To request a refund, please follow these steps:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            {[
              "Log in to your Prept account and navigate to 'My Sessions'.",
              "Select the session you wish to cancel and click 'Request Refund'.",
              "Provide a reason for cancellation if prompted.",
              "Submit your request. Refunds will be processed according to the table above."
            ].map((item) => (
              <li key={item} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="3. Refund Processing Time">
          <p className="body-text">
            Approved refunds are typically processed within 5–7 business days.
            The amount will be returned to the original payment method. Bank
            processing times may vary.
          </p>
        </Section>

        <Section title="4. Exceptions">
          <p className="body-text">
            Refunds are not provided for the following situations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            {[
              "No-shows for scheduled sessions",
              "Partial attendance of a session",
              "Disputes regarding session quality or feedback"
            ].map((item) => (
              <li key={item} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. Contact">
          <p className="body-text">
            For any questions regarding refunds, email us at{" "}
            <a href="mailto:support@prept.io" className="text-amber-400 hover:opacity-80">
              support@prept.io
            </a>{" "}
            or write to: Prept, c/o Rupanjan, India.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="font-serif text-[22px] font-normal text-[#F0EDE8] mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}