"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitSessionFeedback } from "@/actions/feedback";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RatingModal({
  open,
  onOpenChange,
  bookingId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, startTransition] = useTransition();

  const router = useRouter();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const res = await submitSessionFeedback({
          bookingId,
          rating,
          comment,
        });

        if(res?.success) {
            toast.success("Feedback submitted successfully");
            router.refresh();
        }
      } catch (err: any) {
        alert(err.message);
      } finally {
        onOpenChange(false);
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#141417] p-6 rounded-xl w-full max-w-md border border-white/10">
        <h2 className="text-lg text-white mb-4">Rate Session</h2>

        {/* ⭐ Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition ${
                rating >= star ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* 💬 Comment */}
        <textarea
          className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-sm text-white"
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={"gold"}
            onClick={handleSubmit}
            disabled={loading || rating === 0}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}