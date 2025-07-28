import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: string;
  name: string;
  categoryId: string;
  isOnline?: boolean;
}

interface CardRecommendation {
  id: string;
  name: string;
  issuer: string;
  baseReward: string;
  annualFee: number;
  minCreditScore: number;
  welcomeBonus: string;
  description: string;
}

interface GuestCardFinderProps {
  onSignUpClick: () => void;
}

export function GuestCardFinder({ onSignUpClick }: GuestCardFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: recommendations = [] } = useQuery<CardRecommendation[]>({
    queryKey: [`/api/stores/${selectedStore?.id}/recommendations`],
    enabled: !!selectedStore,
  });

  // Filter stores based on search
  const filteredStores = stores.filter((store: Store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setSearchTerm(store.name);
  };

  return (
    <div className="space-y-6">
      {/* Quick Store Search */}
      <Card className="border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Try It Now - No Sign Up Required
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Search any major US business to see the best credit card for maximum rewards
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search stores (e.g., Target, Netflix, Starbucks)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchTerm.length > 1 && filteredStores.length > 0 && !selectedStore && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredStores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{store.name}</span>
                    {store.isOnline && (
                      <Badge variant="secondary" className="text-xs">Online</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular Stores Quick Select */}
          {!selectedStore && searchTerm.length <= 1 && (
            <div>
              <p className="text-sm font-medium mb-2">Popular Stores:</p>
              <div className="flex flex-wrap gap-2">
                {["Target", "Amazon", "Starbucks", "Netflix", "Walmart", "Costco"].map((storeName) => {
                  const store = stores.find(s => s.name === storeName);
                  return store ? (
                    <Badge
                      key={store.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handleStoreSelect(store)}
                    >
                      {storeName}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {selectedStore && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CreditCard className="w-5 h-5" />
              Best Cards for {selectedStore.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 2).map((card: CardRecommendation, index: number) => (
                  <div key={card.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{card.name}</h4>
                      {index === 0 && (
                        <Badge className="bg-gold text-gold-foreground">Best Match</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Reward Rate:</strong> {card.baseReward}% cash back</p>
                      <p><strong>Annual Fee:</strong> ${card.annualFee}</p>
                      <p><strong>Welcome Bonus:</strong> {card.welcomeBonus}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Finding best cards for {selectedStore.name}...</p>
              </div>
            )}

            {/* Call to Action */}
            <div className="pt-4 border-t border-green-200 dark:border-green-800">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Want to see all recommendations and save your favorite cards?
                </p>
                <Button 
                  onClick={onSignUpClick}
                  className="w-full"
                  size="lg"
                >
                  Sign Up for Full Access
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedStore(null);
                    setSearchTerm("");
                  }}
                  className="w-full"
                  size="sm"
                >
                  Search Another Store
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}