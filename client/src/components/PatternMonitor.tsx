import { Signal } from "@shared/schema";
import { Activity, Radio } from "lucide-react";

interface PatternMonitorProps {
  history: Signal[];
}

export function PatternMonitor({ history }: PatternMonitorProps) {
  const recentSignals = history.slice(0, 5);

  return (
    <div className="glass-panel p-6 rounded-xl h-full border-t-2 border-t-accent/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display flex items-center gap-2 text-accent">
          <Activity className="w-5 h-5" />
          Pattern Log
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Radio className="w-3 h-3 animate-pulse text-red-500" />
          LIVE
        </div>
      </div>

      <div className="space-y-3">
        {recentSignals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground/50 font-mono text-xs">
            AWAITING PATTERN RECOGNITION...
          </div>
        ) : (
          recentSignals.map((signal) => (
            <div 
              key={signal.id} 
              className="flex items-center justify-between p-3 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase">{new Date(signal.timestamp!).toLocaleTimeString()}</span>
                <span className="font-bold font-display text-sm tracking-wide">{signal.pattern}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded bg-black/40 ${
                  signal.prediction === 'blue' ? 'text-[hsl(190,100%,50%)]' : 'text-[hsl(320,100%,55%)]'
                }`}>
                  {signal.prediction}
                </span>
                
                {signal.status && signal.status !== 'pending' && (
                  <span className={`w-2 h-2 rounded-full ${
                    signal.status === 'won' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'
                  }`} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
