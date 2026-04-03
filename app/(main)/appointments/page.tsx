import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getIntervieweeAppointments } from "@/actions/appointments";
import PageHeader from "@/components/global/reusables";
import { AppointmentsClient } from "@/components/appointments/appointments-client";

export default async function MyAppointmentsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const appointments = await getIntervieweeAppointments();

  return (
    <main className="min-h-screen bg-black">
      <PageHeader
        label="My appointments"
        gray="Your interview"
        gold="sessions"
        description="All your upcoming and past mock interviews in one place."
      />

      <div className="max-w-6xl mx-auto px-8 lg:px-0 py-8">
        <AppointmentsClient appointments={appointments} />
      </div>
    </main>
  );
}