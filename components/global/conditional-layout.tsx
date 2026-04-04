"use client";
import { usePathname } from "next/navigation";

export default function ConditionalLayout({ 
  children,
  header,
  footer
}: { 
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCallPage = pathname?.startsWith("/call");

  return (
    <>
      {!isCallPage && header}
        <main className="min-h-screen">{children}</main>
      {!isCallPage && footer}
    </>
  );
}