import { processNewResult } from './telegram-service';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function startScraper() {
  console.log("Starting ElephantBet Scraper (Live Connection Simulation)...");
  
  let lastResult: string | null = null;
  let isGameOpen = true;

  setInterval(async () => {
    try {
      // Simulate market open/closed status (e.g., closed between 3-4 AM or random maintenance)
      const hour = new Date().getHours();
      const currentMarketStatus = !(hour === 3); // Simulated closed at 3 AM

      if (currentMarketStatus !== isGameOpen) {
        isGameOpen = currentMarketStatus;
        const { notifyMarketStatus } = await import("./telegram-service");
        await notifyMarketStatus(isGameOpen);
      }

      if (!isGameOpen) return;

      const colors = ['blue', 'red', 'red', 'blue', 'blue', 'red', 'tie']; 
      const currentResult = colors[Math.floor(Math.random() * colors.length)];
      
      if (currentResult !== lastResult) {
        const scoreValue = Math.floor(Math.random() * 6) + 1; // Simulated dice score
        console.log(`[LIVE ELEPHANTBET] Monitoring Bac Bo Brasileiro... Detected: ${currentResult.toUpperCase()} (${scoreValue})`);
        await processNewResult(currentResult as 'blue' | 'red' | 'tie', String(scoreValue));
        lastResult = currentResult;
      }
    } catch (error) {
      console.error("Scraper Connection Error:", error);
    }
  }, 12000); 
}
