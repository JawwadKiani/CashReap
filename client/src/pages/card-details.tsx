import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CreditCard } from "@shared/schema";

export default function CardDetails() {
  const { id } = useParams();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ["/api/cards", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-on-surface mb-2">Card Not Found</h2>
          <p className="text-on-surface-variant">The credit card you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-on-surface-variant hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-on-surface">Card Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4">
              <div className="w-16 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{card.issuer.slice(0, 4).toUpperCase()}</span>
              </div>
              <CardTitle className="text-xl text-on-surface">{card.name}</CardTitle>
              <p className="text-on-surface-variant">{card.issuer}</p>
            </div>
            
            <div className="flex justify-center gap-2">
              {card.annualFee === 0 && (
                <Badge variant="secondary" className="bg-secondary text-white">No Annual Fee</Badge>
              )}
              <Badge variant="outline">{card.minCreditScore}+ Credit Score</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Features */}
            <div>
              <h3 className="font-semibold text-on-surface mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">{parseFloat(card.baseReward).toFixed(1)}%</div>
                  <div className="text-xs text-on-surface-variant">Base Reward</div>
                </div>
                <div className="text-center p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-on-surface">
                    {card.annualFee === 0 ? '$0' : `$${card.annualFee}`}
                  </div>
                  <div className="text-xs text-on-surface-variant">Annual Fee</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Welcome Bonus */}
            {card.welcomeBonus && (
              <div>
                <h3 className="font-semibold text-on-surface mb-2">Welcome Bonus</h3>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">{card.welcomeBonus}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {card.description && (
              <div>
                <h3 className="font-semibold text-on-surface mb-2">Details</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
              </div>
            )}

            <Separator />

            {/* Credit Requirements */}
            <div>
              <h3 className="font-semibold text-on-surface mb-2">Credit Requirements</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Minimum Credit Score</span>
                  <span className="text-sm font-medium text-on-surface">{card.minCreditScore}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Recommended Score</span>
                  <span className="text-sm font-medium text-on-surface">{card.minCreditScore + 50}+</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
              <Button variant="outline" className="w-full">
                Save to My Cards
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-on-surface-variant leading-relaxed border-t border-surface-variant pt-4">
              <p>
                Terms and conditions apply. Credit approval required. This is for informational purposes only 
                and does not constitute financial advice. Please consult with the card issuer for the most 
                current terms and conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
