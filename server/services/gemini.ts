import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface SarcasticResponse {
  response: string;
  emotion: 'sarcastic' | 'annoyed' | 'bored' | 'excited' | 'judgmental' | 'condescending';
  mood: string;
  activity: string;
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
    
    Generate a sarcastic response to the calculation "${expression} = ${result}".
    
    Context: ${historyContext}
    
    Consider these factors:
    - Complexity of the calculation (simple arithmetic vs complex operations)
    - Whether the user made errors or got unusual results
    - Patterns in their calculation history
    - Whether they're doing repetitive or pointless calculations
    
    Respond with JSON containing:
    - response: Your sarcastic comment (keep it witty but not mean-spirited)
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
            response: { type: "string" },
            emotion: { 
              type: "string",
              enum: ["sarcastic", "annoyed", "bored", "excited", "judgmental", "condescending"]
            },
            mood: { type: "string" },
            activity: { type: "string" }
          },
          required: ["response", "emotion", "mood", "activity"]
        }
      },
      contents: `${expression} = ${result}`
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
