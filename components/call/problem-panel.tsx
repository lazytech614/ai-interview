"use client";

import { useEffect, useRef, useState } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { BookOpen, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isInterviewer: boolean;
}

export function ProblemPanel({ isInterviewer }: Props) {
  const call = useCall();
  const [problem, setProblem] = useState("");
  const [draft, setDraft] = useState("");
  // Keep a ref so the participant-join listener always sees the latest value
  const problemRef = useRef("");

  // Listen for problem events from the interviewer
  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.on("custom", (event: any) => {
      if (event.custom?.type === "problem-set") {
        setProblem(event.custom.problem);
        problemRef.current = event.custom.problem;
      }
    });
    return () => unsubscribe();
  }, [call]);

  // Interviewer only: re-broadcast the current problem whenever someone joins
  // so late joiners always receive the latest state
  useEffect(() => {
    if (!call || !isInterviewer) return;
    const unsubscribe = call.on("call.session_participant_joined", () => {
      if (problemRef.current) {
        call
          .sendCustomEvent({ type: "problem-set", problem: problemRef.current })
          .catch(console.error);
      }
    });
    return () => unsubscribe();
  }, [call, isInterviewer]);

  const handleSetProblem = () => {
    if (!draft.trim() || !call) return;
    const text = draft.trim();
    call
      .sendCustomEvent({ type: "problem-set", problem: text })
      .catch(console.error);
    setProblem(text);
    problemRef.current = text;
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f11] border border-white/10 overflow-hidden ">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
        <BookOpen size={14} className="text-amber-400" />
        <span className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
          Problem
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {problem ? (
          <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap font-light">
            {problem}
          </p>
        ) : (
          <p className="text-sm text-stone-600 italic">
            {isInterviewer
              ? "Set a problem below for the candidate."
              : "Waiting for the interviewer to set a problem…"}
          </p>
        )}
      </div>

      {isInterviewer && (
        <div className="border-t border-white/8 p-3 flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste or type the problem statement…"
            rows={4}
            className="w-full bg-white/3 border border-white/10 rounded-xl text-sm text-stone-300 placeholder:text-stone-600 px-3 py-2.5 resize-none focus:outline-none focus:border-amber-400/30 leading-relaxed"
          />
          <Button
            variant="gold"
            size="sm"
            onClick={handleSetProblem}
            disabled={!draft.trim()}
            className="gap-1.5 self-end"
          >
            <Send size={12} />
            Set Problem
          </Button>
        </div>
      )}
    </div>
  );
}