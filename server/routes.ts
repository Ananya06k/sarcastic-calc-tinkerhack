import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema, insertAiResponseSchema } from "@shared/schema";
import { generateSarcasticResponse, getGifForEmotion, getEnvironmentForMood } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Calculate and get AI response
  app.post("/api/calculate", async (req, res) => {
    try {
      const { expression } = req.body;
      
      if (!expression) {
        return res.status(400).json({ message: "Expression is required" });
      }
      
      // Get recent calculations for context
      const recentCalculations = await storage.getRecentCalculations(5);
      const calculationHistory = recentCalculations.map(c => ({
        expression: c.expression,
        result: c.result
      }));
      
      // Generate AI response (including AI's result)
      const aiResponse = await generateSarcasticResponse(expression, "", calculationHistory);
      
      // Save calculation with AI's result
      const calculation = await storage.createCalculation({ 
        expression, 
        result: aiResponse.aiResult 
      });
      
      // Save AI response
      const savedResponse = await storage.createAiResponse({
        calculationId: calculation.id,
        response: aiResponse.response,
        emotion: aiResponse.emotion,
        aiResult: aiResponse.aiResult
      });

      // Get appropriate GIF and environment
      const gif = getGifForEmotion(aiResponse.emotion);
      const environment = getEnvironmentForMood(aiResponse.mood);
      
      res.json({
        calculation,
        aiResponse: {
          ...savedResponse,
          mood: aiResponse.mood,
          activity: aiResponse.activity,
          gif,
          environment
        }
      });
    } catch (error) {
      console.error("Calculate API error:", error);
      res.status(500).json({ 
        message: "Failed to process calculation",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get calculation history
  app.get("/api/calculations", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const calculations = await storage.getRecentCalculations(limit);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Get AI responses for a calculation
  app.get("/api/calculations/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const responses = await storage.getAiResponsesByCalculationId(id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI responses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
