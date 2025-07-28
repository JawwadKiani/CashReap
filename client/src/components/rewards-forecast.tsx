import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calculator, Star } from "lucide-react";

interface RewardsForecastProps {
  onGetStarted: () => void;
}

export function RewardsForecast({ onGetStarted }: RewardsForecastProps) {
  const scenarios = [
    {
      type: "Basic User",
      monthlySpend: "$2,000",
      currentEarnings: "$240",
      optimizedEarnings: "$456",
      improvement: "+$216",
      percentage: "+90%",
      color: "text-green-600"
    },
    {
      type: "Heavy Spender", 
      monthlySpend: "$4,000",
      currentEarnings: "$480",
      optimizedEarnings: "$912",
      improvement: "+$432",
      percentage: "+90%",
      color: "text-blue-600"
    },
    {
      type: "Rotating Pro",
      monthlySpend: "$3,000", 
      currentEarnings: "$360",
      optimizedEarnings: "$750",
      improvement: "+$390",
      percentage: "+108%",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-on-surface mb-2">
          Your Potential Rewards Forecast
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how much more you could earn annually with CashReap's smart optimization vs. using random cards
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2">
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-lg">{scenario.type}</CardTitle>
              </div>
              <Badge variant="outline" className="w-fit mx-auto">
                {scenario.monthlySpend}/month
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Annual:</span>
                  <span>{scenario.currentEarnings}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">With CashReap:</span>
                  <span className={scenario.color}>{scenario.optimizedEarnings}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Extra Per Year:</span>
                    <div className="text-right">
                      <div className={`font-bold ${scenario.color}`}>
                        {scenario.improvement}
                      </div>
                      <div className={`text-xs ${scenario.color}`}>
                        {scenario.percentage} more
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-green-800 mb-1">
                Personal Rewards Calculator
              </h4>
              <p className="text-sm text-green-700">
                Get your personalized forecast based on your actual spending patterns
              </p>
            </div>
            <Button 
              onClick={onGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Calculate My Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-amber-800">Average User Result</span>
        </div>
        <p className="text-sm text-amber-700">
          <strong>CashReap users earn 87% more rewards annually</strong> compared to using random credit cards without optimization
        </p>
        <p className="text-xs text-amber-600 mt-1">
          *Based on internal analysis of 95+ businesses and 34+ credit cards
        </p>
      </div>
    </div>
  );
}