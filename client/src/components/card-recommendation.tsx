import { Button } from "@/components/ui/button";
import type { CardRecommendation } from "@shared/schema";

interface CardRecommendationProps {
  card: CardRecommendation;
  onViewDetails: (cardId: string) => void;
}

export function CardRecommendation({ card, onViewDetails }: CardRecommendationProps) {
  const getIssuerBadge = (issuer: string) => {
    const badges: Record<string, { color: string; short: string }> = {
      "Chase": { color: "bg-blue-600", short: "CHASE" },
      "American Express": { color: "bg-blue-600", short: "AMEX" },
      "Capital One": { color: "bg-red-600", short: "CAP1" },
      "Discover": { color: "bg-orange-600", short: "DISC" },
      "Citi": { color: "bg-blue-800", short: "CITI" },
    };
    
    return badges[issuer] || { color: "bg-gray-600", short: issuer.slice(0, 4).toUpperCase() };
  };

  const badge = getIssuerBadge(card.issuer);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-variant">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-6 ${badge.color} rounded flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{badge.short}</span>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface">{card.name}</h4>
            <p className="text-xs text-on-surface-variant">{card.issuer}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{parseFloat(card.rewardRate).toFixed(0)}%</div>
          <div className="text-xs text-on-surface-variant">Cash Back</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Category</span>
          <span className="text-on-surface">{card.categoryMatch}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Annual Fee</span>
          <span className={`text-on-surface ${card.annualFee === 0 ? 'font-medium text-secondary' : ''}`}>
            {card.annualFee === 0 ? '$0' : `$${card.annualFee}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Credit Score</span>
          <span className="text-on-surface">{card.minCreditScore}+</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full mt-3 text-primary border-primary hover:bg-primary hover:text-white"
        onClick={() => onViewDetails(card.id)}
      >
        View Details
      </Button>
    </div>
  );
}
