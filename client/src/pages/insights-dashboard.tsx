import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Award, 
  Brain,
  Zap,
  ArrowLeft,
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function InsightsDashboard() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months");

  // Mock data for comprehensive insights
  const insights = {
    totalRewards: 486.32,
    potentialRewards: 672.18,
    missedOpportunities: 185.86,
    optimizationScore: 72,
    topCategories: [
      { name: "Dining", spending: 1200, rewards: 48, potential: 72 },
      { name: "Grocery", spending: 800, rewards: 32, potential: 48 },
      { name: "Gas", spending: 400, rewards: 12, potential: 20 },
      { name: "Travel", spending: 600, rewards: 36, potential: 36 },
    ],
    welcomeBonuses: {
      earned: 3,
      inProgress: 2,
      potential: 1840
    },
    cardUtilization: [
      { name: "Chase Sapphire Reserve", usage: 85, optimal: true },
      { name: "Blue Cash Preferred", usage: 45, optimal: false },
      { name: "Discover it Cash Back", usage: 25, optimal: false }
    ],
    recommendations: [
      {
        type: "urgent",
        title: "Q1 Category Activation",
        description: "Activate 5% cash back on Discover it for online shopping before deadline",
        potential: 67.50,
        deadline: "3 days"
      },
      {
        type: "opportunity",
        title: "Grocery Card Switch",
        description: "Use Blue Cash Preferred for groceries to earn 6% instead of 1%",
        potential: 156.00,
        deadline: "ongoing"
      },
      {
        type: "optimization",
        title: "Welcome Bonus Target",
        description: "Spend $800 more on Chase Freedom Flex to earn $200 bonus",
        potential: 200.00,
        deadline: "45 days"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
              <p className="text-muted-foreground">
                Personalized credit card optimization intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI Powered
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total Rewards Earned"
            value={<AnimatedCounter value={insights.totalRewards} prefix="$" decimals={2} />}
            subtitle="Last 3 months"
            icon={DollarSign}
            gradient="green"
            trend="up"
            trendValue="+12% vs last period"
          />
          <StatsCard
            title="Optimization Score"
            value={<AnimatedCounter value={insights.optimizationScore} suffix="%" />}
            subtitle="Room for improvement"
            icon={Target}
            gradient="blue"
            trend="up"
            trendValue="+8 points this month"
          />
          <StatsCard
            title="Missed Opportunities"
            value={<AnimatedCounter value={insights.missedOpportunities} prefix="$" decimals={2} />}
            subtitle="Potential extra rewards"
            icon={AlertTriangle}
            gradient="rose"
            trend="down"
            trendValue="Improve with AI tips"
          />
          <StatsCard
            title="Welcome Bonuses"
            value={<AnimatedCounter value={insights.welcomeBonuses.earned} />}
            subtitle="Earned this year"
            icon={Award}
            gradient="purple"
            trend="up"
            trendValue={`$${insights.welcomeBonuses.potential} potential`}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Smart Recommendations */}
            <GradientCard gradient="purple">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Smart Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered insights to maximize your rewards
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {insights.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 backdrop-blur-sm border",
                      rec.type === "urgent" && "border-red-200 dark:border-red-800",
                      rec.type === "opportunity" && "border-amber-200 dark:border-amber-800",
                      rec.type === "optimization" && "border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          rec.type === "urgent" && "bg-red-500",
                          rec.type === "opportunity" && "bg-amber-500",
                          rec.type === "optimization" && "bg-blue-500"
                        )} />
                        <h4 className="font-semibold">{rec.title}</h4>
                        {rec.type === "urgent" && (
                          <Badge variant="destructive" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {rec.deadline}
                          </Badge>
                        )}
                      </div>
                      <span className="text-green-600 font-semibold">
                        +${rec.potential.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </GradientCard>

            {/* Card Utilization */}
            <GradientCard gradient="blue">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Card Utilization Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    How well you're using each credit card
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {insights.cardUtilization.map((card, index) => (
                  <div key={index} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{card.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{card.usage}%</span>
                        {card.optimal ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={card.usage} 
                      className={cn(
                        "h-2",
                        card.optimal && "bg-green-100 [&>div]:bg-green-500",
                        !card.optimal && "bg-amber-100 [&>div]:bg-amber-500"
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {card.optimal 
                        ? "Optimal usage for this card's benefits"
                        : "Consider using this card more for its bonus categories"
                      }
                    </p>
                  </div>
                ))}
              </div>
            </GradientCard>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <GradientCard gradient="green">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <PieChart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Spending Category Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Breakdown of your spending and rewards optimization
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {insights.topCategories.map((category, index) => (
                  <div key={category.name} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm font-semibold">${category.spending}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Rewards: </span>
                        <span className="font-medium text-blue-600">${category.rewards}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Potential: </span>
                        <span className="font-medium text-green-600">${category.potential}</span>
                      </div>
                    </div>
                    {category.potential > category.rewards && (
                      <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950 rounded border">
                        <span className="text-xs text-amber-700 dark:text-amber-300">
                          Opportunity: +${category.potential - category.rewards} with optimal card
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GradientCard>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Optimization Tools</h3>
              <p className="text-muted-foreground mb-6">
                Advanced optimization features coming soon
              </p>
              <Button variant="outline">
                Get Early Access
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rewards Forecasting</h3>
              <p className="text-muted-foreground mb-6">
                AI-powered predictions for your future rewards
              </p>
              <Button variant="outline">
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}