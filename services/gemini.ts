import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MantraParts } from "../types";

// Schema definition for the structured output
const mantraSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.STRING,
      description: "The identity part of the mantra. MUST be a 'Micro Habit' - an extremely simple, easy version of the habit. Starts with '我是一个...' (I am a person who...). Example: '我是一个每天都要看一页书的人' (I am a person who reads one page daily).",
    },
    benefit: {
      type: Type.STRING,
      description: "The benefit/reason part. Explains why this small step is good. Example: '它让我保持进步的惯性'",
    },
    emotion: {
      type: Type.STRING,
      description: "The emotional result. Starts with '所以...' (So...). Example: '所以我会很轻松快乐'",
    },
  },
  required: ["identity", "benefit", "emotion"],
};

export const generateMantra = async (habitGoal: string): Promise<MantraParts> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    User Goal: "${habitGoal}"

    You are a Habit Formation Expert specializing in "Atomic Habits", "Tiny Habits", and "Micro Habits".
    
    CORE PHILOSOPHY:
    To build a new habit, the starting action must be "laughably simple" - so easy that the user cannot say no, even on their worst, busiest, most tired day.
    Reduce the friction to near zero.

    YOUR TASK:
    Convert the user's goal into a "Micro-Habit Identity Mantra" in Chinese.

    CRITICAL RULES FOR 'IDENTITY':
    1.  Drastically reduce the scope of the action.
    2.  If the goal is "Read books" -> Identity is "reads 1 page" (看一页书).
    3.  If the goal is "Fitness/Exercise" -> Identity is "does 1 squat" (做一个深蹲) or "puts on gym shoes" (穿上运动鞋).
    4.  If the goal is "Write" -> Identity is "writes 1 sentence" (写一个句子).
    5.  If the goal is "Clean room" -> Identity is "picks up 1 item" (捡起一件东西).
    6.  The format MUST be: "我是一个每天都[Micro Action]的人".

    Structure of Output:
    1. Identity: The micro-habit identity.
    2. Benefit: Why this small consistency matters (e.g., "accumulates into big change", "keeps the momentum").
    3. Emotion: The feeling of success and lack of pressure.

    Tone: Empowering, absolute, positive, present tense.
    Language: Chinese.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mantraSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as MantraParts;
    return data;
  } catch (error) {
    console.error("Error generating mantra:", error);
    // Fallback in case of severe error
    return {
      identity: `我是一个每天至少为${habitGoal}付出一分钟的人`,
      benefit: "这让我轻松地开始改变",
      emotion: "所以我感到毫无压力且充实",
    };
  }
};