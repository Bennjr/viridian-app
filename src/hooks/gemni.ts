import { GoogleGenAI } from "@google/genai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default async function api_gemni(msg: string) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: msg,
    });
    
    // Handle the response properly
    return response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}