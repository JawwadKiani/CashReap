import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation as useWouterLocation } from "wouter";
import { Sliders, Scale, Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationDetector } from "@/components/location-detector";
import { FilterPanel } from "@/components/filter-panel";
import { StoreInfo } from "@/components/store-info";
import { TopRecommendation } from "@/components/top-recommendation";
import { CardRecommendation } from "@/components/card-recommendation";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { StoreWithCategory, CardRecommendation as CardRec } from "@shared/schema";
import type { FilterOptions } from "@/types";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useWouterLocation();
  const [selectedStore, setSelectedStore] = useState<StoreWithCategory | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Build query parameters for recommendations
  const queryParams = new URLSearchParams();
  if (user?.id) {
    queryParams.set('userId', user.id);
  }
  if (filters.annualFee && filters.annualFee !== 'any') {
    queryParams.set('annualFee', filters.annualFee);
  }
  if (filters.creditScore) {
    queryParams.set('creditScore', filters.creditScore.toString());
  }

  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: [`/api/stores/${selectedStore?.id}/recommendations?${queryParams.toString()}`],
    enabled: !!selectedStore && !!user?.id,
  });

  const { data: searchHistory } = useQuery({
    queryKey: [`/api/search-history/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: savedCards = [] } = useQuery({
    queryKey: [`/api/saved-cards/${user?.id}`],
    enabled: !!user?.id,
  });

  const addToHistoryMutation = useMutation({
    mutationFn: async (storeId: string) => {
      return apiRequest("POST", "/api/search-history", {
        storeId,
        userId: user?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/search-history/${user?.id}`] });
    },
  });

  const handleStoreSelect = (store: StoreWithCategory) => {
    setSelectedStore(store);
    addToHistoryMutation.mutate(store.id);
  };

  const handleViewCardDetails = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };

  // Create a set of saved card IDs for quick lookup
  const savedCardIds = new Set((savedCards as any[]).map((sc: any) => sc.cardId));

  // Add saved status to recommendations (reward rate now comes from API)
  const enrichedRecommendations = recommendations?.map((card: any) => ({
    ...card,
    isSaved: savedCardIds.has(card.id)
  })) || [];

  const topRecommendation = enrichedRecommendations.length > 0 ? enrichedRecommendations[0] : null;
  const otherRecommendations = enrichedRecommendations.slice(1);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center">
                <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-32 mb-1" />
                <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="text-on-surface-variant hover:text-primary"
              >
                <Sliders className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="text-on-surface-variant hover:text-primary"
              >
                Logout
              </Button>
            </div>
          </div>
          
          <LocationDetector onStoreSelect={handleStoreSelect} selectedStore={selectedStore} />
        </div>
      </header>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={filtersOpen} 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Store Info */}
        {selectedStore && <StoreInfo store={selectedStore} />}

        {/* Loading State */}
        {recommendationsLoading && selectedStore && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
            <div className="flex items-center gap-3 justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <span className="text-on-surface">Finding best cards...</span>
            </div>
          </div>
        )}

        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">
              {topRecommendation.isSaved ? "🎯 Your Best Card" : "⭐ Top Recommendation"}
            </h3>
            <CardRecommendation 
              card={topRecommendation}
              rewardRate={topRecommendation.rewardRate}
              categoryMatch={topRecommendation.categoryMatch}
              isRotating={topRecommendation.isRotating}
              isSaved={topRecommendation.isSaved}
              onViewDetails={handleViewCardDetails} 
            />
          </div>
        )}



        {/* Other Recommendations */}
        {otherRecommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">💳 Other Great Options</h3>
            {otherRecommendations.map((card: any) => (
              <CardRecommendation
                key={card.id}
                card={card}
                rewardRate={card.rewardRate}
                categoryMatch={card.categoryMatch}
                isRotating={card.isRotating}
                isSaved={card.isSaved}
                onViewDetails={handleViewCardDetails}
              />
            ))}
          </div>
        )}

        {/* No Store Selected */}
        {!selectedStore && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant text-center">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-on-surface mb-2">Welcome to CashReap</h2>
              <p className="text-sm text-on-surface-variant mb-4">
                Search for any major US business to find the best credit card for maximum cash back rewards.
              </p>
              <Button
                onClick={() => navigate("/browse-cards")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse All Cards
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {selectedStore && recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-white rounded-xl p-4 shadow-sm border-surface-variant hover:shadow-md h-auto flex-col"
              >
                <Scale className="w-5 h-5 text-primary mb-2" />
                <span className="text-sm font-medium text-on-surface">Compare Cards</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white rounded-xl p-4 shadow-sm border-surface-variant hover:shadow-md h-auto flex-col"
              >
                <Bookmark className="w-5 h-5 text-primary mb-2" />
                <span className="text-sm font-medium text-on-surface">Save Results</span>
              </Button>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">Recent Searches</h3>
            <div className="space-y-2">
              {searchHistory.slice(0, 3).map((search: any) => (
                <button
                  key={search.id}
                  onClick={() => handleStoreSelect(search.store)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-surface-variant hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${search.store.category.iconClass} text-on-surface-variant`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-on-surface">{search.store.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(search.searchedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
