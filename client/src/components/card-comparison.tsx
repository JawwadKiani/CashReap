import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Plus, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Star,
  Check,
  Minus,
  Info
} from "lucide-react";

interface CreditCardData {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  baseReward: number;
  description: string;
  creditScoreRequired?: string;
  welcomeBonus?: string;
  features?: string[];
}

interface CardComparisonProps {
  selectedCards?: CreditCardData[];
  onCardRemove?: (cardId: string) => void;
  onCardAdd?: () => void;
  className?: string;
}

const SAMPLE_CARDS: CreditCardData[] = [
  {
    id: "chase-freedom-flex",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    annualFee: 0,
    baseReward: 1,
    description: "5% cash back on rotating categories, 5% on travel through Chase, 3% on dining and drugstores, 1% on all other purchases",
    creditScoreRequired: "Good (670+)",
    welcomeBonus: "$200 after spending $500 in first 3 months",
    features: [
      "No annual fee",
      "5% rotating categories (up to $1,500/quarter)",
      "3% back on dining and drugstores", 
      "Cell phone protection",
      "Purchase protection"
    ]
  },
  {
    id: "citi-double-cash",
    name: "Citi Double Cash Card",
    issuer: "Citi",
    annualFee: 0,
    baseReward: 2,
    description: "2% cash back on all purchases - 1% when you buy, 1% when you pay",
    creditScoreRequired: "Good (670+)",
    welcomeBonus: "$200 after spending $1,500 in first 6 months",
    features: [
      "No annual fee",
      "2% back on everything",
      "No rotating categories",
      "No caps on rewards",
      "Balance transfer offers"
    ]
  },
  {
    id: "amex-gold",
    name: "Gold Card",
    issuer: "American Express",
    annualFee: 250,
    baseReward: 1,
    description: "4X points at restaurants and on up to $25,000 in annual grocery store purchases, then 1X",
    creditScoreRequired: "Good to Excellent (670+)",
    welcomeBonus: "60,000 points after spending $4,000 in first 6 months",
    features: [
      "4X points on dining",
      "4X points on groceries (up to $25K)",
      "$120 dining credit",
      "$100 airline fee credit",
      "No foreign transaction fees"
    ]
  }
];

const COMPARISON_CATEGORIES = [
  { key: "annualFee", label: "Annual Fee", type: "fee" },
  { key: "baseReward", label: "Base Rewards", type: "reward" },
  { key: "welcomeBonus", label: "Welcome Bonus", type: "text" },
  { key: "creditScoreRequired", label: "Credit Score", type: "text" },
  { key: "features", label: "Key Benefits", type: "list" }
];

export function CardComparison({ 
  selectedCards = SAMPLE_CARDS.slice(0, 2), 
  onCardRemove, 
  onCardAdd,
  className 
}: CardComparisonProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<string | null>(null);

  const formatValue = (card: CreditCardData, category: any) => {
    switch (category.type) {
      case "fee":
        return card.annualFee === 0 ? "No Annual Fee" : `$${card.annualFee}`;
      case "reward":
        return `${card.baseReward}%`;
      case "text":
        return (card as any)[category.key] || "Not specified";
      case "list":
        return card.features || [];
      default:
        return (card as any)[category.key] || "—";
    }
  };

  const getBestValue = (cards: CreditCardData[], category: any) => {
    if (category.type === "fee") {
      return Math.min(...cards.map(c => c.annualFee));
    }
    if (category.type === "reward") {
      return Math.max(...cards.map(c => c.baseReward));
    }
    return null;
  };

  const isHighlighted = (card: CreditCardData, category: any, bestValue: any) => {
    if (bestValue === null) return false;
    
    if (category.type === "fee") {
      return card.annualFee === bestValue;
    }
    if (category.type === "reward") {
      return card.baseReward === bestValue;
    }
    return false;
  };

  if (selectedCards.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">Compare Credit Cards</CardTitle>
          <CardDescription className="mb-4">
            Select cards to see a detailed side-by-side comparison
          </CardDescription>
          <Button onClick={onCardAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Cards to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Card Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare {selectedCards.length} cards side by side
          </p>
        </div>
        {selectedCards.length < 3 && (
          <Button variant="outline" size="sm" onClick={onCardAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        )}
      </div>

      {/* Comparison Table */}
      <div className="grid gap-4">
        {/* Card Headers */}
        <div className={`grid gap-4 ${
          selectedCards.length === 2 ? "grid-cols-2" : 
          selectedCards.length === 3 ? "grid-cols-3" : "grid-cols-1"
        }`}>
          {selectedCards.map((card) => (
            <Card key={card.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{card.name}</CardTitle>
                    <CardDescription className="text-sm">{card.issuer}</CardDescription>
                  </div>
                  {onCardRemove && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onCardRemove(card.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-2 mt-3">
                  <Badge variant={card.annualFee === 0 ? "secondary" : "outline"} className="text-xs">
                    {card.annualFee === 0 ? "No Fee" : `$${card.annualFee}`}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {card.baseReward}% Base
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Comparison Categories */}
        <Card>
          <CardContent className="p-0">
            {COMPARISON_CATEGORIES.map((category, index) => {
              const bestValue = getBestValue(selectedCards, category);
              
              return (
                <div key={category.key}>
                  <div className={`grid gap-4 p-4 ${
                    selectedCards.length === 2 ? "grid-cols-[200px_1fr_1fr]" : 
                    selectedCards.length === 3 ? "grid-cols-[200px_1fr_1fr_1fr]" : "grid-cols-[200px_1fr]"
                  }`}>
                    {/* Category Label */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{category.label}</span>
                      {category.key === "features" && (
                        <Info className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Card Values */}
                    {selectedCards.map((card) => {
                      const value = formatValue(card, category);
                      const highlighted = isHighlighted(card, category, bestValue);
                      
                      if (category.type === "list") {
                        return (
                          <div key={card.id} className="space-y-1">
                            {(value as string[]).slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                <span className="text-xs">{feature}</span>
                              </div>
                            ))}
                            {(value as string[]).length > 3 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedFeatures(
                                  expandedFeatures === card.id ? null : card.id
                                )}
                                className="h-6 text-xs p-0 text-muted-foreground"
                              >
                                {expandedFeatures === card.id ? "Show less" : `+${(value as string[]).length - 3} more`}
                              </Button>
                            )}
                            
                            {/* Expanded Features */}
                            {expandedFeatures === card.id && (
                              <div className="space-y-1 pt-2">
                                {(value as string[]).slice(3).map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="text-xs">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return (
                        <div key={card.id} className={`text-sm ${
                          highlighted ? "font-semibold text-green-600" : ""
                        }`}>
                          {highlighted && <Star className="h-3 w-3 inline mr-1 text-green-600" />}
                          {value as string}
                        </div>
                      );
                    })}
                  </div>
                  
                  {index < COMPARISON_CATEGORIES.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Bottom Summary */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Quick Recommendation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Based on general spending patterns, here's our suggestion:
              </p>
              
              {selectedCards.length >= 2 && (
                <div className="space-y-2">
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="text-center">
                      <div className="font-medium">Best for No Fee</div>
                      <div className="text-muted-foreground">
                        {selectedCards.find(c => c.annualFee === 0)?.name || "None"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Highest Base Rate</div>
                      <div className="text-muted-foreground">
                        {selectedCards.find(c => c.baseReward === Math.max(...selectedCards.map(card => card.baseReward)))?.name}
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Get Personalized Recommendation
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}