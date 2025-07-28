import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Target, 
  Gift, 
  BarChart3, 
  CreditCard, 
  Search,
  History,
  ArrowRight
} from "lucide-react";

export function FeatureNavigation() {
  const features = [
    {
      title: "Purchase Planner",
      description: "Plan your upcoming purchases and see which cards offer the best rewards",
      icon: Target,
      href: "/purchase-planner",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      badge: "Smart Planning"
    },
    {
      title: "Reward Calculator", 
      description: "Enter your spending patterns to calculate potential annual rewards",
      icon: Calculator,
      href: "/reward-calculator", 
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      badge: "Optimize Earnings"
    },
    {
      title: "Welcome Bonus Tracker",
      description: "Track your progress toward earning credit card welcome bonuses",
      icon: Gift,
      href: "/welcome-bonus-tracker",
      color: "text-purple-500", 
      bgColor: "bg-purple-50 dark:bg-purple-950",
      badge: "Bonus Hunting"
    },
    {
      title: "Card Comparison Tool",
      description: "Compare up to 4 credit cards side by side across all categories",
      icon: BarChart3,
      href: "/card-comparison",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      badge: "Head-to-Head"
    },
    {
      title: "Browse All Cards",
      description: "Explore our database of 34+ credit cards from major issuers",
      icon: CreditCard,
      href: "/browse-cards",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      badge: "Comprehensive"
    },
    {
      title: "My Cards",
      description: "Manage your saved credit cards and view personalized recommendations",
      icon: Search,
      href: "/my-cards", 
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-950",
      badge: "Personal"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">CashReap Tools</h2>
        <p className="text-muted-foreground">
          Comprehensive credit card optimization platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center justify-end mt-4">
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-green-50 dark:from-amber-950 dark:to-green-950 p-6 rounded-lg border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <History className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-lg">Recent Activity</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          View your search history and recently viewed cards for quick access
        </p>
        <Link href="/history">
          <Button variant="outline" className="group">
            View History
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}