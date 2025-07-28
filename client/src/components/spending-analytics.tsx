import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/ui/stats-card";
import { GradientCard } from "@/components/ui/gradient-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Target, 
  PieChart,
  Calendar,
  Award,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MerchantCategory } from "@shared/schema";

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
  bestCard: string;
  currentRewards: number;
  potentialRewards: number;
}

export function SpendingAnalytics() {
  const { user } = useAuth();
  const [spendingInputs, setSpendingInputs] = useState<Record<string, string>>({});
  
  const { data: categories = [] } = useQuery<MerchantCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Mock data for demonstration - in real app would come from user's actual spending
  const mockSpendingData: SpendingData[] = [
    {
      category: "Dining",
      amount: 800,
      percentage: 25,
      bestCard: "Capital One Savor",
      currentRewards: 24,
      potentialRewards: 32
    },
    {
      category: "Grocery",
      amount: 600,
      percentage: 19,
      bestCard: "Blue Cash Preferred",
      currentRewards: 18,
      potentialRewards: 36
    },
    {
      category: "Gas",
      amount: 400,
      percentage: 13,
      bestCard: "Chase Freedom Flex",
      currentRewards: 8,
      potentialRewards: 20
    },
    {
      category: "Travel",
      amount: 500,
      percentage: 16,
      bestCard: "Chase Sapphire Reserve",
      currentRewards: 15,
      potentialRewards: 15
    },
    {
      category: "Online Shopping",
      amount: 450,
      percentage: 14,
      bestCard: "Discover it Cash Back",
      currentRewards: 9,
      potentialRewards: 22.5
    }
  ];

  const totalSpending = mockSpendingData.reduce((sum, item) => sum + item.amount, 0);
  const totalCurrentRewards = mockSpendingData.reduce((sum, item) => sum + item.currentRewards, 0);
  const totalPotentialRewards = mockSpendingData.reduce((sum, item) => sum + item.potentialRewards, 0);
  const missedRewards = totalPotentialRewards - totalCurrentRewards;

  const handleSpendingUpdate = (categoryId: string, amount: string) => {
    setSpendingInputs(prev => ({
      ...prev,
      [categoryId]: amount
    }));
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Monthly Spending"
          value={`$${totalSpending.toLocaleString()}`}
          subtitle="Across all categories"
          icon={DollarSign}
          gradient="green"
        />
        <StatsCard
          title="Current Rewards"
          value={`$${totalCurrentRewards}`}
          subtitle="This month"
          icon={Award}
          gradient="blue"
          trend="up"
          trendValue="+8% vs last month"
        />
        <StatsCard
          title="Potential Rewards"
          value={`$${totalPotentialRewards.toFixed(2)}`}
          subtitle="With optimal cards"
          icon={Target}
          gradient="purple"
        />
        <StatsCard
          title="Missed Opportunity"
          value={`$${missedRewards.toFixed(2)}`}
          subtitle="Monthly missed rewards"
          icon={TrendingUp}
          gradient="rose"
          trend="down"
          trendValue="Optimize cards"
        />
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Smart Analysis</TabsTrigger>
          <TabsTrigger value="input">Update Spending</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Spending Breakdown */}
          <GradientCard gradient="blue">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Spending Breakdown & Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze your spending patterns and optimize rewards
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {mockSpendingData.map((item, index) => (
                <div key={item.category} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        index === 0 && "bg-blue-500",
                        index === 1 && "bg-green-500", 
                        index === 2 && "bg-yellow-500",
                        index === 3 && "bg-purple-500",
                        index === 4 && "bg-pink-500"
                      )} />
                      <span className="font-medium">{item.category}</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                    <span className="font-semibold">${item.amount}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Best Card: </span>
                      <span className="font-medium">{item.bestCard}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium text-blue-600">${item.currentRewards}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Potential: </span>
                      <span className="font-medium text-green-600">${item.potentialRewards}</span>
                    </div>
                  </div>
                  
                  {item.potentialRewards > item.currentRewards && (
                    <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          You could earn ${(item.potentialRewards - item.currentRewards).toFixed(2)} more with {item.bestCard}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GradientCard>

          {/* Annual Projection */}
          <GradientCard gradient="green">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Annual Rewards Projection</h3>
                <p className="text-sm text-muted-foreground">
                  Based on current spending patterns
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${(totalCurrentRewards * 12).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Current Annual</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">${(totalPotentialRewards * 12).toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Optimized Annual</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">${(missedRewards * 12).toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Annual Missed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{((missedRewards / totalCurrentRewards) * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Improvement</p>
              </div>
            </div>
          </GradientCard>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Your Monthly Spending</CardTitle>
              <CardDescription>
                Enter your actual monthly spending by category for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.slice(0, 8).map((category) => (
                <div key={category.id} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-medium">{category.name}</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={spendingInputs[category.id] || ""}
                    onChange={(e) => handleSpendingUpdate(category.id, e.target.value)}
                    className="text-right"
                  />
                  <Badge variant="outline" className="justify-center">
                    {category.description}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-6">
                Update Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <GradientCard gradient="purple">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized recommendations to maximize your rewards
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">💡 Top Recommendation</h4>
                <p className="text-sm mb-3">
                  Switch to the <strong>Blue Cash Preferred</strong> for grocery purchases. 
                  You're currently missing out on $18/month in grocery rewards.
                </p>
                <Button size="sm" variant="outline">Apply Now</Button>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">🎯 Quick Win</h4>
                <p className="text-sm mb-3">
                  Use <strong>Discover it Cash Back</strong> for your Q1 online shopping. 
                  5% back on Amazon and other online retailers until March.
                </p>
                <Button size="sm" variant="outline">Learn More</Button>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">📈 Long-term Strategy</h4>
                <p className="text-sm mb-3">
                  Consider the <strong>Chase Sapphire Reserve</strong> for travel. 
                  Your annual travel spending of $6,000 would earn significant bonus points.
                </p>
                <Button size="sm" variant="outline">Calculate Benefits</Button>
              </div>
            </div>
          </GradientCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}