import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/global/reusables";
import { getCurrentUser } from "@/actions/user";
import { getAvailability, getInterviewerAppointments, getInterviewerStats, getWithdrawalHistory } from "@/actions/dashboard";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { getInterviewerProfile } from "@/actions/booking";

export default async function InterviewerDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await getCurrentUser();
  if(!dbUser) return null

  const [availability, appointments, stats, withdrawalHistory, profile] =
    await Promise.all([
      getAvailability(),
      getInterviewerAppointments(),
      getInterviewerStats(),
      getWithdrawalHistory(),
      getInterviewerProfile(dbUser.id)
    ]);

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        label="Interviewer dashboard"
        gray="Welcome back,"
        gold={dbUser?.name?.split(" ")[0] ?? "Interviewer"}
        description={
          dbUser?.title && dbUser.company
            ? `${dbUser.title} · ${dbUser.company}`
            : undefined
        }
        right={
          <div className="mt-2 sm:mt-0">
            <p className="text-xs text-stone-600">Credit balance</p>
            <p className="font-serif text-3xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent sm:text-right">
              {stats?.creditBalance ?? 0}
            </p>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <DashboardTabs
          appointments={appointments}
          availability={availability}
          stats={stats}
          withdrawalHistory={withdrawalHistory}
          profile={profile}
        />
      </div>
    </main>
  );
}