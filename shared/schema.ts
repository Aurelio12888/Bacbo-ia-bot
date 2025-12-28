import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(), // 'blue' | 'red' | 'tie'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  pattern: text("pattern").notNull(),
  prediction: text("prediction").notNull(), // 'blue' | 'red'
  confidence: text("confidence"), // 'high', 'medium'
  status: text("status").default("pending"), // 'pending', 'won', 'lost'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true, timestamp: true });
export const insertSignalSchema = createInsertSchema(signals).omit({ id: true, timestamp: true });

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type Signal = typeof signals.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;
