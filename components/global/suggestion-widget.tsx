"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitSuggestion } from "@/actions/suggestions";

const TYPES = [
  { value: "BUG",     label: "🐛 Bug" },
  { value: "FEATURE", label: "✦ Feature idea" },
  { value: "OTHER",   label: "💬 Other" },
];

export function SuggestionWidget({ userId }: { userId?: string }) {
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [type, setType]       = useState<("BUG" | "OTHER" | "FEATURE")>("FEATURE");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("loading");
    await submitSuggestion({ type, message, page: pathname, userId });
    setStatus("done");
    setTimeout(() => {
      setOpen(false);
      setStatus("idle");
      setMessage("");
      setType("FEATURE");
    }, 2000);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-full
          bg-[#1a1a1b] border border-white/10 text-stone-400 text-xs font-medium
          hover:text-stone-200 hover:border-white/20 transition-all shadow-lg"
      >
        <MessageSquarePlus size={13} />
        Feedback
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Modal */}
      {open && (
        <div className="fixed bottom-16 right-5 z-50 w-[320px]">
          <div className="bg-[#111112] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div>
                <p className="text-sm font-medium text-stone-200">Share feedback</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Bugs, ideas, or anything on your mind
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-stone-600 hover:text-stone-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            {status === "done" ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <CheckCircle2 size={24} className="text-amber-400" />
                <p className="text-sm text-stone-300">Thanks, we got it!</p>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-3">

                {/* Type pills */}
                <div className="flex gap-2 flex-wrap">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        type === t.value
                          ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                          : "border-white/8 text-stone-500 hover:text-stone-300 hover:border-white/15"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "BUG"
                      ? "What happened? What did you expect?"
                      : type === "FEATURE"
                      ? "What would you like to see?"
                      : "What's on your mind?"
                  }
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5
                    text-xs text-stone-300 placeholder:text-stone-600
                    focus:outline-none focus:border-amber-400/30 resize-none transition-colors"
                />

                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "loading"}
                  className="w-full gap-2"
                >
                  {status === "loading" && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  {status === "loading" ? "Sending…" : "Send feedback"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}