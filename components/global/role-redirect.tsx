"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_ONLY = ["/appointments"];
const INTERVIEWEE_ONLY = ["/dashboard"];

export default function RoleRedirect({ role }: any) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!role) return; 

    if (role === "UNASSIGNED" && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    if (role === "INTERVIEWER" && pathname.startsWith("/onboarding")) {
      router.replace("/dashboard");
      return;
    }

    if (role === "INTERVIEWEE" && pathname.startsWith("/onboarding")) {
      router.replace("/explore");
      return;
    }

    if (
      role === "INTERVIEWER" &&
      INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
    ) {
      router.replace("/dashboard");
      return;
    }

    if (
      role === "INTERVIEWEE" &&
      INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
    ) {
      router.replace("/appointments");
      return;
    }
  }, [role, pathname, router]);

  return null;
}