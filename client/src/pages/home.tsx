import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation as useWouterLocation } from "wouter";
import { Sliders, Scale, Bookmark, Search, Sparkles, TrendingUp, Award, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationDetector } from "@/components/location-detector";
import { FilterPanel } from "@/components/filter-panel";
import { StoreInfo } from "@/components/store-info";
import { TopRecommendation } from "@/components/top-recommendation";
import { CardRecommendation } from "@/components/card-recommendation";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
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

        {/* Enhanced Feature Showcase - Comprehensive CashReap Platform */}
        {!selectedStore && (
          <div className="space-y-6">
            {/* Hero Section with animated gradients */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-800">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-12 h-12 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-4 left-8 w-6 h-6 bg-orange-400 rounded-full animate-ping"></div>
              </div>
              
              <div className="relative text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="h-6 w-6 text-amber-600 animate-pulse" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    CashReap Platform
                  </h2>
                  <Sparkles className="h-6 w-6 text-amber-600 animate-pulse" />
                </div>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  AI-powered credit card optimization suite with advanced planning, tracking, and analytics
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <Button
                    onClick={() => navigate("/browse-cards")}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Cards
                  </Button>
                  <Button
                    onClick={() => navigate("/spending-analytics")}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Smart Analytics
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Cards"
                value="34+"
                subtitle="Major issuers"
                icon={Award}
                gradient="blue"
              />
              <StatsCard
                title="Categories"
                value="10+"
                subtitle="Spending types"
                icon={Star}
                gradient="green"
              />
              <StatsCard
                title="Avg Savings"
                value="$180"
                subtitle="Per year"
                icon={TrendingUp}
                gradient="purple"
                trend="up"
                trendValue="+23%"
              />
              <StatsCard
                title="AI Features"
                value="6"
                subtitle="Smart tools"
                icon={Zap}
                gradient="amber"
              />
            </div>

            {/* Advanced Tools Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/reward-calculator")}
                variant="outline"
                className="h-20 flex-col bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-green-200 hover:bg-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-1">🧮</div>
                <span className="text-sm font-medium">Reward Calculator</span>
              </Button>
              <Button
                onClick={() => navigate("/welcome-bonus-tracker")}
                variant="outline"
                className="h-20 flex-col bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 border-purple-200 hover:bg-purple-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-1">🎁</div>
                <span className="text-sm font-medium">Bonus Tracker</span>
              </Button>
              <Button
                onClick={() => navigate("/card-comparison")}
                variant="outline"
                className="h-20 flex-col bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 border-blue-200 hover:bg-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-1">📊</div>
                <span className="text-sm font-medium">Compare Cards</span>
              </Button>
              <Button
                onClick={() => navigate("/spending-analytics")}
                variant="outline"
                className="h-20 flex-col bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 border-orange-200 hover:bg-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-1">📊</div>
                <span className="text-sm font-medium">Smart Analytics</span>
              </Button>
            </div>

            {/* New Advanced Features Row */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                onClick={() => navigate("/insights-dashboard")}
                variant="outline"
                className="h-16 flex-col bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 border-purple-200 hover:bg-purple-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-lg mb-1">🧠</div>
                <span className="text-xs font-medium">AI Insights</span>
              </Button>
              <Button
                onClick={() => navigate("/history")}
                variant="outline"
                className="h-16 flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-indigo-200 hover:bg-indigo-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-lg mb-1">📈</div>
                <span className="text-xs font-medium">Activity</span>
              </Button>
              <Button
                onClick={() => navigate("/browse-cards")}
                variant="outline"
                className="h-16 flex-col bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900 dark:to-cyan-900 border-teal-200 hover:bg-teal-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-lg mb-1">💳</div>
                <span className="text-xs font-medium">Browse</span>
              </Button>
              <Button
                onClick={() => navigate("/my-cards")}
                variant="outline"
                className="h-16 flex-col bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 border-rose-200 hover:bg-rose-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-lg mb-1">⭐</div>
                <span className="text-xs font-medium">My Cards</span>
              </Button>
            </div>

            {/* Search for Store - Enhanced */}
            <GradientCard gradient="indigo">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Search className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find Best Card for Store</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered recommendations for 50+ major US businesses
                  </p>
                </div>
              </div>
              <LocationDetector onStoreSelect={handleStoreSelect} />
              
              {/* Popular stores quick access */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Popular Stores:</p>
                <div className="flex flex-wrap gap-2">
                  {["Amazon", "Target", "Walmart", "Starbucks", "Costco"].map((store) => (
                    <Badge 
                      key={store}
                      variant="outline" 
                      className="cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      {store}
                    </Badge>
                  ))}
                </div>
              </div>
            </GradientCard>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        {selectedStore && recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/card-comparison")}
                variant="outline"
                className="bg-white rounded-xl p-4 shadow-sm border-surface-variant hover:shadow-md h-auto flex-col"
              >
                <Scale className="w-5 h-5 text-primary mb-2" />
                <span className="text-sm font-medium text-on-surface">Compare Cards</span>
              </Button>
              <Button
                onClick={() => navigate("/purchase-planner")}
                variant="outline"
                className="bg-white rounded-xl p-4 shadow-sm border-surface-variant hover:shadow-md h-auto flex-col"
              >
                <Bookmark className="w-5 h-5 text-primary mb-2" />
                <span className="text-sm font-medium text-on-surface">Plan Purchase</span>
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

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Sparkles}
        gradient="purple"
        onClick={() => navigate("/insights-dashboard")}
        label="AI"
      />
    </div>
  );
}
