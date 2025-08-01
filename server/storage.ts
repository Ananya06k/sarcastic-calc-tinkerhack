import { type User, type InsertUser, type Calculation, type InsertCalculation, type AiResponse, type InsertAiResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getRecentCalculations(limit: number): Promise<Calculation[]>;
  createAiResponse(response: InsertAiResponse): Promise<AiResponse>;
  getAiResponsesByCalculationId(calculationId: string): Promise<AiResponse[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calculations: Map<string, Calculation>;
  private aiResponses: Map<string, AiResponse>;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.aiResponses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = { 
      ...insertCalculation, 
      id,
      timestamp: new Date()
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getRecentCalculations(limit: number): Promise<Calculation[]> {
    const calculations = Array.from(this.calculations.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return calculations;
  }

  async createAiResponse(insertAiResponse: InsertAiResponse): Promise<AiResponse> {
    const id = randomUUID();
    const aiResponse: AiResponse = { 
      ...insertAiResponse, 
      id,
      timestamp: new Date()
    };
    this.aiResponses.set(id, aiResponse);
    return aiResponse;
  }

  async getAiResponsesByCalculationId(calculationId: string): Promise<AiResponse[]> {
    return Array.from(this.aiResponses.values())
      .filter(response => response.calculationId === calculationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
