# 🤖 AI Interview

An intelligent, full-stack AI-powered interview platform that lets candidates practice and take real interviews with AI assistance — featuring live video, smart feedback, and seamless authentication.

🔗 **Live Demo:** [ai-interview-lilac-nine.vercel.app](https://ai-interview-lilac-nine.vercel.app)

---

## ✨ Features

- 🎙️ **AI-Powered Interviews** — Conduct mock or real interviews powered by Google Gemini AI
- 📹 **Live Video Calls** — Real-time video interview sessions via Stream Video SDK
- 🔐 **Authentication** — Secure sign-up/sign-in with Clerk (supports OAuth, email/password)
- 🛡️ **Rate Limiting & Bot Protection** — Powered by Arcjet for API security
- 📧 **Email Notifications** — Automated transactional emails via Resend
- 🗄️ **Database** — Persistent storage with Supabase via Prisma ORM
- 👑 **Admin Panel** — Password-protected admin dashboard for managing interviews and payouts
- ⚡ **Server Actions** — Next.js server actions for clean, type-safe data mutations

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Auth | [Clerk](https://clerk.com) |
| Database | Supabase + [Prisma ORM](https://prisma.io) |
| Video SDK | [Stream](https://getstream.io) |
| AI | [Google Gemini API](https://ai.google.dev) |
| Security | [Arcjet](https://arcjet.com) |
| Email | [Resend](https://resend.com) |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- A PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))

### 1. Clone the repository

```bash
git clone https://github.com/lazytech614/ai-interview.git
cd ai-interview
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and fill in the values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# PostgreSQL Database (via Prisma)
DATABASE_URL=""
DIRECT_URL=""

# Arcjet (Rate Limiting & Bot Protection)
ARCJET_KEY=""
ARCJET_ENV=""

# Stream Video SDK
NEXT_PUBLIC_STREAM_API_KEY=""
STREAM_API_SECRET=""

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=""

# App
NEXT_PUBLIC_APP_URL=""

# Resend (Email)
RESEND_API_KEY=""

# Admin
ADMIN_PAYOUT_PASSWORD=""
```

> See [Environment Variables](#-environment-variables) below for details on where to get each key.

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Where to Get |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Clerk secret key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `DATABASE_URL` | PostgreSQL connection string (pooled) | Your DB provider (Neon, Supabase, etc.) |
| `DIRECT_URL` | PostgreSQL direct connection string | Your DB provider |
| `ARCJET_KEY` | Arcjet API key | [Arcjet Dashboard](https://app.arcjet.com) |
| `ARCJET_ENV` | Arcjet environment (`development` or `production`) | — |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream Video public API key | [Stream Dashboard](https://getstream.io) |
| `STREAM_API_SECRET` | Stream Video secret key | [Stream Dashboard](https://getstream.io) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com) |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL (e.g. `http://localhost:3000`) | — |
| `RESEND_API_KEY` | Resend API key for sending emails | [Resend Dashboard](https://resend.com) |
| `ADMIN_PAYOUT_PASSWORD` | Password to access the admin payout panel | Set your own |

---

## 📁 Project Structure

```
ai-interview/
├── actions/          # Next.js server actions
├── app/              # App Router pages & layouts
├── components/       # Reusable UI components
├── emails/           # Resend email templates
├── hooks/            # Custom React hooks
├── lib/              # Utility functions & SDK clients
├── prisma/           # Prisma schema & migrations
├── public/           # Static assets
├── .env.local        # Environment variables (not committed)
└── package.json
```

---

## 🌐 Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repo on [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

Don't forget to run `npx prisma db push` against your production database after deploying.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a [GitHub Issue](https://github.com/lazytech614/ai-interview/issues).

---

<p align="center">Built with ❤️ by <a href="https://github.com/lazytech614">lazytech614</a></p>