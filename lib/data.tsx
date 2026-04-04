import { GoldTitle, GrayTitle } from "@/components/global/reusables";
import { InterviewCategory } from "./generated/prisma/enums";

export const LOGOS = [
  { src: "/amazon.svg", alt: "Amazon" },
  { src: "/atlassian.svg", alt: "Atlassian" },
  { src: "/google.webp", alt: "Google" },
  { src: "/meta.svg", alt: "Meta" },
  { src: "/microsoft.webp", alt: "Microsoft" },
  { src: "/netflix.png", alt: "Netflix" },
  { src: "/uber.svg", alt: "Uber" },
];

export const AVATARS = [
  { src: "https://randomuser.me/api/portraits/men/32.jpg" },
  { src: "https://randomuser.me/api/portraits/women/44.jpg" },
  { src: "https://randomuser.me/api/portraits/men/76.jpg" },
  { src: "https://randomuser.me/api/portraits/women/68.jpg" },
  { src: "https://randomuser.me/api/portraits/men/12.jpg" },
];

export const AI_TAGS = [
  { label: "Frontend Engineer", active: true },
  { label: "L5 Level", active: true },
  { label: "React Performance", active: false },
  { label: "System Design", active: false },
  { label: "Behavioural", active: true },
  { label: "DSA", active: false },
];

export const SLOTS = [
  {
    label: "Mon 10:00 AM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  { label: "Mon 2:00 PM", cls: "border-white/7 text-stone-500" },
  {
    label: "Tue 11:00 AM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
  {
    label: "Wed 9:00 AM ✓",
    cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  },
  {
    label: "Thu 3:00 PM",
    cls: "border-amber-400/30 text-amber-200 bg-amber-400/5",
  },
];

export const PLANS = [
  {
    name: "Free",
    price: "0",
    credits: "1 credit / month",
    featured: false,
    planId: null,
    slug: "free",
    features: [
      "45-min session duration",
      "HD video call via Stream",
      "Persistent chat thread",
    ],
  },
  {
    name: "Starter",
    price: "29",
    credits: "6 credits / month",
    featured: true,
    planId: "cplan_3BikJvXfP2glCTRt5lUc2Xobgdn",
    slug: "starter",
    features: [
      "45-min or 1-hour session duration",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
    ],
  },
  {
    name: "Pro",
    price: "99",
    credits: "24 credits / month",
    featured: false,
    planId: "cplan_3BikpFV5h4XIjzkuRwXWxxoPMZS",
    slug: "pro",
    features: [
      "45-min, 1-hour, or 1.5-hour session duration",
      "AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
      "Recording & playback link",
    ],
  },
];

export const ROLES = [
  {
    label: "Interviewee",
    title: <GrayTitle>Land the role you deserve</GrayTitle>,
    desc: "Stop guessing what interviewers want. Practice with people who've been on the other side and know exactly how top companies evaluate candidates.",
    perks: [
      "Browse by category: Frontend, Backend, System Design, PM",
      "Book sessions using monthly credits from your plan",
      "Receive AI-powered feedback after every session",
      "Access session recordings to review your performance",
      "Chat with your interviewer before and after the call",
    ],
  },
  {
    label: "Interviewer",
    title: <GoldTitle>Earn doing what you&apos;re great at</GoldTitle>,
    desc: "Share your knowledge, help engineers grow, and earn meaningful income on your own schedule. Set your slots, and we handle the rest.",
    perks: [
      "Set your own availability and session rates",
      "AI question generator tailored to each candidate's role",
      "Earn credits per session — withdraw any time",
      "Dashboard with credit balance and withdrawal requests",
    ],
  },
];

export const CATEGORIES: {
  value: InterviewCategory | null;
  label: string;
}[] = [
  { value: null, label: "All" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "DSA", label: "DSA" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "MOBILE", label: "Mobile" },
];

export type CategoryType = InterviewCategory | null;

export const CATEGORY_LABEL = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  DSA: "DSA",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  DEVOPS: "DevOps",
  MOBILE: "Mobile",
};

// onboarding
export const YEARS_OPTIONS = [
  { value: 1, label: "1 yr" },
  { value: 2, label: "2 yrs" },
  { value: 3, label: "3 yrs" },
  { value: 5, label: "5 yrs" },
  { value: 7, label: "7 yrs" },
  { value: 10, label: "10+ yrs" },
];

export const ONBOARDING_ROLES = [
  {
    value: "INTERVIEWEE",
    icon: "🎯",
    title: "I want to practice",
    desc: "Browse expert interviewers, book sessions, and get AI-powered feedback to land your dream role.",
  },
  {
    value: "INTERVIEWER",
    icon: "🧑‍💼",
    title: "I want to interview",
    desc: "Share your expertise, earn credits, and help engineers level up.",
  },
];

// Appointment Card Data
export const STATUS_STYLES = {
  SCHEDULED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED: "border-green-500/20 bg-green-500/10 text-green-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-400",
};

export const RATING_STYLES = {
  POOR: "ml-auto border-red-500/20 bg-red-500/10 text-red-400",
  AVERAGE: "ml-auto border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  GOOD: "ml-auto border-blue-500/20 bg-blue-500/10 text-blue-400",
  EXCELLENT: "ml-auto border-green-500/20 bg-green-500/10 text-green-400",
};

export const RATING_LABEL = {
  POOR: "Poor",
  AVERAGE: "Average",
  GOOD: "Good",
  EXCELLENT: "Excellent",
};

// Feedback Modal
export const RATING_CONFIG = {
  POOR: {
    label: "Poor",
    emoji: "📉",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    bg: "from-red-500/5",
  },
  AVERAGE: {
    label: "Average",
    emoji: "📊",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    bg: "from-yellow-500/5",
  },
  GOOD: {
    label: "Good",
    emoji: "👍",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    bg: "from-blue-500/5",
  },
  EXCELLENT: {
    label: "Excellent",
    emoji: "🏆",
    className: "border-green-500/20 bg-green-500/10 text-green-400",
    bg: "from-green-500/5",
  },
};

// Booking Page
export const EXPECT_ITEMS = [
  ["🎥", "HD Video Call", "45-minute session with screen sharing built in."],
  [
    "🤖",
    "AI Question Generator",
    "Role-specific questions generated live during the interview.",
  ],
  [
    "💬",
    "Persistent Chat",
    "Message before and after — share notes, resources, follow-ups.",
  ],
  [
    "📊",
    "AI Feedback Report",
    "Post-interview analysis covering technical depth, communication, and more.",
  ],
  [
    "📹",
    "Recording & Playback",
    "A shareable recording link is generated automatically after the call.",
  ],
];

export const BLOG_POST = [
  {
    slug: "system-design-mastery",
    title: "Mastering System Design Interviews at FAANG",
    author: "Aman Verma",
    date: "March 10, 2026",
    readTime: "8 min read",
    image: "/placeholder_image.webp",
    excerpt: "A complete roadmap to crack system design interviews with confidence.",
    content: `System design interviews are one of the most challenging rounds in top tech companies like FAANG.

Unlike coding interviews, system design evaluates how you think, structure problems, and design scalable systems.

The first step is always requirement clarification. Ask questions about scale, users, and constraints.

Next, define a high-level architecture. Use components like load balancers, APIs, databases, and caching layers.

Always justify your choices. For example, why are you using Redis? Why not SQL?

Discuss scaling strategies such as horizontal scaling, database sharding, and replication.

A strong candidate also considers edge cases like failures, downtime, and data consistency.

Real-world example: Designing Instagram feed involves feed generation, ranking, and caching strategies.

Communication is key. Think aloud so the interviewer understands your approach.

Avoid overengineering. Start simple and evolve the design gradually.

Practice regularly using platforms and mock interviews to build confidence.

With consistent effort, system design becomes intuitive and even enjoyable.`
  },

  {
    slug: "coding-mistakes",
    title: "Top 5 Coding Mistakes That Kill Your Interview",
    author: "Priya Sharma",
    date: "February 25, 2026",
    readTime: "5 min read",
    image: "/placeholder_image.webp",
    excerpt: "Avoid common pitfalls developers make during coding interviews.",
    content: `Many candidates fail coding interviews not because they lack knowledge, but due to avoidable mistakes.

One major mistake is not understanding the problem properly before coding.

Jumping into coding without planning often leads to messy and incorrect solutions.

Another common issue is ignoring edge cases such as empty inputs or large constraints.

Poor variable naming can make your code difficult to understand and explain.

Candidates also forget to optimize their solutions, sticking with brute-force approaches.

Time complexity discussion is crucial and often overlooked.

Not testing your code with sample inputs is another critical error.

Communication plays a huge role — explain your logic clearly.

Break down the problem into smaller steps before implementing.

Practice writing clean and readable code under time pressure.

Fixing these small mistakes can significantly improve your performance.`
  },

  {
    slug: "ai-interviews",
    title: "AI is Changing Interviews: Are You Ready?",
    author: "Rohit Singh",
    date: "February 10, 2026",
    readTime: "6 min read",
    image: "/placeholder_image.webp",
    excerpt: "AI tools are reshaping hiring. Learn how to adapt.",
    content: `Artificial Intelligence is rapidly transforming the hiring process across industries.

Many companies now allow or even expect candidates to use AI tools during interviews.

This shifts the focus from memorization to problem-solving and understanding.

You must build strong fundamentals in data structures and system design.

AI can assist, but it cannot replace core knowledge and reasoning ability.

Companies are also using AI-based assessments to evaluate candidates.

Understanding how to collaborate with AI tools is becoming a valuable skill.

Ethical usage is important — misuse can harm your credibility.

Practice solving problems both with and without AI assistance.

Focus on explaining your thought process rather than just giving answers.

Stay updated with trends in AI-driven hiring practices.

Adapting early will give you a strong competitive advantage.`
  },

  {
    slug: "dsa-roadmap",
    title: "Complete DSA Roadmap for Beginners",
    author: "Sneha Gupta",
    date: "Jan 20, 2026",
    readTime: "10 min read",
    image: "/placeholder_image.webp",
    excerpt: "Step-by-step DSA roadmap for cracking coding interviews.",
    content: `Starting Data Structures and Algorithms can feel overwhelming for beginners.

The key is to follow a structured roadmap instead of random practice.

Begin with arrays and strings to understand basic problem-solving patterns.

Move on to linked lists, stacks, and queues to build foundational knowledge.

Trees and graphs are crucial topics that frequently appear in interviews.

Practice recursion and backtracking for complex problem-solving.

Dynamic programming is challenging but extremely important.

Consistency matters more than speed. Solve problems daily.

Use platforms like LeetCode, Codeforces, and GeeksforGeeks.

Revise concepts regularly to retain knowledge.

Participate in contests to improve time management skills.

With patience and persistence, DSA becomes much easier over time.`
  },

  {
    slug: "resume-tips",
    title: "Resume Tips That Get You Shortlisted",
    author: "Ankit Jain",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    image: "/placeholder_image.webp",
    excerpt: "Make your resume stand out to recruiters instantly.",
    content: `Your resume is the first impression you make on recruiters.

A well-structured resume can significantly increase your chances of getting shortlisted.

Keep your resume concise — ideally one page for freshers.

Use strong action verbs like "Built", "Designed", and "Optimized".

Quantify your impact wherever possible using numbers.

Highlight relevant projects that demonstrate your skills.

Avoid unnecessary details and focus on what matters.

Use clean formatting with proper spacing and alignment.

Tailor your resume for each job role you apply for.

Proofread carefully to avoid grammatical errors.

Use keywords from the job description to pass ATS filters.

A strong resume opens doors to great opportunities.`
  },

  {
    slug: "backend-scaling",
    title: "Scaling Backend Systems Like a Pro",
    author: "Ravi Kumar",
    date: "Dec 28, 2025",
    readTime: "7 min read",
    image: "/placeholder_image.webp",
    excerpt: "Learn how to scale systems to millions of users.",
    content: `Scaling backend systems is essential for handling large user bases.

Start by identifying bottlenecks in your current architecture.

Use load balancers to distribute traffic efficiently.

Implement caching using tools like Redis to reduce database load.

Database scaling can be achieved using sharding and replication.

Horizontal scaling is preferred over vertical scaling in most cases.

Use CDNs to serve static content faster to users globally.

Monitor system performance using tools like Prometheus.

Failover strategies are important to ensure high availability.

Design systems to handle sudden traffic spikes gracefully.

Security and data consistency should not be compromised.

A well-scaled backend ensures a smooth user experience.`
  },

  {
    slug: "frontend-performance",
    title: "Frontend Performance Optimization Guide",
    author: "Neha Kapoor",
    date: "Dec 15, 2025",
    readTime: "6 min read",
    image: "/placeholder_image.webp",
    excerpt: "Speed up your frontend apps dramatically.",
    content: `Frontend performance plays a critical role in user experience.

Slow websites lead to higher bounce rates and poor engagement.

Optimize images by compressing and using modern formats like WebP.

Implement lazy loading for images and components.

Reduce JavaScript bundle size using code splitting.

Use caching strategies to improve load times.

Minimize re-renders in React applications.

Use tools like Lighthouse to analyze performance.

Avoid unnecessary dependencies in your project.

Use CDN for faster content delivery.

Measure performance regularly and iterate improvements.

A fast frontend creates a better user experience.`
  },

  {
    slug: "open-source",
    title: "Why You Should Contribute to Open Source",
    author: "Karan Mehta",
    date: "Dec 1, 2025",
    readTime: "5 min read",
    image: "/placeholder_image.webp",
    excerpt: "Boost your career with open-source contributions.",
    content: `Open source contribution is one of the best ways to grow as a developer.

It helps you understand real-world codebases and collaboration.

Start by exploring beginner-friendly repositories.

Fix small bugs or improve documentation initially.

Gradually move to more complex contributions.

You learn version control systems like Git effectively.

Collaboration with global developers improves communication skills.

Open source contributions strengthen your resume.

It also helps in networking with experienced developers.

Consistency is key — contribute regularly.

Don’t be afraid to ask questions and seek guidance.

Open source can significantly boost your career growth.`
  },

  {
    slug: "mock-interviews",
    title: "How Mock Interviews Can 10x Your Prep",
    author: "Isha Patel",
    date: "Nov 20, 2025",
    readTime: "6 min read",
    image: "/placeholder_image.webp",
    excerpt: "Simulate real interviews and improve faster.",
    content: `Mock interviews are one of the most effective ways to prepare for real interviews.

They simulate actual interview pressure and environment.

You get valuable feedback on your performance.

Mock interviews help identify your weak areas.

They improve your communication and confidence.

Practice with peers or use online platforms.

Focus on explaining your thought process clearly.

Learn to handle unexpected questions.

Time management improves significantly.

Review your performance after each mock session.

Consistency in mock interviews leads to better results.

They are a game-changer for serious aspirants.`
  },

  {
    slug: "productivity",
    title: "Developer Productivity Hacks",
    author: "Arjun Das",
    date: "Nov 5, 2025",
    readTime: "4 min read",
    image: "/placeholder_image.webp",
    excerpt: "Work smarter, not harder.",
    content: `Productivity is crucial for developers working on multiple tasks.

Start by prioritizing your tasks effectively.

Use tools like Notion or Trello to stay organized.

Learn keyboard shortcuts to save time.

Automate repetitive tasks wherever possible.

Avoid multitasking — focus on one task at a time.

Take regular breaks to maintain efficiency.

Use version control effectively.

Keep your workspace clean and distraction-free.

Set realistic goals and deadlines.

Track your progress and improve continuously.

Smart work always beats hard work in the long run.`
  }
];

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp: "17.0.1",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  cpp: "#include <iostream>\n\nint main() {\n\tstd::cout << \"Hello World in C++\" << std::endl;\n\treturn 0;\n}\n",
};