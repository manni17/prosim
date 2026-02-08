import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info, HelpCircle } from "lucide-react";

interface WikiTooltipProps {
  term: string;
  definition: {
    title: string;
    definition: string;
    formula?: string;
    trade_off?: string;
  };
}

export const WikiTooltip = ({ term, definition }: WikiTooltipProps) => {
  if (!definition) return <span className="text-primary font-bold">{term}</span>;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="text-primary font-bold underline decoration-primary/30 cursor-help hover:decoration-primary transition-all">
          {term}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-window border-white/10 p-5 shadow-2xl z-[500]">
        <div className="flex justify-between space-x-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white">{definition.title}</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {definition.definition}
            </p>

            {definition.formula && (
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Formula</p>
                <code className="text-[10px] text-primary font-mono">{definition.formula}</code>
              </div>
            )}

            {definition.trade_off && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-[9px] font-bold text-primary uppercase mb-1">Trade-off</p>
                <p className="text-[10px] text-slate-500 italic leading-tight">
                  {definition.trade_off}
                </p>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
