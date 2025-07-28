import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Zap } from "lucide-react";

export function TrendingSection() {
  const currentQuarter = "Q1 2025";
  
  const rotatingCategories = [
    {
      cardName: "Chase Freedom Flex",
      category: "Streaming Services",
      reward: "5%",
      endsDate: "March 31, 2025",
      businesses: ["Netflix", "Disney+", "Hulu", "YouTube Premium"]
    },
    {
      cardName: "Discover it Cash Back",
      category: "Digital Wallets",
      reward: "5%",
      endsDate: "March 31, 2025", 
      businesses: ["PayPal", "Apple Pay", "Google Pay", "Samsung Pay"]
    }
  ];

  const trendingBusinesses = [
    { name: "Netflix", searches: "+45%", reason: "Streaming bonus active" },
    { name: "Planet Fitness", searches: "+38%", reason: "New Year fitness goals" },
    { name: "Amazon", searches: "+22%", reason: "Always popular" },
    { name: "DoorDash", searches: "+19%", reason: "Winter delivery surge" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-on-surface mb-2">Hot This Quarter</h3>
        <p className="text-muted-foreground">
          Current bonus categories and trending businesses - {currentQuarter}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Rotating Categories */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Calendar className="w-5 h-5" />
              Active Bonus Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rotatingCategories.map((category, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{category.cardName}</h4>
                  <Badge className="bg-orange-600 hover:bg-orange-700">
                    {category.reward} Cash Back
                  </Badge>
                </div>
                <p className="text-sm font-medium text-orange-800 mb-1">
                  {category.category}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Includes: {category.businesses.join(", ")}</p>
                  <p className="text-red-600">Ends: {category.endsDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Searches */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Trending Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingBusinesses.map((business, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <h4 className="font-semibold text-sm">{business.name}</h4>
                  <p className="text-xs text-muted-foreground">{business.reason}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {business.searches}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Pro Tip:</strong> CashReap automatically tracks rotating categories so you never miss bonus periods
        </p>
      </div>
    </div>
  );
}