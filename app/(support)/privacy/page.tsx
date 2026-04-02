import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Prept",
  description: "How Prept collects, uses, and protects your personal data.",
};

const dataUsageTable = [
  {
    purpose: "Providing the interview platform",
    basis: "Contract performance",
    data: "Account, session data",
  },
  {
    purpose: "Processing payments & credits",
    basis: "Contract performance",
    data: "Payment data",
  },
  {
    purpose: "AI feedback generation (Gemini)",
    basis: "Legitimate interest",
    data: "Session transcripts",
  },
  {
    purpose: "Security & fraud prevention (Arcjet)",
    basis: "Legitimate interest",
    data: "Device, usage data",
  },
  {
    purpose: "Product improvements",
    basis: "Legitimate interest",
    data: "Anonymized usage data",
  },
  {
    purpose: "Marketing emails (opt-in only)",
    basis: "Consent",
    data: "Email address",
  },
];

const providers = [
  { name: "Clerk", role: "Authentication and user management" },
  { name: "Stripe", role: "Payment processing" },
  { name: "Stream", role: "Video calls and persistent chat" },
  { name: "Google (Gemini)", role: "AI feedback generation" },
  { name: "Arcjet", role: "Security and rate limiting" },
  { name: "Prisma / Neon", role: "Database infrastructure" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-[760px] mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#C8F04A]">
          Legal
        </span>
        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Privacy Policy
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-11 border-b border-white/[0.08]">
          Last updated: January 14, 2025 · Effective date: January 14, 2025
        </p>

        <div className="bg-[#C8F04A]/5 border border-[#C8F04A]/15 rounded-xl px-5 py-4 mb-10">
          <p className="text-[13.5px] text-[#F0EDE8] leading-relaxed">
            We built Prept to help engineers grow — not to harvest your data.
            This policy explains clearly what we collect, why, and how you can
            control it.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p className="body-text">
            When you create an account or use Prept, we collect information
            necessary to provide our services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            {[
              "Account data: Name, email address, and profile photo (via Clerk authentication).",
              "Session data: Interview recordings, chat messages, AI feedback reports, and scheduling data.",
              "Usage data: Pages visited, features used, session durations, and error logs.",
              "Payment data: Billing information processed and stored securely by Stripe. We never store card numbers.",
              "Device data: IP address, browser type, and operating system for security and fraud prevention.",
            ].map((item) => (
              <li key={item} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr>
                  {["Purpose", "Legal Basis", "Data Used"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3.5 py-2.5 bg-white/[0.04] text-[#8A8790] font-medium text-[12px] uppercase tracking-[0.06em] border-b border-white/[0.08]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataUsageTable.map((row) => (
                  <tr key={row.purpose} className="border-b border-white/[0.06]">
                    <td className="px-3.5 py-2.5 text-[#B0ADB8]">{row.purpose}</td>
                    <td className="px-3.5 py-2.5 text-[#B0ADB8]">{row.basis}</td>
                    <td className="px-3.5 py-2.5 text-[#B0ADB8]">{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Data Sharing">
          <p className="body-text">
            We do not sell your personal data. We share data only with trusted
            service providers necessary to operate Prept:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            {providers.map((p) => (
              <li key={p.name} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
                <span className="text-[#F0EDE8] font-medium">{p.name}</span> — {p.role}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4. Data Retention">
          <p className="body-text">
            We retain your data for as long as your account is active. Session
            recordings are stored for 90 days unless you delete them earlier.
            You can request full data deletion by contacting us at{" "}
            <a href="mailto:privacy@prept.io" className="text-[#C8F04A] hover:opacity-80">
              privacy@prept.io
            </a>
            .
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p className="body-text">
            Depending on your jurisdiction, you have the right to access,
            correct, delete, or export your personal data. To exercise any
            right, contact{" "}
            <a href="mailto:privacy@prept.io" className="text-[#C8F04A] hover:opacity-80">
              privacy@prept.io
            </a>
            .
          </p>
        </Section>

        <Section title="6. Cookies">
          <p className="body-text">
            We use essential cookies for authentication and preference storage.
            See our{" "}
            <a href="/cookies" className="text-[#C8F04A] hover:opacity-80">
              Cookie Policy
            </a>{" "}
            for full details.
          </p>
        </Section>

        <Section title="7. Contact">
          <p className="body-text">
            Questions? Email us at{" "}
            <a href="mailto:privacy@prept.io" className="text-[#C8F04A] hover:opacity-80">
              privacy@prept.io
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