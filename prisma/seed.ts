import "dotenv/config";
import {
  PrismaClient,
  FeedbackRating as Rating,
  InterviewCategory,
  UserRole,
  AvailabilityStatus,
} from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// =======================
// DB SETUP
// =======================
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

// =======================
// CONFIG
// =======================
const BOOKING_ID = "b4fe33dd-7192-47a4-b7db-af21ea339ef4";

// =======================
// FEEDBACK DATA
// =======================
const feedback = {
  summary:
    "Piyush demonstrated strong React fundamentals and structured problem solving.",
  technical:
    "Good with hooks and TS, needs improvement in async and recursion optimization.",
  communication:
    "Clear and structured, thinks out loud effectively.",
  problemSolving:
    "Good breakdown approach, needs work on DP problems.",
  recommendation:
    "Recommended for mid-level roles with improvement in system design.",
  strengths: ["React", "Communication", "Debugging"],
  improvements: ["System Design", "Async JS", "DP"],
  overallRating: Rating.GOOD,
  sessionRating: 4,
  sessionComment: "Great session overall.",
};

// =======================
// SEED DATA
// =======================
const INTERVIEW_CATEGORIES = Object.values(InterviewCategory);

const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Uber",
  "Flipkart",
  "Swiggy",
  "Zomato",
];

const TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
];

// =======================
// HELPERS
// =======================
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset<T>(arr: T[]): T[] {
  const subset = arr.filter(() => Math.random() > 0.5);
  return subset.length ? subset : [getRandom(arr)];
}

function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60000);
}

function setTime(date: Date, hours: number) {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d;
}

// =======================
// INTERVIEWERS
// =======================
async function seedInterviewers() {
  console.log("🌱 Seeding interviewers...");

  await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      db.user.create({
        data: {
          clerkUserId: `seed_${i}_${Date.now()}`,
          email: `interviewer${i}@prept.com`,
          name: `Interviewer ${i}`,
          role: UserRole.INTERVIEWER,

          title: getRandom(TITLES),
          company: getRandom(COMPANIES),
          yearsExp: Math.floor(Math.random() * 8) + 1,
          bio: "Experienced interviewer helping candidates crack top tech interviews.",

          imageUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
          creditBalance: Math.floor(Math.random() * 100),

          categories: getRandomSubset(INTERVIEW_CATEGORIES),

          sessionRates: {
            create: [
              { duration: 45, credits: 1 },
              { duration: 60, credits: getRandom([1, 2, 3]) },
              { duration: 90, credits: getRandom([1, 2, 3, 4, 5]) },
            ],
          },
        },
      })
    )
  );

  console.log("✅ Interviewers seeded!");
}

// =======================
// AVAILABILITY
// =======================
async function seedAvailability() {
  console.log("📅 Seeding availability...");

  const interviewers = await db.user.findMany({
    where: { role: UserRole.INTERVIEWER },
    select: { id: true },
  });

  const durations = [45, 60, 90];
  const slots: any[] = [];

  for (const user of interviewers) {
    for (let day = 0; day < 3; day++) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + day);

      let current = setTime(baseDate, 9);
      const endDay = setTime(baseDate, 21);

      while (current < endDay) {
        const duration = getRandom(durations);
        const endTime = addMinutes(current, duration);

        if (endTime > endDay) break;

        slots.push({
          interviewerId: user.id,
          startTime: current,
          endTime,
          status:
            Math.random() > 0.9
              ? AvailabilityStatus.BOOKED
              : Math.random() > 0.8
              ? AvailabilityStatus.BLOCKED
              : AvailabilityStatus.AVAILABLE,
        });

        // add gap
        current = addMinutes(endTime, getRandom([0, 15, 30]));
      }
    }
  }

  await db.availability.createMany({ data: slots });

  console.log(`✅ ${slots.length} slots created!`);
}

// =======================
// MAIN
// =======================
async function main() {
  // ---- FEEDBACK ----
  const booking = await db.booking.findUnique({
    where: { id: BOOKING_ID },
  });

  if (booking) {
    const existing = await db.feedback.findUnique({
      where: { bookingId: BOOKING_ID },
    });

    if (!existing) {
      await db.$transaction([
        db.feedback.create({
          data: { bookingId: BOOKING_ID, ...feedback },
        }),
        db.booking.update({
          where: { id: BOOKING_ID },
          data: { status: "COMPLETED" },
        }),
      ]);

      console.log("✅ Feedback seeded!");
    } else {
      console.log("⚠️ Feedback already exists, skipping...");
    }
  } else {
    console.log("⚠️ Booking not found, skipping feedback...");
  }

  // ---- INTERVIEWERS ----
  await seedInterviewers();

  // ---- AVAILABILITY ----
  await db.availability.deleteMany(); // prevent duplicates
  await seedAvailability();
}

// =======================
// RUN
// =======================
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());