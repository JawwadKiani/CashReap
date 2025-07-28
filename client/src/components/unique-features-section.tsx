import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Search, Sparkles } from "lucide-react";

export function UniqueFeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Privacy-First Approach",
      description: "No bank account linking required - we never access your financial data",
      badge: "Privacy First",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "Business-Specific Search", 
      description: "Search 'Netflix' or 'Planet Fitness' - not just generic categories",
      badge: "More Granular",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: "Instant Guest Access",
      description: "Try our recommendations immediately without signing up first",
      badge: "Zero Friction",
      color: "bg-amber-50 border-amber-200"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: "Modern Business Coverage",
      description: "First to optimize for streaming services, fitness, and entertainment",
      badge: "Ahead of Trends",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-on-surface mb-2">Why Choose CashReap?</h3>
        <p className="text-muted-foreground">
          Built different from other credit card apps - focused on what matters most
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className={`${feature.color} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>🌾 Harvest Your Rewards</strong> - The only app with an agricultural theme that makes earning cash back feel like reaping what you sow
        </p>
      </div>
    </div>
  );
}