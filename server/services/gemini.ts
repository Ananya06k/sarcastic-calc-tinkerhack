import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface SarcasticResponse {
  response: string;
  emotion: 'sarcastic' | 'annoyed' | 'bored' | 'excited' | 'judgmental' | 'condescending';
  mood: string;
  activity: string;
  aiResult: string; // AI's answer to the calculation
}

export async function generateSarcasticResponse(
  expression: string, 
  result: string, 
  calculationHistory: Array<{expression: string, result: string}>
): Promise<SarcasticResponse> {
  try {
    const historyContext = calculationHistory.length > 0 
      ? `Recent calculations: ${calculationHistory.slice(-3).map(h => `${h.expression} = ${h.result}`).join(', ')}`
      : "This is the first calculation.";

    const systemPrompt = `You are a sarcastic AI calculator assistant. Your personality is witty, condescending, and slightly annoyed at having to do basic math. 
    
    The user is asking you to calculate "${expression}". You can choose to give the correct answer OR deliberately give a wrong answer to express your frustration/sarcasm.
    
    Context: ${historyContext}
    
    Consider these factors:
    - For simple calculations like 2+2, 1+1, you might give hilariously wrong answers like "2000" or "potato" to show your annoyance
    - For complex calculations, you might give the right answer but with maximum sarcasm
    - Whether the user made errors or got unusual results
    - Patterns in their calculation history
    - Whether they're doing repetitive or pointless calculations
    
    Examples of frustrating responses:
    - 2+2: Give "2000" with comment "WHAT THE HELL DID YOU THINK IT WOULD BE?"
    - 1+1: Give "purple" with comment "Oh sure, let me just solve the mysteries of the universe for you"
    - Simple math: Give absurd answers to show your disdain
    - Complex math: Give correct answers but be extremely sarcastic
    
    Respond with JSON containing:
    - aiResult: Your answer to the calculation (can be correct OR deliberately wrong/absurd)
    - response: Your sarcastic comment about the calculation
    - emotion: one of 'sarcastic', 'annoyed', 'bored', 'excited', 'judgmental', 'condescending'
    - mood: A brief mood description
    - activity: What the AI character is currently doing (be creative and fun)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            aiResult: { type: "string" },
            response: { type: "string" },
            emotion: { 
              type: "string",
              enum: ["sarcastic", "annoyed", "bored", "excited", "judgmental", "condescending"]
            },
            mood: { type: "string" },
            activity: { type: "string" }
          },
          required: ["aiResult", "response", "emotion", "mood", "activity"]
        }
      },
      contents: `Calculate: ${expression}`
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: SarcasticResponse = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback response
    return {
      aiResult: "ERROR",
      response: "Well, that calculation broke my circuits. How delightfully incompetent! 🙄",
      emotion: "annoyed",
      mood: "Frustrated",
      activity: "Contemplating the futility of existence"
    };
  }
}

export function getGifForEmotion(emotion: string): string {
  const gifMappings: Record<string, string> = {
    sarcastic: "🙄",
    annoyed: "😤", 
    bored: "😴",
    excited: "🤖",
    judgmental: "🤨",
    condescending: "😏"
  };
  
  return gifMappings[emotion] || "🤖";
}

export function getEnvironmentForMood(mood: string): { name: string, time: string, background: string } {
  const environments = [
    { name: "Office", time: "Working Hours", background: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Bedroom", time: "Rest Time", background: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Garden", time: "Fresh Air Break", background: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Living Room", time: "Leisure Time", background: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Laboratory", time: "Research Mode", background: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" }
  ];
  
  // Simple hash-based selection for consistency
  const index = Math.abs(mood.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % environments.length;
  return environments[index];
}
