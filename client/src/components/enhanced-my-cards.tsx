import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, TrendingUp, Calendar, Gift, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface EnhancedCardData {
  id: string;
  card: {
    id: string;
    name: string;
    issuer: string;
    annualFee: number;
    baseReward: number;
    description: string;
  };
  savedAt: string;
  estimatedMonthlyEarnings?: number;
  welcomeBonusProgress?: {
    target: number;
    current: number;
    deadline: string;
    bonus: string;
  };
  spendingGoal?: {
    target: number;
    current: number;
    category: string;
  };
}

interface EnhancedMyCardsProps {
  className?: string;
}

// Simulate enhanced data
const enhanceCardData = (savedCard: any): EnhancedCardData => {
  const baseCard = savedCard.card;
  
  // Simulate monthly earnings based on card type
  let estimatedMonthlyEarnings = 25;
  if (baseCard.name.includes("Sapphire")) estimatedMonthlyEarnings = 89;
  if (baseCard.name.includes("Double Cash")) estimatedMonthlyEarnings = 56;
  if (baseCard.name.includes("Freedom")) estimatedMonthlyEarnings = 67;
  if (baseCard.name.includes("Gold")) estimatedMonthlyEarnings = 142;
  
  // Simulate welcome bonus progress
  let welcomeBonusProgress = undefined;
  if (Math.random() > 0.6) {
    welcomeBonusProgress = {
      target: 3000,
      current: 1850,
      deadline: "2025-04-15",
      bonus: "$500 cash back"
    };
  }
  
  // Simulate spending goals
  let spendingGoal = undefined;
  if (Math.random() > 0.5) {
    spendingGoal = {
      target: 1500,
      current: 892,
      category: "Dining"
    };
  }
  
  return {
    ...savedCard,
    estimatedMonthlyEarnings,
    welcomeBonusProgress,
    spendingGoal
  };
};

export function EnhancedMyCards({ className }: EnhancedMyCardsProps) {
  const [showAllCards, setShowAllCards] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  const { data: savedCards, isLoading } = useQuery({
    queryKey: [`/api/saved-cards/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: allCards } = useQuery({
    queryKey: ["/api/credit-cards"],
    enabled: showAllCards,
  });

  const unsaveCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return apiRequest("DELETE", `/api/saved-cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
    },
  });

  const saveCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return apiRequest("POST", "/api/saved-cards", { cardId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
    },
  });

  const handleUnsaveCard = (cardId: string) => {
    unsaveCardMutation.mutate(cardId);
  };

  const handleSaveCard = (cardId: string) => {
    saveCardMutation.mutate(cardId);
  };

  const isCardSaved = (cardId: string) => {
    return Array.isArray(savedCards) && savedCards.some((saved: any) => saved.card.id === cardId);
  };

  // Enhance saved cards with additional data
  const enhancedCards = (savedCards || []).map(enhanceCardData);
  const totalMonthlyEarnings = enhancedCards.reduce((sum, card) => sum + (card.estimatedMonthlyEarnings || 0), 0);
  const cardsWithBonuses = enhancedCards.filter(card => card.welcomeBonusProgress);
  const cardsWithGoals = enhancedCards.filter(card => card.spendingGoal);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      {enhancedCards.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${totalMonthlyEarnings}</div>
              <div className="text-xs text-muted-foreground">Monthly Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{enhancedCards.length}</div>
              <div className="text-xs text-muted-foreground">Saved Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{cardsWithBonuses.length}</div>
              <div className="text-xs text-muted-foreground">Active Bonuses</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {enhancedCards.length > 0 ? (
            <div className="space-y-4">
              {enhancedCards.map((savedCard) => (
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
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{savedCard.card.baseReward}%</div>
                        <div className="text-xs text-on-surface-variant">Base Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ${savedCard.estimatedMonthlyEarnings}
                        </div>
                        <div className="text-xs text-on-surface-variant">Monthly Est.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-on-surface">
                          {savedCard.card.annualFee === 0 ? '$0' : `$${savedCard.card.annualFee}`}
                        </div>
                        <div className="text-xs text-on-surface-variant">Annual Fee</div>
                      </div>
                    </div>

                    {/* Welcome Bonus Progress */}
                    {savedCard.welcomeBonusProgress && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Welcome Bonus Progress</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {savedCard.welcomeBonusProgress.bonus}
                          </Badge>
                        </div>
                        <Progress 
                          value={(savedCard.welcomeBonusProgress.current / savedCard.welcomeBonusProgress.target) * 100}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${savedCard.welcomeBonusProgress.current} spent</span>
                          <span>Goal: ${savedCard.welcomeBonusProgress.target}</span>
                        </div>
                      </div>
                    )}

                    {/* Spending Goal */}
                    {savedCard.spendingGoal && (
                      <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium">{savedCard.spendingGoal.category} Goal</span>
                          </div>
                          <span className="text-xs text-muted-foreground">This Quarter</span>
                        </div>
                        <Progress 
                          value={(savedCard.spendingGoal.current / savedCard.spendingGoal.target) * 100}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${savedCard.spendingGoal.current}</span>
                          <span>Target: ${savedCard.spendingGoal.target}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-on-surface-variant mt-3">
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
                Save credit cards from recommendations to track earnings and bonuses.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setShowAllCards(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Available Cards
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bonuses" className="space-y-4">
          {cardsWithBonuses.length > 0 ? (
            <div className="space-y-4">
              {cardsWithBonuses.map((card) => (
                <Card key={card.id} className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{card.card.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Welcome Bonus Tracking</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {card.welcomeBonusProgress?.bonus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">
                            ${card.welcomeBonusProgress?.current} / ${card.welcomeBonusProgress?.target}
                          </span>
                        </div>
                        <Progress 
                          value={(card.welcomeBonusProgress!.current / card.welcomeBonusProgress!.target) * 100}
                          className="h-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <div className="font-semibold">
                            ${card.welcomeBonusProgress!.target - card.welcomeBonusProgress!.current}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deadline:</span>
                          <div className="font-semibold">
                            {new Date(card.welcomeBonusProgress!.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded text-xs">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {Math.ceil((new Date(card.welcomeBonusProgress!.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Active Welcome Bonuses</h3>
              <p className="text-sm text-muted-foreground">
                Welcome bonuses will appear here when you're working toward spending requirements.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {cardsWithGoals.length > 0 ? (
            <div className="space-y-4">
              {cardsWithGoals.map((card) => (
                <Card key={card.id} className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{card.card.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {card.spendingGoal?.category} Spending Goal
                        </p>
                      </div>
                      <Target className="h-5 w-5 text-amber-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>This Quarter</span>
                          <span className="font-medium">
                            ${card.spendingGoal?.current} / ${card.spendingGoal?.target}
                          </span>
                        </div>
                        <Progress 
                          value={(card.spendingGoal!.current / card.spendingGoal!.target) * 100}
                          className="h-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <div className="font-semibold">
                            ${card.spendingGoal!.target - card.spendingGoal!.current}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Est. Rewards:</span>
                          <div className="font-semibold text-green-600">
                            ${Math.round(card.spendingGoal!.current * (card.card.baseReward / 100))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Active Goals</h3>
              <p className="text-sm text-muted-foreground">
                Set spending goals to track your progress and maximize rewards.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Set a Goal
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Cards Section */}
      {showAllCards && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Available Credit Cards</span>
              <Button variant="ghost" size="sm" onClick={() => setShowAllCards(false)}>
                Hide
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Array.isArray(allCards) && allCards.map((card: any) => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{card.name}</div>
                    <div className="text-sm text-muted-foreground">{card.issuer}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {card.baseReward}% base
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ${card.annualFee} fee
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant={isCardSaved(card.id) ? "secondary" : "default"}
                    size="sm"
                    onClick={() => isCardSaved(card.id) ? handleUnsaveCard(card.id) : handleSaveCard(card.id)}
                    disabled={saveCardMutation.isPending || unsaveCardMutation.isPending}
                  >
                    {isCardSaved(card.id) ? "Saved" : "Save"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}