"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORY_PROMPTS = {
  FRONTEND: "React, JavaScript, CSS, performance, accessibility, browser APIs",
  BACKEND:
    "Node.js, REST APIs, databases, authentication, caching, scalability",
  FULLSTACK:
    "full-stack architecture, API design, state management, deployment",
  DSA: "data structures, algorithms, time complexity, problem solving",
  SYSTEM_DESIGN:
    "distributed systems, scalability, databases, microservices, caching",
  BEHAVIORAL:
    "leadership, teamwork, conflict resolution, career growth, STAR method",
  DEVOPS: "CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring",
  MOBILE:
    "React Native, iOS/Android, performance, offline support, app lifecycle",
};

export const generateInterviewQuestions = async ({category}: any) => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")

        if(!category || !CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]) throw new Error("Invalid category")

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_LEY!)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite"
        })

        const prompt = `You are an expert technical interviewer. Generate 6 interview questions for a ${category} role covering: ${CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]}.

        For each question, provide a concise but complete answer (2-4 sentences) that an interviewer can use to evaluate responses.

        Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation. Example format:
        [{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const clean = text.replace(/^```json|^```|```$/gm, "").trim();
        const questions = JSON.parse(clean);

        return { questions };
    }catch(err) {
        console.log(err)
        throw new Error("Something went wrong")
    }
}