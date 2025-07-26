import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

const getUserSession = () => {
  let session = localStorage.getItem("userSession");
  if (!session) {
    session = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userSession", session);
  }
  return session;
};

export default function MyCards() {
  const userSession = getUserSession();

  const { data: savedCards, isLoading } = useQuery({
    queryKey: [`/api/saved-cards/${userSession}`],
  });

  const unsaveCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return apiRequest("DELETE", `/api/saved-cards/${userSession}/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${userSession}`] });
    },
  });

  const handleUnsaveCard = (cardId: string) => {
    unsaveCardMutation.mutate(cardId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-on-surface">My Cards</h1>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="w-4 h-4 mr-1" />
              Add Card
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {savedCards && savedCards.length > 0 ? (
          <div className="space-y-4">
            {savedCards.map((savedCard: any) => (
              <Card key={savedCard.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-on-surface">{savedCard.card.name}</CardTitle>
                      <p className="text-sm text-on-surface-variant">{savedCard.card.issuer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnsaveCard(savedCard.card.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{parseFloat(savedCard.card.baseReward).toFixed(1)}%</div>
                      <div className="text-xs text-on-surface-variant">Base Reward</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-on-surface">
                        {savedCard.card.annualFee === 0 ? '$0' : `$${savedCard.card.annualFee}`}
                      </div>
                      <div className="text-xs text-on-surface-variant">Annual Fee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-on-surface">{savedCard.card.minCreditScore}+</div>
                      <div className="text-xs text-on-surface-variant">Credit Score</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    {savedCard.card.annualFee === 0 && (
                      <Badge variant="secondary" className="bg-secondary text-white text-xs">No Fee</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">{savedCard.card.issuer}</Badge>
                  </div>
                  
                  {savedCard.card.description && (
                    <p className="text-xs text-on-surface-variant mt-3 line-clamp-2">
                      {savedCard.card.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-on-surface-variant mt-2">
                    Saved {new Date(savedCard.savedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-2">No Saved Cards</h2>
            <p className="text-on-surface-variant mb-4">
              Save credit cards from recommendations to quickly access them later.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Explore Cards
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
