import { redirect, notFound } from "next/navigation";
import { getInterviewerProfile } from "@/actions/booking";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GrayTitle, SectionLabel } from "@/components/global/reusables";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, EXPECT_ITEMS } from "@/lib/data";
import { StarsBackgroundDemo } from "@/components/global/demo-components-background-stars";
import { getCurrentUser } from "@/actions/user";
import SlotPicker from "@/components/interviewers/slot-picker";

export default async function InterviewerProfilePage({ params }: any) {
  const { id } = await params;

  const dbUser = await getCurrentUser();
  if (!dbUser) redirect("/");
  if (dbUser.role === "UNASSIGNED") redirect("/onboarding");

  const data = await getInterviewerProfile(id);

  if (!data) {
    throw new Error("Failed to load interviewer");
  }

  const { interviewer, reviews, ratingSummary, upcomingBookings } = data;

  if (!interviewer) notFound();

  return (
    <div className="min-h-screen">
      {/* ── Hero identity banner ── */}
      <section className="relative border-b border-white/8 overflow-hidden">
        <StarsBackgroundDemo />

        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-14 flex flex-col gap-8">
          <Link href="/explore">
            <Button variant="link" className="text-stone-500 cursor-pointer">
              <ArrowLeft size={13} />
              Back to explore
            </Button>
          </Link>

          <div className="flex items-start gap-8">
            <Avatar className="w-24 h-24 border-2 border-white/10 shrink-0 rounded-2xl">
              <AvatarImage
                src={interviewer.imageUrl as string}
                alt={interviewer.name as string}
                className="rounded-2xl"
              />
              <AvatarFallback className="rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-3xl font-medium">
                {interviewer.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3 min-w-0 pt-1">
              <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-tight">
                <GrayTitle>{interviewer.name}</GrayTitle>
              </h1>

              {interviewer.title && interviewer.company && (
                <p className="text-base text-stone-400 font-light">
                  {interviewer.title}
                  <span className="text-stone-700 mx-2">·</span>
                  {interviewer.company}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap mt-1">
                {interviewer.yearsExp && (
                  <Badge
                    variant="outline"
                    className="border-white/10 text-stone-400 text-xs px-3 py-1"
                  >
                    {interviewer.yearsExp}+ yrs experience
                  </Badge>
                )}
                {interviewer.availabilities?.[0] && (
                  <Badge
                    variant="outline"
                    className="border-green-500/20 bg-green-500/8 text-green-400 text-xs px-3 py-1"
                  >
                    🟢 Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* ── LEFT ── */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:-order-1 relative">
          {interviewer.bio && (
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
              <SectionLabel>About</SectionLabel>
              <p className="text-base text-stone-300 font-light leading-relaxed">
                {interviewer.bio}
              </p>
              {ratingSummary?._count?.sessionRating > 0 && (
                <div className="flex items-center text-sm sm:text-base gap-2 mt-2 absolute right-8 top-4">
                  <span className="text-amber-400 text-lg">⭐</span>
                  <span className="text-stone-200 font-medium">
                    {ratingSummary._avg.sessionRating?.toFixed(1)}
                  </span>
                  <span className="text-stone-500 text-xs sm:text-sm">
                    ({ratingSummary._count.sessionRating} reviews)
                  </span>
                </div>
              )}
            </div>
          )}

          {interviewer.categories?.length > 0 && (
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
              <div>
                <SectionLabel>Specialties</SectionLabel>
                <p className="text-sm text-stone-500 font-light mt-1">
                  Interview categories this expert covers.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {interviewer.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-sm px-4 py-2 rounded-xl border border-amber-400/20 bg-amber-400/5 text-amber-400"
                  >
                    {CATEGORY_LABEL[cat] ?? cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {reviews?.length > 0 && (
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
              <div>
                <SectionLabel>Recent Reviews</SectionLabel>
                <p className="text-sm text-stone-500 font-light mt-1">
                  What candidates are saying about this interviewer.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-white/5 pb-4 last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-white/10">
                        <AvatarImage
                          src={review.interviewee?.imageUrl}
                        />
                        <AvatarFallback>
                          {review.interviewee?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="text-sm text-stone-300">
                          {review.interviewee?.name}
                        </p>
                        <div className="text-xs text-stone-500">
                          {new Date(
                            review.feedback?.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-amber-400 text-sm">
                      {"★".repeat(review.feedback?.sessionRating)}
                      {"☆".repeat(5 - review.feedback?.sessionRating)}
                    </div>

                    {review.feedback?.sessionComment && (
                      <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                        {review.feedback.sessionComment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviews?.length == 0 && (
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-stone-500 text-sm">
                No reviews yet. Be the first to book and review!
              </p>
            </div>
          )}

          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <SectionLabel>What to expect</SectionLabel>
              <p className="text-sm text-stone-500 font-light mt-1">
                Every session on Prept includes the following.
              </p>
            </div>
            <ul className="flex flex-col gap-5">
              {EXPECT_ITEMS.map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="mt-0.5 w-10 h-10 shrink-0 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-lg">
                    {icon}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-stone-200">
                      {title}
                    </p>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT — sticky slot picker ── */}
        <div className="lg:col-span-2 lg:sticky top-24">
          <SlotPicker
            interviewer={{
              ...interviewer,
              bookingsAsInterviewer: upcomingBookings  
            }}
            userCredits={dbUser.credits}
          />
        </div>
      </div>
    </div>
  );
}