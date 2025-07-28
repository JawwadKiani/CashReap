import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Target,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Gift,
  Zap
} from "lucide-react";

interface SimpleInsight {
  type: "savings" | "opportunity" | "warning" | "tip";
  title: string;
  description: string;
  actionText: string;
  potentialSavings?: number;
  confidence: number;
  priority: "high" | "medium" | "low";
}

interface SimpleAIInsightsProps {
  className?: string;
}

const SAMPLE_INSIGHTS: SimpleInsight[] = [
  {
    type: "savings",
    title: "Switch to Better Dining Card",
    description: "You spend $650/month on dining. The Capital One Savor gives 4% vs your current 1%.",
    actionText: "Save $234/year",
    potentialSavings: 234,
    confidence: 94,
    priority: "high"
  },
  {
    type: "opportunity", 
    title: "Earn Welcome Bonus",
    description: "Based on your spending, you can easily earn a $500 welcome bonus this quarter.",
    actionText: "See eligible cards",
    potentialSavings: 500,
    confidence: 89,
    priority: "high"
  },
  {
    type: "tip",
    title: "Optimize Grocery Shopping",
    description: "Use your Blue Cash Preferred at grocery stores for 6% back (vs 1% on other cards).",
    actionText: "Set reminder",
    potentialSavings: 156,
    confidence: 96,
    priority: "medium"
  },
  {
    type: "warning",
    title: "Annual Fee Coming Up",
    description: "Your Platinum Card's $695 annual fee hits next month. Here's how to maximize value.",
    actionText: "Review benefits",
    confidence: 100,
    priority: "medium"
  }
];

export function SimpleAIInsights({ className }: SimpleAIInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "savings": return <DollarSign className="h-5 w-5 text-green-600" />;
      case "opportunity": return <Gift className="h-5 w-5 text-blue-600" />;
      case "tip": return <Lightbulb className="h-5 w-5 text-amber-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Zap className="h-5 w-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    const baseColors = {
      savings: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
      opportunity: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950", 
      tip: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
      warning: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
    };
    
    if (priority === "high") {
      return `${baseColors[type as keyof typeof baseColors]} ring-2 ring-offset-2 ring-primary/30`;
    }
    
    return baseColors[type as keyof typeof baseColors];
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary", 
      low: "outline"
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] as any} className="text-xs">
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Personalized recommendations to maximize your rewards</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        {SAMPLE_INSIGHTS.map((insight, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
              getInsightColor(insight.type, insight.priority)
            }`}
            onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    <CardDescription className="text-xs">
                      {insight.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {insight.potentialSavings && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      +${insight.potentialSavings}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {expandedInsight === index && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <span className="font-medium">{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-1" />
                  </div>
                  
                  {/* Detailed Explanation */}
                  {insight.type === "savings" && (
                    <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">How you save money:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Current card: 1% back on dining = $78/year</li>
                        <li>• Recommended card: 4% back = $312/year</li>
                        <li>• <span className="text-green-600 font-medium">Net savings: $234/year</span></li>
                      </ul>
                    </div>
                  )}
                  
                  {insight.type === "opportunity" && (
                    <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Welcome bonus details:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Spend $3,000 in 3 months</li>
                        <li>• Your average spending: $4,200/month</li>
                        <li>• <span className="text-blue-600 font-medium">Easily achievable based on your patterns</span></li>
                      </ul>
                    </div>
                  )}
                  
                  {insight.type === "tip" && (
                    <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Quick optimization:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• You spend $260/month at grocery stores</li>
                        <li>• Blue Cash Preferred: 6% back (up to $6,000/year)</li>
                        <li>• <span className="text-amber-600 font-medium">Switch from 1% card saves $156/year</span></li>
                      </ul>
                    </div>
                  )}
                  
                  {insight.type === "warning" && (
                    <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Annual fee breakdown:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• $695 annual fee due March 15th</li>
                        <li>• Your benefits used: $520 value</li>
                        <li>• <span className="text-red-600 font-medium">Consider downgrading to save money</span></li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Button size="sm" className="w-full">
                    {insight.actionText}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950 dark:to-amber-950 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-800 dark:text-green-200">
                Total Potential Savings
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                $890/year
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Based on your spending patterns
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}