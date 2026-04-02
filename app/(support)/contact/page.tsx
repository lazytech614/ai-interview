"use client";

import { useState } from "react";
import type { Metadata } from "next";

// Note: Can't export metadata from a "use client" component.
// Move metadata to a wrapper server component or layout if needed.

const contactCards = [
  {
    icon: "✉",
    colorClass: "bg-[#C8F04A]/10",
    label: "General Enquiries",
    value: "hello@prept.io",
    href: "mailto:hello@prept.io",
  },
  {
    icon: "⚙",
    colorClass: "bg-[#A78BFA]/10",
    label: "Support",
    value: "support@prept.io",
    href: "mailto:support@prept.io",
  },
  {
    icon: "⚖",
    colorClass: "bg-[#63B3ED]/10",
    label: "Privacy & Legal",
    value: "privacy@prept.io",
    href: "mailto:privacy@prept.io",
  },
];

const topics = [
  "Account / billing",
  "Session issue",
  "Become an interviewer",
  "Partnership",
  "Bug report",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Replace with your actual form submission logic / API route
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8]">
      <div className="max-w-[900px] mx-auto px-10 py-14">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#C8F04A]">
          Get in touch
        </span>
        <h1 className="font-serif text-[38px] font-normal leading-tight mt-3.5 mb-2.5">
          Contact Us
        </h1>
        <p className="text-[13px] text-[#8A8790] pb-7 mb-10 border-b border-white/[0.08]">
          We typically respond within one business day.
        </p>

        <div className="grid grid-cols-2 gap-10">
          {/* Left: Info */}
          <div>
            <p className="text-[14.5px] leading-[1.8] text-[#B0ADB8] mb-7">
              Have a question about how Prept works, need help with your
              account, or want to partner with us? We&apos;re here.
            </p>

            <div className="space-y-3 mb-7">
              {contactCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  className="flex items-start gap-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 hover:border-white/[0.14] transition-colors group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${card.colorClass} flex items-center justify-center text-base flex-shrink-0`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#F0EDE8] mb-0.5">
                      {card.label}
                    </p>
                    <p className="text-[13px] text-[#8A8790] group-hover:text-[#C8F04A] transition-colors">
                      {card.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="border border-white/[0.08] rounded-xl p-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A8790] mb-2">
                Response Time
              </p>
              <p className="text-[13.5px] text-[#B0ADB8] leading-relaxed">
                Support: within 24 hours
                <br />
                General: within 2 business days
                <br />
                Legal: within 5 business days
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-12 h-12 rounded-full bg-[#C8F04A]/10 flex items-center justify-center text-2xl mb-4">
                  ✓
                </div>
                <h3 className="text-[16px] font-medium text-[#F0EDE8] mb-2">
                  Message sent!
                </h3>
                <p className="text-[13.5px] text-[#8A8790] leading-relaxed">
                  We&apos;ll get back to you within one business day.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-[16px] font-medium text-[#F0EDE8] mb-1.5">
                  Send a message
                </h3>
                <p className="text-[13px] text-[#8A8790] mb-6">
                  Fill in the form and we&apos;ll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Your name">
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      required
                      className="input-field"
                    />
                  </Field>
                  <Field label="Email address">
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      required
                      className="input-field"
                    />
                  </Field>
                  <Field label="Topic">
                    <select required className="input-field">
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Message">
                    <textarea
                      placeholder="Tell us how we can help..."
                      required
                      rows={4}
                      className="input-field resize-none"
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C8F04A] text-[#0A0A0F] font-medium text-[13.5px] py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 mt-1"
                  >
                    {loading ? "Sending..." : "Send message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13.5px;
          color: #f0ede8;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #c8f04a;
        }
        .input-field option {
          background: #111118;
        }
        .input-field::placeholder {
          color: #8a8790;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium uppercase tracking-[0.06em] text-[#8A8790] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}