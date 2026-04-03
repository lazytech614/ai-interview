"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-red-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center text-center gap-8 max-w-md w-full">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500/60 animate-pulse" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-stone-100 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed font-light">
            {error.message?.length < 120
              ? error.message
              : "An unexpected error occurred. Our team has been notified."}
          </p>
          {error.digest && (
            <p className="text-[11px] text-stone-700 font-mono mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button
            variant="gold"
            size="sm"
            onClick={reset}
            className="gap-2"
          >
            <RotateCcw size={13} />
            Try again
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20 bg-white/3"
          >
            <Link href="/">
              <Home size={13} />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}