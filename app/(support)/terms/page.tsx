import { GoldTitle } from "@/components/global/reusables";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Prept",
  description: "Terms and conditions for using the Prept platform.",
};

const sections = [
  {
    num: "1",
    title: "Acceptance of Terms",
    content: (
      <p className="body-text">
        By accessing or using Prept (&ldquo;the platform&rdquo;), you agree to be bound by
        these Terms of Service. If you disagree with any part, you may not
        access the platform. These terms apply to all users — interviewees,
        interviewers, and visitors.
      </p>
    ),
  },
  {
    num: "2",
    title: "Account Registration",
    content: (
      <p className="body-text">
        You must provide accurate information when creating an account. You are
        responsible for maintaining the confidentiality of your credentials and
        for all activity under your account. You must be at least 18 years old
        to use Prept.
      </p>
    ),
  },
  {
    num: "3",
    title: "Credit System & Payments",
    content: (
      <>
        <p className="body-text mb-3">
          Prept operates on a credit-based system. Credits are purchased via
          monthly subscription plans processed by Stripe. Key terms:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          {[
            "Credits roll over month-to-month and do not expire while your subscription is active.",
            "Credits are non-refundable once consumed in a completed session.",
            "Unused credits from cancelled subscriptions are valid for 30 days post-cancellation.",
            "Interviewers earn credits per completed session. Withdrawal requests are processed within 5–7 business days.",
            "Prept reserves the right to adjust credit values with 30 days' notice.",
          ].map((item) => (
            <li key={item} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "4",
    title: "Session Conduct",
    content: (
      <>
        <p className="body-text mb-3">
          All users agree to professional conduct during sessions. Prohibited
          during sessions:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3">
          {[
            "Sharing session recordings publicly without mutual written consent",
            "Harassment, discrimination, or abusive behavior of any kind",
            "Impersonation of other professionals or companies",
            "Using sessions to solicit outside business or employment",
          ].map((item) => (
            <li key={item} className="text-[14.5px] text-[#B0ADB8] leading-[1.8]">
              {item}
            </li>
          ))}
        </ul>
        <p className="body-text">
          Violations may result in immediate suspension and forfeiture of
          credits.
        </p>
      </>
    ),
  },
  {
    num: "5",
    title: "Intellectual Property",
    content: (
      <p className="body-text">
        Prept and its original content, features, and functionality are owned
        by Rupanjan and protected by applicable intellectual property laws.
        AI-generated feedback reports are provided for personal use only and
        may not be redistributed commercially.
      </p>
    ),
  },
  {
    num: "6",
    title: "Prohibited Uses",
    content: (
      <p className="body-text">
        You agree not to use Prept to: transmit malicious code, attempt to gain
        unauthorized access, scrape or harvest user data, circumvent security
        features, or use the platform for any unlawful purpose.
      </p>
    ),
  },
  {
    num: "7",
    title: "Termination",
    content: (
      <p className="body-text">
        We may suspend or terminate your account at our discretion if you
        violate these terms. You may cancel your account at any time through
        your dashboard settings.
      </p>
    ),
  },
  {
    num: "8",
    title: "Limitation of Liability",
    content: (
      <p className="body-text">
        Prept is provided &ldquo;as is.&rdquo; We are not liable for any indirect,
        incidental, or consequential damages arising from your use of the
        platform, including session outcomes or employment decisions made using
        our feedback reports.
      </p>
    ),
  },
];

const toc = sections.map((s) => s.title);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-190 mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-widest text-amber-400">
          <GoldTitle>LEGAL</GoldTitle>
        </span>
        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Terms of Service
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-11 border-b border-white/8">
          Last updated: January 14, 2025 · By using Prept, you agree to these
          terms.
        </p>

        {/* Table of Contents */}
        <div className="bg-white/3 border border-white/8 rounded-xl px-5 py-4 mb-10">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A8790] mb-3">
            Table of Contents
          </p>
          <ol className="list-decimal pl-4 space-y-1">
            {toc.map((item) => (
              <li key={item} className="text-[13.5px] text-amber-400">
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.num} className="mt-10">
            <h2 className="font-serif text-[22px] font-normal text-[#F0EDE8] mb-3">
              {section.num}. {section.title}
            </h2>
            {section.content}
          </section>
        ))}
      </div>
    </main>
  );
}