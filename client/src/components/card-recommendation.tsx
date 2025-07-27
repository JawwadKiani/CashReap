import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { CreditCard } from "@shared/schema";

interface CardRecommendationProps {
  card: CreditCard;
  onViewDetails: (cardId: string) => void;
  rewardRate?: string;
  categoryMatch?: string;
  isRotating?: boolean;
  isSaved?: boolean;
}

export function CardRecommendation({ 
  card, 
  onViewDetails, 
  rewardRate = card.baseReward, 
  categoryMatch = "General", 
  isRotating = false,
  isSaved: initialIsSaved = false 
}: CardRecommendationProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/saved-cards`, { cardId: card.id });
    },
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/saved-cards/${card.id}`);
    },
    onSuccess: () => {
      setIsSaved(false);
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
    },
  });

  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };
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
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{parseFloat(rewardRate).toFixed(0)}%</div>
            <div className="text-xs text-on-surface-variant">Cash Back</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveToggle}
            disabled={saveMutation.isPending || unsaveMutation.isPending}
            className={`p-1 h-8 w-8 rounded-full ${isSaved ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isSaved ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Category</span>
          <div className="flex items-center gap-2">
            <span className="text-on-surface">{categoryMatch}</span>
            {isRotating && (
              <span className="px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-medium">
                ACTIVE
              </span>
            )}
          </div>
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
        {card.name}
      </Button>
    </div>
  );
}
