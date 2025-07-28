import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, CreditCard, DollarSign, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { StoreBrowser } from "@/components/store-browser";
import type { Store, CreditCard as CreditCardType } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showStoreBrowser, setShowStoreBrowser] = useState(false);
  const [localSavedCards, setLocalSavedCards] = useState<any[]>([]);

  // Load localStorage cards on mount
  useEffect(() => {
    if (!user) {
      import("@/lib/local-storage").then(({ getSavedCards }) => {
        setLocalSavedCards(getSavedCards());
      });
    }
  }, [user]);

  // API saved cards for logged-in users
  const { data: apiSavedCards } = useQuery({
    queryKey: ["/api/saved-cards", user?.id],
    enabled: !!user,
  });

  // Get store recommendations
  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/recommendations", selectedStore?.id],
    enabled: !!selectedStore,
  });

  // Handle saving cards without mutation
  const handleSaveCard = async (card: CreditCardType) => {
    console.log('Saving card:', card.name, 'User logged in:', !!user);
    
    if (user) {
      // Save to API if logged in
      try {
        const response = await fetch("/api/saved-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, cardId: card.id }),
        });
        if (response.ok) {
          // Refresh API data
          window.location.reload();
        }
      } catch (error) {
        console.error('API save failed:', error);
      }
    } else {
      // Save to localStorage if not logged in
      const { saveCard, getSavedCards } = await import("@/lib/local-storage");
      saveCard({
        id: card.id,
        name: card.name,
        issuer: card.issuer,
        annualFee: card.annualFee,
        baseRewardRate: card.baseRewardRate
      });
      console.log('Card saved to localStorage');
      
      // Refresh local saved cards immediately
      const updated = getSavedCards();
      console.log('Updated local cards:', updated.length);
      setLocalSavedCards(updated);
    }
  };

  // Combined saved cards (API + localStorage)
  const savedCards = user ? apiSavedCards : localSavedCards;

  // Debug logging
  useEffect(() => {
    console.log('User:', !!user);
    console.log('API Saved Cards:', apiSavedCards?.length || 0);
    console.log('Local Saved Cards:', localSavedCards?.length || 0);
    console.log('Final Saved Cards:', savedCards?.length || 0);
  }, [user, apiSavedCards, localSavedCards, savedCards]);

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <svg width="50" height="40" viewBox="0 0 300 150" className="text-primary">
            <path d="M50 100 Q60 80 70 60 Q80 40 90 20" stroke="#F59E0B" strokeWidth="3" fill="none"/>
            <path d="M90 20 Q95 15 100 12 Q105 10 110 12 Q115 15 120 20" stroke="#F59E0B" strokeWidth="2" fill="none"/>
            <circle cx="120" cy="35" r="3" fill="#F59E0B"/>
            <path d="M120 35 L125 40 L130 35 L135 45 L140 35" stroke="#F59E0B" strokeWidth="2" fill="none"/>
            
            <path d="M160 100 Q170 80 180 60 Q190 40 200 20" stroke="#F59E0B" strokeWidth="3" fill="none"/>
            <path d="M200 20 Q205 15 210 12 Q215 10 220 12 Q225 15 230 20" stroke="#F59E0B" strokeWidth="2" fill="none"/>
            <circle cx="230" cy="35" r="3" fill="#F59E0B"/>
            <path d="M230 35 L235 40 L240 35 L245 45 L250 35" stroke="#F59E0B" strokeWidth="2" fill="none"/>
            
            <circle cx="175" cy="75" r="25" stroke="#22C55E" strokeWidth="3" fill="none"/>
            <path d="M165 75 L172 82 L185 68" stroke="#22C55E" strokeWidth="3" fill="none"/>
            <text x="175" y="81" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#22C55E">$</text>
          </svg>
          <h1 className="text-2xl font-bold text-on-surface">
            CashReap
          </h1>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-primary font-semibold tracking-wide">
            HARVEST YOUR REWARDS
          </div>
          <p className="text-on-surface-variant text-sm">
            Get the highest cash back for any store
          </p>
        </div>
      </div>

      {/* Store Search */}
      <Card className="p-4 border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-on-surface">
            {selectedStore ? `Shopping at ${selectedStore.name}` : "Where are you shopping?"}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowStoreBrowser(true)}
            className="flex-1"
            size="lg"
          >
            <Search className="w-4 h-4 mr-2" />
            {selectedStore ? "Change Store" : "Search Stores"}
          </Button>
          {selectedStore && (
            <Button
              variant="outline"
              onClick={() => setSelectedStore(null)}
              size="lg"
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Recommendations - Always show when store is selected */}
      {selectedStore && (
        <div className="space-y-3">
          <h3 className="font-semibold text-on-surface">Best Cards for {selectedStore.name}</h3>
          {isLoadingRecommendations ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse h-32"></div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((card: CreditCardType) => {
              const categoryReward = card.categoryRewards?.find(
                cr => cr.categoryId === selectedStore.categoryId
              );
              const rewardRate = categoryReward?.rewardRate || card.baseRewardRate;

              return (
                <Card key={card.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-on-surface">{card.name}</h4>
                      <p className="text-sm text-on-surface-variant">{card.issuer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{rewardRate}%</div>
                      <div className="text-xs text-on-surface-variant">cash back</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-on-surface-variant mb-3">
                    <span>Annual Fee: ${card.annualFee}</span>
                    <span>Min Credit: {card.creditScoreRequired}</span>
                  </div>
                  {card.welcomeBonus && (
                    <p className="text-xs text-primary mt-2">{card.welcomeBonus}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSaveCard(card)}
                      disabled={savedCards && savedCards.some((saved: any) => 
                        user ? saved.card?.id === card.id : saved.cardId === card.id
                      )}
                    >
                      {(savedCards && savedCards.some((saved: any) => 
                        user ? saved.card?.id === card.id : saved.cardId === card.id
                      )) ? "Saved" : "Save"}
                    </Button>
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm py-2"
                      onClick={() => window.open(`/apply/${card.id}`, '_blank')}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-4 text-center">
              <p className="text-on-surface-variant">No card recommendations found for this store category.</p>
            </Card>
          )}
        </div>
      )}

      {/* Store Browser Modal */}
      {showStoreBrowser && (
        <StoreBrowser
          onStoreSelect={(store) => {
            setSelectedStore(store);
            setShowStoreBrowser(false);
          }}
          onClose={() => setShowStoreBrowser(false)}
        />
      )}
    </div>
  );
}