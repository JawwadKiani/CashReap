import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CardRecommendation } from "@shared/schema";

interface TopRecommendationProps {
  card: CardRecommendation;
  onViewDetails: (cardId: string) => void;
}

export function TopRecommendation({ card, onViewDetails }: TopRecommendationProps) {
  return (
    <div className="bg-gradient-to-r from-secondary to-secondary/90 rounded-xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Crown className="w-4 h-4 text-yellow-300" />
        <span className="text-sm font-medium opacity-90">BEST MATCH</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{card.name}</h3>
          <p className="text-sm opacity-80">{card.issuer}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{parseFloat(card.rewardRate).toFixed(0)}%</div>
          <div className="text-xs opacity-80">Cash Back</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>{card.categoryMatch}</span>
          {card.isRotating && (
            <span className="px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-medium">
              ACTIVE NOW
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(card.id)}
          className="bg-white/20 hover:bg-white/30 text-white border-none"
        >
          Details
        </Button>
      </div>
    </div>
  );
}
