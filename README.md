This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ScriptCraft

Turn any source — a YouTube video, a news article, a PDF document, or a free-form chat — into a ready-to-deliver **speech** or **presentation script**, powered by AI.

## The Problem

Preparing a speech or presentation from existing material (a video, an article, a document) takes time: watching/reading, pulling out the key points, and restructuring everything into something you can actually stand up and say out loud. Most people either skip the structuring step (and ramble) or spend hours doing it manually.

## The Solution

ScriptCraft lets you pick a source, and generates a properly structured script for you:

- **Speech mode** — opening hook, main points in a conversational tone, closing statement, and an estimated speaking duration.
- **Presentation mode** — slide-by-slide breakdown with a headline and speaker notes per slide.

Sources supported:
- **YouTube link** — automatically fetches the video's transcript
- **News text** — paste any article text
- **PDF document** — upload a PDF and its text is extracted automatically
- **AI Chat** — freeform conversation to draft or revise a script exactly how you want it
- **Check Level** — analyze how easy or hard a topic is for the average student

Every folder acts as a project/topic, and all generated scripts are saved to your history so you can pick up where you left off.

## Tech Stack

- **Frontend & Backend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Auth & Database:** Supabase (Google OAuth, Postgres, Row Level Security)
- **AI:** Groq API (Llama-based model) for script generation, difficulty analysis, and chat
- **Other:** `youtube-transcript` for video transcripts, `pdf-parse` for PDF text extraction

## How It Works

1. Sign in with Google
2. Create a folder for your topic/project
3. Choose **Speech** or **Presentation Script**
4. Pick a source (YouTube, News, PDF, or Chat)
5. Get your generated script instantly, saved to your folder's history

## Getting Started (local development)

```bash
npm install
```

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

Then run:
```bash
npm run dev
```

## Live Demo

- **Live URL:** _(add after deploying to Vercel)_
- **GitHub:** https://github.com/carssav0404/scriptcraft

## Author

Built as a capstone project by Nareswari Carissa Aviva.