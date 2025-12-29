import { useGameHistory, useAddResult, useResetGame } from "@/hooks/use-game";
import { useLatestSignal, useSignalHistory } from "@/hooks/use-signals";
import { CyberButton } from "@/components/CyberButton";
import { SignalCard } from "@/components/SignalCard";
import { HistoryTape } from "@/components/HistoryTape";
import { PatternMonitor } from "@/components/PatternMonitor";
import { RefreshCcw, ShieldAlert, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: results = [], isLoading: isLoadingHistory } = useGameHistory();
  const { data: latestSignal, isLoading: isLoadingSignal } = useLatestSignal();
  const { data: signalHistory = [] } = useSignalHistory();
  
  const { mutate: addResult, isPending: isAdding } = useAddResult();
  const { mutate: resetGame, isPending: isResetting } = useResetGame();

  const handleInput = (color: 'blue' | 'red' | 'tie') => {
    addResult({ color });
  };

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 md:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 border border-primary rounded-lg">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl text-white tracking-widest text-shadow-neon">
              ELEPHANT<span className="text-primary">BET</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">
              Bac Bo Analytics System v2.0
            </p>
          </div>
        </div>
        
        <CyberButton 
          variant="ghost" 
          onClick={() => resetGame()} 
          disabled={isResetting}
          className="text-xs py-2 h-auto"
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
          System Reset
        </CyberButton>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Signal & Input (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Signal Box */}
          <section>
            <SignalCard signal={latestSignal} isLoading={isLoadingSignal} />
          </section>

          {/* History Feed */}
          <section className="bg-card/30 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-mono text-muted-foreground uppercase">Live Data Feed</span>
              <span className="flex items-center gap-1 text-[10px] text-green-500 font-mono">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                CONNECTED
              </span>
            </div>
            <HistoryTape results={results} isLoading={isLoadingHistory} />
          </section>
        </div>

        {/* Right Column: Pattern Log (4 cols) */}
        <div className="lg:col-span-4 h-full">
          <PatternMonitor history={signalHistory} />
          
          {/* Stats Mini Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-6 rounded-xl bg-gradient-to-br from-card to-background border border-white/5"
          >
            <h4 className="font-mono text-xs text-muted-foreground uppercase mb-4">Session Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-2xl font-bold font-display text-white">
                  {results.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Rounds</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-primary">
                  {signalHistory.filter(s => s.status === 'won').length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Signals Won</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
