import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Target, Zap } from "lucide-react";
import { Signal } from "@shared/schema";

interface SignalCardProps {
  signal: Signal | null | undefined;
  isLoading: boolean;
}

export function SignalCard({ signal, isLoading }: SignalCardProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-xl border border-muted bg-card/50 flex items-center justify-center animate-pulse">
        <p className="text-muted-foreground font-mono">INITIALIZING AI CORE...</p>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="w-full h-64 rounded-xl border border-muted/50 bg-card/30 flex flex-col items-center justify-center text-muted-foreground gap-4">
        <Target className="w-12 h-12 opacity-20" />
        <p className="font-display tracking-widest">NO ACTIVE SIGNAL</p>
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    );
  }

  const isBlue = signal.prediction === "blue";
  const colorClass = isBlue ? "text-[hsl(190,100%,50%)]" : "text-[hsl(320,100%,55%)]";
  const glowClass = isBlue ? "shadow-[0_0_40px_-5px_hsl(190,100%,50%,0.3)]" : "shadow-[0_0_40px_-5px_hsl(320,100%,55%,0.3)]";
  const borderClass = isBlue ? "border-[hsl(190,100%,50%)]" : "border-[hsl(320,100%,55%)]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={signal.id} // Re-animate on new signal
      className={`relative w-full overflow-hidden rounded-xl border-2 ${borderClass} bg-card ${glowClass} p-8`}
    >
      {/* Background Tech Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Zap className={`w-24 h-24 ${colorClass}`} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-fast"></span>
          AI Prediction Active
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Target</h3>
          <motion.div
            initial={{ scale: 0.8, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`text-6xl md:text-8xl font-black uppercase font-display ${colorClass} text-shadow-neon`}
          >
            {signal.prediction}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-sm border-t border-white/10 pt-6">
          <div className="text-center">
            <p className="text-xs font-mono text-muted-foreground uppercase">Pattern</p>
            <p className="text-lg font-bold font-display text-white">{signal.pattern}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-mono text-muted-foreground uppercase">Confidence</p>
            <p className={`text-lg font-bold font-display ${signal.confidence === 'high' ? 'text-green-400' : 'text-yellow-400'}`}>
              {signal.confidence?.toUpperCase() || 'CALCULATING'}
            </p>
          </div>
        </div>
      </div>

      {/* Animated Scanline */}
      <div className="scanline absolute inset-0 opacity-10 pointer-events-none"></div>
    </motion.div>
  );
}
