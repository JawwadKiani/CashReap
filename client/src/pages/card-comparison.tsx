import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Plus, Minus, Eye, DollarSign, CreditCard as CreditCardIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CreditCard, CardCategoryReward, MerchantCategory } from "@shared/schema";

export default function CardComparison() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    maxAnnualFee: "",
    minCreditScore: "",
    issuer: "",
    category: "",
  });

  const { data: creditCards = [] } = useQuery<CreditCard[]>({
    queryKey: ["/api/credit-cards"],
  });

  const { data: cardRewards = [] } = useQuery<CardCategoryReward[]>({
    queryKey: ["/api/card-category-rewards"],
  });

  const { data: categories = [] } = useQuery<MerchantCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: savedCards = [] } = useQuery<string[]>({
    queryKey: ["/api/saved-cards", user?.id],
    enabled: !!user?.id,
  });

  const saveComparisonMutation = useMutation({
    mutationFn: async (data: { cardIds: string[]; comparisonName?: string }) => {
      return apiRequest("/api/card-comparisons", "POST", {
        userId: user?.id,
        ...data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Comparison saved!",
        description: "Your card comparison has been saved for future reference.",
      });
    },
  });

  // Filter cards based on user criteria
  const filteredCards = creditCards.filter(card => {
    if (filters.maxAnnualFee && card.annualFee > parseInt(filters.maxAnnualFee)) return false;
    if (filters.minCreditScore && card.minCreditScore > parseInt(filters.minCreditScore)) return false;
    if (filters.issuer && card.issuer !== filters.issuer) return false;
    if (filters.category) {
      const hasCategory = cardRewards.some(reward => 
        reward.cardId === card.id && reward.categoryId === filters.category
      );
      if (!hasCategory) return false;
    }
    return true;
  });

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : prev.length < 4 ? [...prev, cardId] : prev
    );
  };

  const comparisonCards = creditCards.filter(card => selectedCards.includes(card.id));

  const getCardRewards = (cardId: string) => {
    return cardRewards.filter(reward => reward.cardId === cardId);
  };

  const getCategoryReward = (cardId: string, categoryId: string) => {
    const reward = cardRewards.find(r => r.cardId === cardId && r.categoryId === categoryId);
    return reward ? parseFloat(reward.rewardRate) : null;
  };

  const getBestCardForCategory = (categoryId: string) => {
    let bestCard = null;
    let bestRate = 0;

    comparisonCards.forEach(card => {
      const rate = getCategoryReward(card.id, categoryId);
      if (rate && rate > bestRate) {
        bestRate = rate;
        bestCard = card.id;
      }
    });

    return bestCard;
  };

  const uniqueIssuers = [...new Set(creditCards.map(card => card.issuer))];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            Card Comparison Tool
          </h1>
          <p className="text-muted-foreground">Compare credit cards side by side to find the best fit</p>
        </div>
        {selectedCards.length > 0 && (
          <Button onClick={() => saveComparisonMutation.mutate({ cardIds: selectedCards })}>
            Save Comparison
          </Button>
        )}
      </div>

      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Select Cards</TabsTrigger>
          <TabsTrigger value="compare" disabled={selectedCards.length < 2}>
            Compare ({selectedCards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter cards to find the ones you want to compare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Max Annual Fee</Label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={filters.maxAnnualFee}
                    onChange={(e) => setFilters({ ...filters, maxAnnualFee: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Min Credit Score</Label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={filters.minCreditScore}
                    onChange={(e) => setFilters({ ...filters, minCreditScore: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Issuer</Label>
                  <Select value={filters.issuer} onValueChange={(value) => setFilters({ ...filters, issuer: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any issuer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Issuers</SelectItem>
                      {uniqueIssuers.map(issuer => (
                        <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Cards to Compare (Max 4)</h2>
              <Badge variant="secondary">{selectedCards.length}/4 selected</Badge>
            </div>
            
            <div className="grid gap-4">
              {filteredCards.map(card => (
                <Card key={card.id} className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedCards.includes(card.id) && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={() => toggleCardSelection(card.id)}
                          disabled={!selectedCards.includes(card.id) && selectedCards.length >= 4}
                        />
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {card.name}
                            {savedCards.includes(card.id) && (
                              <Badge variant="secondary">Saved</Badge>
                            )}
                          </h3>
                          <p className="text-muted-foreground text-sm">{card.issuer}</p>
                          <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${card.annualFee}/year</div>
                        <div className="text-sm text-muted-foreground">
                          {card.baseReward}% base rate
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Credit Score: {card.minCreditScore}+
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          {comparisonCards.length >= 2 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Feature</th>
                          {comparisonCards.map(card => (
                            <th key={card.id} className="text-center p-2 min-w-[200px]">
                              <div className="font-medium">{card.name}</div>
                              <div className="text-xs text-muted-foreground">{card.issuer}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Annual Fee</td>
                          {comparisonCards.map(card => (
                            <td key={card.id} className="text-center p-2">
                              <span className={cn(
                                "font-semibold",
                                card.annualFee === 0 ? "text-green-600" : "text-red-600"
                              )}>
                                ${card.annualFee}
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Min Credit Score</td>
                          {comparisonCards.map(card => (
                            <td key={card.id} className="text-center p-2">{card.minCreditScore}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Base Reward Rate</td>
                          {comparisonCards.map(card => (
                            <td key={card.id} className="text-center p-2">{card.baseReward}%</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Welcome Bonus</td>
                          {comparisonCards.map(card => (
                            <td key={card.id} className="text-center p-2 text-xs">
                              {card.welcomeBonus || "None"}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Reward Rates</CardTitle>
                  <CardDescription>Higher rates are highlighted in green</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Category</th>
                          {comparisonCards.map(card => (
                            <th key={card.id} className="text-center p-2 min-w-[150px]">
                              {card.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(category => (
                          <tr key={category.id} className="border-b">
                            <td className="p-2 font-medium">{category.name}</td>
                            {comparisonCards.map(card => {
                              const rate = getCategoryReward(card.id, category.id);
                              const isBest = getBestCardForCategory(category.id) === card.id;
                              return (
                                <td key={card.id} className="text-center p-2">
                                  <span className={cn(
                                    "font-semibold px-2 py-1 rounded",
                                    isBest && rate ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "",
                                    !rate ? "text-muted-foreground" : ""
                                  )}>
                                    {rate ? `${rate}%` : `${card.baseReward}%`}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {comparisonCards.map(card => {
                      const rewards = getCardRewards(card.id);
                      const topCategories = rewards
                        .map(reward => ({
                          categoryName: categories.find(c => c.id === reward.categoryId)?.name || '',
                          rate: parseFloat(reward.rewardRate),
                        }))
                        .sort((a, b) => b.rate - a.rate)
                        .slice(0, 3);

                      return (
                        <div key={card.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{card.name}</h3>
                            {savedCards.includes(card.id) && (
                              <Badge variant="secondary">Saved</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Annual Fee:</span>
                              <span className={cn(
                                "ml-2 font-medium",
                                card.annualFee === 0 ? "text-green-600" : ""
                              )}>
                                ${card.annualFee}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Credit Score:</span>
                              <span className="ml-2 font-medium">{card.minCreditScore}+</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Base Rate:</span>
                              <span className="ml-2 font-medium">{card.baseReward}%</span>
                            </div>
                          </div>
                          {topCategories.length > 0 && (
                            <div className="mt-3">
                              <span className="text-muted-foreground text-sm">Best for:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {topCategories.map((category, index) => (
                                  <Badge key={index} variant="outline">
                                    {category.categoryName} ({category.rate}%)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Select at least 2 cards to compare</h3>
                <p className="text-muted-foreground">
                  Go to the Select Cards tab and choose the cards you want to compare
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}