import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calculator, TrendingUp, Target, Lightbulb, Zap } from "lucide-react";

export function SmartInsightsSection() {
  const insights = [
    {
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      title: "AI-Powered Optimization",
      description: "Our algorithm learns your spending patterns and suggests the perfect card combination for maximum rewards",
      highlight: "Up to 23% more rewards than using one card",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Calculator className="w-5 h-5 text-green-600" />,
      title: "Real-Time ROI Calculator", 
      description: "See exactly how much you'll earn vs. annual fees before applying - no guesswork",
      highlight: "Break-even analysis included",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-600" />,
      title: "Spending Goal Tracker",
      description: "Track welcome bonus progress and optimize spending to hit minimum requirements efficiently",
      highlight: "Never miss a bonus again",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
      title: "Smart Alerts",
      description: "Get notified when rotating categories change or when you're close to spending caps",
      highlight: "Proactive reward optimization",
      color: "bg-amber-50 border-amber-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-on-surface mb-2">
          Smart Features Competitors Don't Have
        </h3>
        <p className="text-muted-foreground">
          Advanced AI-powered insights that maximize your rewards automatically
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`${insight.color} border-2 hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                {insight.icon}
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </div>
              <Badge variant="secondary" className="w-fit">
                {insight.highlight}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-purple-800">Coming Soon: AI Co-Pilot</span>
        </div>
        <p className="text-sm text-purple-700">
          Personal AI assistant that automatically optimizes your card usage across all purchases - like having a rewards expert in your pocket
        </p>
      </div>
    </div>
  );
}