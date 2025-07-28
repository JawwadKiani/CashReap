import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Globe, Users, Award, Sparkles } from "lucide-react";

export function InnovationHighlights() {
  const innovations = [
    {
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      title: "Mobile-First Design",
      description: "Built for Gen Z and Millennials who manage finances on their phones",
      badge: "Modern UX",
      stats: "87% of users prefer mobile"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      title: "Zero Bank Account Linking",
      description: "Complete privacy - we never access your banking data or transaction history",
      badge: "Privacy Leader",
      stats: "Industry leading privacy"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Community-Driven Database",
      description: "Real users contribute and verify store categories for accuracy",
      badge: "Crowdsourced",
      stats: "95% accuracy rate"
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Gamified Rewards Journey",
      description: "Achievement badges and streaks make maximizing rewards fun and engaging",
      badge: "Coming Soon",
      stats: "2x engagement boost"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-on-surface mb-2">
          Next-Generation Features
        </h3>
        <p className="text-muted-foreground">
          Innovation that puts CashReap years ahead of traditional apps
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {innovations.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge variant={item.badge === "Coming Soon" ? "outline" : "default"}>
                  {item.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-amber-700">
                  {item.stats}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200">
        <div className="text-center space-y-3">
          <h4 className="text-xl font-bold text-indigo-800">
            The Future of Credit Card Optimization
          </h4>
          <p className="text-sm text-indigo-700 max-w-2xl mx-auto">
            Traditional apps focus on basic category matching, but CashReap is building the first AI-native platform that understands your lifestyle and automatically optimizes every purchase for maximum rewards.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["AI Co-Pilot", "Predictive Analytics", "Social Rewards", "Voice Commands"].map((feature) => (
              <Badge key={feature} variant="outline" className="border-indigo-300 text-indigo-700">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}