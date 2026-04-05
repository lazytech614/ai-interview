"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Sparkles } from "lucide-react";
import { formatDate, formatDuration, formatTime } from "@/lib/helpers";
import { RATING_LABEL, RATING_STYLES, STATUS_STYLES } from "@/lib/data";
import { FeedbackModal } from "./feedback-modal";
import useFetch from "@/hooks/use-fetch";
import { cancelSlot } from "@/actions/booking";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../global/confirm-dialog";
import { RatingModal } from "./rating-modal";

export function AppointmentCard({ booking, mode, isPast = false }: any) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const { has } = useAuth();
  const router = useRouter();

  const {
    fn: cancelBookingFn,
    loading: cancelling,
  } = useFetch(cancelSlot);

  const {
    startTime,
    endTime,
    status,
    creditsCharged,
    streamCallId,
    recordingUrl,
    feedback,
    interviewerId
  } = booking;

  const person =
    mode === "interviewer" ? booking.interviewee : booking.interviewer;

  const creditsLabel =
    mode === "interviewer"
      ? `+${creditsCharged} credits earned`
      : `−${creditsCharged} credits`;

  const creditsStyle =
    mode === "interviewer"
      ? "border-green-500/20 bg-green-500/10 text-green-400"
      : "border-amber-400/20 bg-amber-400/5 text-amber-400";

  const isUpcoming = status === "SCHEDULED";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // 15 minutes before start
  const joinWindowStart = new Date(start.getTime() - 15 * 60 * 1000);

  const canJoinCall =
    streamCallId &&
    isUpcoming &&
    now >= joinWindowStart &&
    now <= end;

  // For slot cancellation
  const diffMs = start.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const canCancel = diffHours >= 2;

  return (
    <>
      <FeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        feedback={feedback}
        intervieweeName={
          mode === "interviewer" ? booking.interviewee?.name : undefined
        }
      />

      <RatingModal
        open={ratingOpen}
        onOpenChange={setRatingOpen}
        bookingId={booking.id}
      />

      <article className="group relative bg-[#0f0f11] border border-white/10 transition-all duration-300 hover:-translate-y-0.5 rounded-2xl bg-linear-to-t from-transparent via-transparent to-amber-300/10 p-6 flex flex-col gap-6 self-start">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <Avatar className="w-14 h-14 border border-white/10 rounded-2xl shrink-0">
              <AvatarImage
                src={person?.imageUrl}
                alt={person?.name}
                className="rounded-2xl"
              />
              <AvatarFallback className="rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-lg font-medium">
                {person?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-base font-medium text-stone-200 leading-tight truncate">
                {mode === "interviewer" ? 
                  person?.name ?? "—" : (
                    <Link href={`/interviewers/${interviewerId}`} className="underline hover:text-amber-400 transition-all duration-200">{person?.name ?? "—"}</Link>
                  )
                }
              </p>
              {person?.title && person?.company ? (
                <p className="text-xs text-stone-500 truncate">
                  {person.title}
                  <span className="text-stone-700 mx-1.5">·</span>
                  {person.company}
                </p>
              ) : (
                <p className="text-xs text-stone-600 truncate">
                  {person?.email}
                </p>
              )}
              {mode === "interviewee" && person?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {person.categories.slice(0, 3).map((cat: any) => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 rounded-md border border-amber-400/20 bg-amber-400/5 text-amber-400 leading-tight"
                    >
                      {cat.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant="outline" className={STATUS_STYLES[status as keyof typeof STATUS_STYLES]}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>
            <Badge variant="outline" className={creditsStyle}>
              {creditsLabel}
            </Badge>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Calendar size={12} />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Date
              </span>
            </div>
            <p className="text-sm text-stone-300">{formatDate(startTime)}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Clock size={12} />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Time
              </span>
            </div>
            <p className="text-sm text-stone-300">
              {formatTime(startTime)}
              <span className="text-stone-600 mx-1">–</span>
              {formatTime(endTime)}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Video size={12} />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Duration
              </span>
            </div>
            <p className="text-sm text-stone-300">
              {formatDuration(startTime, endTime)}
            </p>
          </div>
        </div>

        {feedback?.summary && (
          <div className="rounded-xl border border-white/8 bg-[#141417] px-4 py-3 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-stone-600 tracking-widest uppercase">
              AI Feedback
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2">
              {feedback.summary}
            </p>
          </div>
        )}

        {/* BUTTONS GROUP */}
        {(streamCallId || recordingUrl || feedback) && (
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 flex-wrap pt-1">
            {/* JOIN CALL BUTTON */}
            {!isPast && streamCallId && isUpcoming && (
              <Button
                variant="gold"
                size="sm"
                className="gap-2"
                disabled={!canJoinCall}
                asChild={canJoinCall}
              >
                {canJoinCall ? (
                  <Link href={`/call/${streamCallId}`} className="flex items-center gap-1">
                    <Video size={13} />
                    Join call
                  </Link>
                ) : (
                  <Button>
                    <Video size={13} />
                    Join in 15 min window
                  </Button>
                )}
              </Button>
            )}

            {/* DATA ANALYTICS BUTTON */}
            <div className="flex items-center gap-x-2">
              {recordingUrl && has?.({ plan: "pro" }) && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a
                    href={recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📹 Recording
                  </a>
                </Button>
              )}

              {feedback &&
                (has?.({ plan: "starter" }) || has?.({ plan: "pro" })) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-amber-400/20 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/40"
                      onClick={() => setFeedbackOpen(true)}
                    >
                      <Sparkles size={12} />
                      Full Feedback
                    </Button> 
              )}
            </div>

            <div>
              {feedback &&
              (has?.({ plan: "starter" }) || has?.({ plan: "pro" })) && (
                  <Badge
                    variant="outline"
                    className={`${RATING_STYLES[feedback?.overallRating as keyof typeof RATING_STYLES]}`}
                  >
                    ✦ {RATING_LABEL[feedback?.overallRating as keyof typeof RATING_LABEL]} performance
                  </Badge>
              )}
            </div>

            {/* CANCELATION BUTTON  */}
            {mode === "interviewee" &&
              status === "SCHEDULED" &&
              !isPast && (
                <div>
                  {/* Cancel Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpenCancelDialog(true)}
                    disabled={!canCancel || cancelling}
                  >
                    {!canCancel
                      ? "Cancellation closed"
                      : cancelling
                      ? "Cancelling..."
                      : "Cancel Session"}
                  </Button>

                  {/* Optional message */}
                  {!canCancel && (
                    <p className="text-xs text-red-400">
                      Cannot cancel within 2 hours of session
                    </p>
                  )}

                  {/* Confirm Dialog */}
                  <ConfirmDialog
                    open={openCancelDialog}
                    onOpenChange={setOpenCancelDialog}
                    title="Cancel this session?"
                    description={
                      <>
                        You may receive partial or full refund based on cancellation time. For
                        more details please refer to our{" "}
                        <Link href="/refund" className="text-amber-400 underline">
                          refund policy
                        </Link>
                      </>
                    }
                    confirmText="Yes, Cancel"
                    cancelText="Keep Session"
                    variant="destructive"
                    loading={cancelling}
                    onConfirm={async () => {
                      const res = await cancelBookingFn(booking.id);
                      if (res?.success) {
                        setOpenCancelDialog(false);
                        router.refresh();
                      }
                    }}
                  />
                </div>
            )}
          </div>
        )}

        {mode === "interviewee" &&
          status === "COMPLETED" &&
          !feedback?.sessionRating && (
            <Button
              variant="outline"
              onClick={() => setRatingOpen(true)}
            >
              ⭐ Rate Session
            </Button>
        )}

        {mode === "interviewee" && 
          status === "COMPLETED" && 
          feedback?.sessionRating && (
            <p className="text-muted-foreground text-xs opacity-50 text-center">Thanks! for your valuable feedback</p>
        )}
      </article>
    </>
  );
}