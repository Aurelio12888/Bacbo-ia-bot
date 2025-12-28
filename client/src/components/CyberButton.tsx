import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  glow?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, variant = "primary", glow = false, disabled, ...props }, ref) => {
    
    const baseStyles = "relative overflow-hidden font-display font-bold uppercase tracking-widest transition-all duration-200 clip-path-polygon";
    
    const variants = {
      primary: "bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-primary-foreground",
      secondary: "bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-secondary-foreground",
      danger: "bg-destructive/10 text-destructive border border-destructive hover:bg-destructive hover:text-destructive-foreground",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/10 border border-transparent",
    };

    const glowStyles = glow ? (variant === 'primary' ? 'box-shadow-neon-blue' : 'box-shadow-neon-red') : '';

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02, letterSpacing: "0.15em" } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={cn(
          baseStyles,
          variants[variant],
          glowStyles,
          disabled && "opacity-50 cursor-not-allowed saturate-0",
          "px-6 py-4 md:px-8 md:py-4 rounded-sm", // Brutalist boxy feel
          className
        )}
        disabled={disabled}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {/* Scanline effect overlay on hover */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent -translate-y-full hover:translate-y-full transition-transform duration-500 ease-in-out" />
        )}
      </motion.button>
    );
  }
);

CyberButton.displayName = "CyberButton";
