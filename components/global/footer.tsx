import { checkUser } from "@/lib/check.user";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Browse Interviewers", href: "/explore" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "AI Feedback", href: "/#features" },
    { label: "Session Recording", href: "/#features" },
    { label: "Credit System", href: "/#pricing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers", badge: "3 open" },
    { label: "Press Kit", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export default async function Footer() {

  const {userId} = await auth()

  return (
    <footer className="bg-[#07070B] border-t border-white/20 font-sans pt-16">
      <div className="max-w-350 mx-auto px-4 sm:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 px-2 gap-12 pb-14 border-b border-white/8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center sm:block sm:text-left">
            <Link href="/">
                <Image 
                    src="/logo.png" 
                    alt="logo" 
                    width={100} 
                    height={100} 
                    className="h-11 w-auto"
                />
            </Link>
            <p className="text-[13.5px] leading-[1.75] text-[#8A8790] max-w-70 mb-6">
              Book 1:1 mock interviews with senior engineers from top companies.
              AI-powered feedback, real expertise.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5">
              <SocialButton href="https://twitter.com" label="Twitter/X">
                <svg viewBox="0 0 24 24" className="w-3.75 h-3.75 fill-[#8A8790] group-hover:fill-[#F0EDE8] transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialButton>
              <SocialButton href="https://linkedin.com" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="w-3.75 h-3.75 fill-[#8A8790] group-hover:fill-[#F0EDE8] transition-colors">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialButton>
              <SocialButton href="https://github.com/lazytech614" label="GitHub">
                <svg viewBox="0 0 24 24" className="w-3.75 h-3.75 fill-[#8A8790] group-hover:fill-[#F0EDE8] transition-colors">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </SocialButton>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="text-[11px] font-medium uppercase tracking-widest text-[#8A8790] mb-4">
              Product
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-[#C4C1CC] hover:text-[#F0EDE8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="text-[11px] font-medium uppercase tracking-widest text-[#8A8790] mb-4">
              Company
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-[#C4C1CC] hover:text-[#F0EDE8] transition-colors inline-flex items-center gap-2"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[10px] font-medium text-amber-400">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + CTA */}
          <div className="col-span-2 sm:col-span-1">
            <h5 className="text-[11px] font-medium uppercase tracking-widest text-[#8A8790] mb-4">
              Legal
            </h5>
            <ul className="space-y-2.5 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-[#C4C1CC] hover:text-[#F0EDE8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Beta Badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-[#C8F04A]/25 rounded-full px-2.5 py-1 text-[11px] text-amber-400 font-medium mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 text-[#0a0a0b] animate-pulse" />
              Beta — Now live
            </div>

            {/* CTA Box */}
            {!userId && (
              <div className="bg-[#C8F04A]/5 border border-[#C8F04A]/15 rounded-xl p-5">
                <p className="text-[13px] text-[#8A8790] leading-relaxed mb-3.5">
                  Get your first mock interview free. No card needed.
                </p>
                <Link
                  href="/onboarding"
                  className="inline-block bg-amber-400 text-[#0a0a0b] hover:bg-amber-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(251,191,36,0.35)] text-[12.5px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start free →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between py-5 flex-wrap gap-3">
          <p className="text-[12.5px] text-[#8A8790]">
            © {new Date().getFullYear()} Prept · Made with ♥ by{" "}
            <a
              href="https://github.com/lazytech614"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:opacity-80 transition-opacity"
            >
              Rupanjan
            </a>
          </p>

          <p className="text-[11px] text-white/20 italic font-serif tracking-wide">
            Crack it. Don&apos;t fake it.
          </p>

          <div className="flex gap-5">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
              { label: "Refund", href: "/refund" },
              // { label: "Status", href: "https://status.prept.io" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12.5px] text-[#8A8790] hover:text-[#F0EDE8] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group w-8.5 h-8.5 rounded-lg border border-white/8 hover:border-white/18 hover:bg-white/5 flex items-center justify-center transition-all"
    >
      {children}
    </a>
  );
}