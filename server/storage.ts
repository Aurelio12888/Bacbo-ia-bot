import { gameResults, signals, type GameResult, type InsertGameResult, type Signal, type InsertSignal } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getGameHistory(limit?: number): Promise<GameResult[]>;
  addGameResult(result: InsertGameResult): Promise<GameResult>;
  clearGameHistory(): Promise<void>;
  
  getSignals(limit?: number): Promise<Signal[]>;
  addSignal(signal: InsertSignal): Promise<Signal>;
  getLatestSignal(): Promise<Signal | undefined>;
  updateSignalStatus(id: number, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getGameHistory(limit = 50): Promise<GameResult[]> {
    return await db.select()
      .from(gameResults)
      .orderBy(desc(gameResults.timestamp))
      .limit(limit);
  }

  async addGameResult(result: InsertGameResult): Promise<GameResult> {
    const [newResult] = await db.insert(gameResults)
      .values(result)
      .returning();
    return newResult;
  }

  async clearGameHistory(): Promise<void> {
    await db.delete(gameResults);
    await db.delete(signals); 
  }

  async getSignals(limit = 20): Promise<Signal[]> {
    return await db.select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(limit);
  }

  async addSignal(signal: InsertSignal): Promise<Signal> {
    const [newSignal] = await db.insert(signals)
      .values(signal)
      .returning();
    return newSignal;
  }

  async getLatestSignal(): Promise<Signal | undefined> {
    const [signal] = await db.select()
      .from(signals)
      .orderBy(desc(signals.timestamp))
      .limit(1);
    return signal;
  }

  async updateSignalStatus(id: number, status: string): Promise<void> {
    await db.update(signals)
      .set({ status })
      .where(eq(signals.id, id));
  }
}

export const storage = new DatabaseStorage();
