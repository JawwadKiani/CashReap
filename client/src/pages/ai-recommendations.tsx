import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatsCard } from "@/components/ui/stats-card";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  ArrowLeft,
  Zap,
  Award,
  CreditCard,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { AIService, type AIInsight, type SpendingPattern } from "@/lib/ai-service";

export default function AIRecommendations() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const runAIAnalysis = async () => {
      setIsAnalyzing(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate AI insights
      const patterns = AIService.analyzeSpendingPatterns([]);
      const aiInsights = AIService.generateInsights(user!, patterns, []);
      const marketTrends = AIService.analyzeMarketTrends();
      const behaviorInsights = AIService.analyzeBehaviorPatterns(user!, []);
      
      setSpendingPatterns(patterns);
      setInsights([...aiInsights, ...marketTrends, ...behaviorInsights]);
      setIsAnalyzing(false);
    };

    if (user) {
      runAIAnalysis();
    }
  }, [user]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "recommendation": return <Award className="h-5 w-5 text-green-600" />;
      case "optimization": return <Target className="h-5 w-5 text-blue-600" />;
      case "prediction": return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default: return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "recommendation": return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "optimization": return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "prediction": return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950";
      case "warning": return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950";
      default: return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <GradientCard gradient="purple">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold mb-2">AI Analysis in Progress</h2>
                <p className="text-muted-foreground mb-4">
                  Our machine learning algorithms are analyzing your financial data...
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>✓ Processing spending patterns</div>
                  <div>✓ Analyzing market trends</div>
                  <div>✓ Generating personalized insights</div>
                  <div className="opacity-60">⏳ Optimizing recommendations</div>
                </div>
              </div>
            </GradientCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AI Recommendations</h1>
            <p className="text-muted-foreground">
              Machine learning powered insights for optimal rewards
            </p>
          </div>
        </div>

        {/* AI Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="AI Confidence"
            value="94%"
            subtitle="Analysis accuracy"
            icon={Brain}
            gradient="purple"
            trend="up"
            trendValue="High precision"
          />
          <StatsCard
            title="Insights Generated"
            value={insights.length.toString()}
            subtitle="Personalized recommendations"
            icon={Zap}
            gradient="blue"
          />
          <StatsCard
            title="Potential Savings"
            value="$1,247"
            subtitle="Annual optimization"
            icon={DollarSign}
            gradient="green"
            trend="up"
            trendValue="Based on patterns"
          />
          <StatsCard
            title="Optimization Score"
            value="78/100"
            subtitle="Current efficiency"
            icon={Target}
            gradient="amber"
            trend="up"
            trendValue="Room for improvement"
          />
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="patterns">Spending Patterns</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <Card key={index} className={getInsightColor(insight.type)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Confidence:</span>
                              <Progress 
                                value={insight.confidence * 100} 
                                className="w-12 h-2"
                              />
                              <span className="text-xs font-medium">
                                {Math.round(insight.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {insight.potentialSavings && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +${insight.potentialSavings}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{insight.description}</p>
                    {insight.action && (
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <GradientCard gradient="blue">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Machine Learning Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-detected spending patterns and trends
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {spendingPatterns.map((pattern, index) => (
                  <div key={pattern.category} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{pattern.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${pattern.monthlyAmount}/mo</span>
                        <Badge 
                          variant="outline" 
                          className={
                            pattern.trend === "increasing" ? "border-green-500 text-green-700" :
                            pattern.trend === "decreasing" ? "border-red-500 text-red-700" :
                            "border-gray-500 text-gray-700"
                          }
                        >
                          {pattern.trend}
                        </Badge>
                      </div>
                    </div>
                    
                    {pattern.seasonality && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>Seasonal pattern detected by AI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GradientCard>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <GradientCard gradient="purple">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Future spending forecasts using time series analysis
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Next 6 Months Forecast</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dining Growth: </span>
                      <span className="font-medium text-green-600">+23%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Travel Increase: </span>
                      <span className="font-medium text-blue-600">+18%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gas Decline: </span>
                      <span className="font-medium text-red-600">-12%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Grocery Stable: </span>
                      <span className="font-medium text-gray-600">±2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Increase dining rewards allocation by 20%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Consider travel rewards card for upcoming trend</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Reduce gas-focused benefits allocation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GradientCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}