import { GameResult } from "@shared/schema";
import { motion } from "framer-motion";

interface HistoryTapeProps {
  results: GameResult[];
  isLoading: boolean;
}

export function HistoryTape({ results, isLoading }: HistoryTapeProps) {
  if (isLoading) return <div className="h-20 w-full bg-muted/20 animate-pulse rounded-lg" />;

  const displayResults = [...results].reverse(); // Show newest first (left to right)

  return (
    <div className="w-full relative group">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="overflow-x-auto pb-4 scrollbar-hide flex gap-3 px-4 py-2 mask-linear">
        {displayResults.length === 0 ? (
          <div className="w-full text-center py-4 text-muted-foreground font-mono text-sm">
            WAITING FOR INPUT DATA...
          </div>
        ) : (
          displayResults.map((result, i) => {
            const isBlue = result.color === "blue";
            const isTie = result.color === "tie";
            const colorClass = isBlue 
              ? "bg-[hsl(190,100%,50%)] shadow-[0_0_15px_hsl(190,100%,50%,0.5)]" 
              : isTie 
                ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                : "bg-[hsl(320,100%,55%)] shadow-[0_0_15px_hsl(320,100%,55%,0.5)]";

            return (
              <motion.div
                key={result.id || i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white/20 ${colorClass} flex items-center justify-center`}
                >
                  <span className="text-[10px] font-black text-black/50">
                    {result.color === 'tie' ? 'T' : result.color === 'blue' ? 'B' : 'R'}
                  </span>
                </div>
                {i === 0 && (
                  <span className="text-[10px] font-mono text-primary uppercase animate-pulse">Latest</span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
