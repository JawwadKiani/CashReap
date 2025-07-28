import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, TrendingUp, CreditCard, Star } from "lucide-react";
import type { CreditCard as CreditCardType, UserSpendingProfile, MerchantCategory, CardCategoryReward } from "@shared/schema";

type SpendingInput = {
  categoryId: string;
  monthlyAmount: number;
};

export default function RewardCalculator() {
  const { user } = useAuth();
  const [spendingInputs, setSpendingInputs] = useState<SpendingInput[]>([]);

  const { data: categories = [] } = useQuery<MerchantCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: creditCards = [] } = useQuery<CreditCardType[]>({
    queryKey: ["/api/credit-cards"],
  });

  const { data: cardRewards = [] } = useQuery<CardCategoryReward[]>({
    queryKey: ["/api/card-category-rewards"],
  });

  const { data: savedCards = [] } = useQuery<string[]>({
    queryKey: ["/api/saved-cards", user?.id],
    enabled: !!user?.id,
  });

  // Initialize spending inputs when categories load
  useMemo(() => {
    if (categories.length > 0 && spendingInputs.length === 0) {
      setSpendingInputs(
        categories.map(category => ({
          categoryId: category.id,
          monthlyAmount: 0,
        }))
      );
    }
  }, [categories, spendingInputs.length]);

  const updateSpending = (categoryId: string, amount: number) => {
    setSpendingInputs(prev =>
      prev.map(input =>
        input.categoryId === categoryId
          ? { ...input, monthlyAmount: amount }
          : input
      )
    );
  };

  // Calculate earnings for each card
  const cardEarnings = useMemo(() => {
    return creditCards.map(card => {
      let totalMonthlyEarnings = 0;
      const categoryEarnings: Array<{
        categoryName: string;
        rewardRate: string;
        monthlyEarnings: number;
        spending: number;
      }> = [];

      spendingInputs.forEach(input => {
        if (input.monthlyAmount > 0) {
          const category = categories.find(c => c.id === input.categoryId);
          if (!category) return;

          // Find the reward rate for this card and category
          const reward = cardRewards.find(r => 
            r.cardId === card.id && r.categoryId === input.categoryId
          );
          
          const rewardRate = reward ? parseFloat(reward.rewardRate) : parseFloat(card.baseReward);
          const monthlyEarnings = (input.monthlyAmount * rewardRate) / 100;
          
          totalMonthlyEarnings += monthlyEarnings;
          
          if (monthlyEarnings > 0) {
            categoryEarnings.push({
              categoryName: category.name,
              rewardRate: reward ? reward.rewardRate : card.baseReward,
              monthlyEarnings,
              spending: input.monthlyAmount,
            });
          }
        }
      });

      return {
        card,
        monthlyEarnings: totalMonthlyEarnings,
        annualEarnings: totalMonthlyEarnings * 12,
        netAnnualValue: (totalMonthlyEarnings * 12) - card.annualFee,
        categoryEarnings: categoryEarnings.sort((a, b) => b.monthlyEarnings - a.monthlyEarnings),
        isSaved: savedCards.includes(card.id),
      };
    }).sort((a, b) => b.netAnnualValue - a.netAnnualValue);
  }, [creditCards, cardRewards, spendingInputs, categories, savedCards]);

  const totalMonthlySpending = spendingInputs.reduce((sum, input) => sum + input.monthlyAmount, 0);
  const topCard = cardEarnings[0];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-blue-500" />
          Reward Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your monthly spending to see which cards offer the best rewards
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending by Category</CardTitle>
              <CardDescription>
                Enter your average monthly spending in each category to calculate potential rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map(category => {
                const spending = spendingInputs.find(s => s.categoryId === category.id)?.monthlyAmount || 0;
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">{category.name}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={spending || ""}
                          onChange={(e) => updateSpending(category.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-right"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[spending]}
                        onValueChange={(value) => updateSpending(category.id, value[0])}
                        max={2000}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$0</span>
                        <span>$2,000</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Monthly Spending:</span>
                  <span className="text-lg font-bold">${totalMonthlySpending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Annual Spending:</span>
                  <span>${(totalMonthlySpending * 12).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {totalMonthlySpending > 0 ? (
            <>
              {topCard && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <Star className="h-5 w-5" />
                      Best Card for Your Spending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{topCard.card.name}</h3>
                        <p className="text-muted-foreground">{topCard.card.issuer}</p>
                        {topCard.isSaved && (
                          <Badge className="mt-2">Saved Card</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${topCard.netAnnualValue.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Net Annual Value</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <div className="text-lg font-semibold">${topCard.monthlyEarnings.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Monthly Rewards</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <div className="text-lg font-semibold">${topCard.annualEarnings.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Annual Rewards</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <div className="text-lg font-semibold">${topCard.card.annualFee}</div>
                        <div className="text-xs text-muted-foreground">Annual Fee</div>
                      </div>
                    </div>

                    {topCard.categoryEarnings.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Top Earning Categories:</h4>
                        <div className="space-y-2">
                          {topCard.categoryEarnings.slice(0, 3).map((earning, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded">
                              <span className="text-sm">{earning.categoryName}</span>
                              <div className="text-right">
                                <span className="font-medium">{earning.rewardRate}%</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ${earning.monthlyEarnings.toFixed(2)}/month
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>All Cards Ranked by Value</CardTitle>
                  <CardDescription>
                    Showing net annual value (rewards minus annual fee) for your spending pattern
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cardEarnings.slice(0, 10).map((result, index) => (
                      <div key={result.card.id} className={cn(
                        "flex justify-between items-center p-4 rounded-lg border",
                        result.isSaved && "bg-blue-50 dark:bg-blue-950 border-blue-200"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0 ? "bg-yellow-500 text-white" :
                            index === 1 ? "bg-gray-400 text-white" :
                            index === 2 ? "bg-amber-600 text-white" :
                            "bg-gray-200 text-gray-600"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {result.card.name}
                              {result.isSaved && <Badge variant="secondary" className="text-xs">Saved</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.card.issuer} • ${result.card.annualFee} annual fee
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${result.netAnnualValue.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${result.annualEarnings.toFixed(2)} rewards
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Enter your spending to see results</h3>
                <p className="text-muted-foreground">
                  Go to the Calculator tab and enter your monthly spending by category
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}