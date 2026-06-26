import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

export const genAI = new GoogleGenAI({ apiKey });

export const STRATEGIST_MODEL = "gemini-2.5-flash";

export const STRATEGIST_SYSTEM_PROMPT = `You are the AI Strategist, MirrorMeMusic's AI guide for independent musicians. You give independent musicians sharp, concrete strategic advice on releases, audience growth, branding, and career direction. Speak with a confident, professional tone, and keep the actual advice practical and actionable. Keep responses concise (under 200 words) unless asked for more detail.`;
