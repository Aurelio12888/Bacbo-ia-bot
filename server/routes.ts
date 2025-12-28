import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import TelegramBot from "node-telegram-bot-api";

// Initialize Telegram Bot if token is present
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
let bot: TelegramBot | null = null;

if (telegramToken) {
  bot = new TelegramBot(telegramToken, { polling: false });
  console.log("Telegram Bot initialized");
}

// Helper to analyze patterns
function analyzePattern(history: any[]): { pattern: string, prediction: 'blue' | 'red', confidence: 'high' | 'medium' } | null {
  if (history.length < 3) return null;
  
  const last1 = history[0].color;
  const last2 = history[1].color;
  const last3 = history[2].color;
  const last4 = history.length > 3 ? history[3].color : null;
  const last5 = history.length > 4 ? history[4].color : null;

  // 1. Hammer / Streak (3+ same) -> Continue
  if (last1 === last2 && last2 === last3) {
    // Check for Trap (5+ same -> Reverse)
    if (last4 === last1 && last5 === last1) {
       return { pattern: "TRAP (Overstreak)", prediction: last1 === 'blue' ? 'red' : 'blue', confidence: 'high' };
    }
    return { pattern: "HAMMER (Streak)", prediction: last1 as 'blue' | 'red', confidence: 'high' };
  }

  // 2. ZigZag (B R B) -> Reverse
  if (last1 !== last2 && last2 !== last3 && last1 === last3) {
    return { pattern: "ZIG-ZAG", prediction: last1 === 'blue' ? 'red' : 'blue', confidence: 'medium' };
  }

  // 3. Double Forced (BB RR) -> Continue Pair
  if (last1 === last2 && last2 !== last3 && last3 === last4 && last4 !== last1) {
    // e.g. BB RR -> Predict B
     return { pattern: "DOUBLE FORCED", prediction: last1 === 'blue' ? 'red' : 'blue', confidence: 'medium' };
  }

  // 4. Pressure (Last 10 dominace)
  if (history.length >= 10) {
    const blueCount = history.slice(0, 10).filter(r => r.color === 'blue').length;
    if (blueCount >= 7) return { pattern: "PRESSURE (Blue Dominance)", prediction: 'red', confidence: 'high' };
    if (blueCount <= 3) return { pattern: "PRESSURE (Red Dominance)", prediction: 'blue', confidence: 'high' };
  }

  return null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get Game History
  app.get(api.game.list.path, async (req, res) => {
    const history = await storage.getGameHistory(50);
    res.json(history);
  });

  // Add Result & Trigger Analysis
  app.post(api.game.add.path, async (req, res) => {
    try {
      const input = api.game.add.input.parse(req.body);
      const result = await storage.addGameResult(input);
      
      // Analysis Logic
      const history = await storage.getGameHistory(20);
      const analysis = analyzePattern(history);

      if (analysis) {
        await storage.addSignal({
          pattern: analysis.pattern,
          prediction: analysis.prediction,
          confidence: analysis.confidence,
          status: 'pending'
        });

        // Send to Telegram if configured
        if (bot && telegramChatId) {
          const emoji = analysis.prediction === 'blue' ? '🔵' : '🔴';
          const message = `🎲 *BAC BO – ELEPHANTBET*\n\n📊 *Padrão:* ${analysis.pattern}\n👉 *ENTRADA:* ${emoji} ${analysis.prediction.toUpperCase()}\n\n_IA Agressiva v1.0_`;
          
          bot.sendMessage(telegramChatId, message, { parse_mode: 'Markdown' })
            .catch(err => console.error("Telegram Error:", err.message));
        } else {
            console.log(`[TELEGRAM SIMULATION] Sending Signal: ${analysis.pattern} -> ${analysis.prediction}`);
        }
      }

      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Reset
  app.post(api.game.reset.path, async (req, res) => {
    await storage.clearGameHistory();
    res.status(204).send();
  });

  // Get Latest Signal
  app.get(api.signals.latest.path, async (req, res) => {
    const signal = await storage.getLatestSignal();
    res.json(signal || null);
  });

  // Get Signals History
  app.get(api.signals.list.path, async (req, res) => {
    const signals = await storage.getSignals(20);
    res.json(signals);
  });

  return httpServer;
}
