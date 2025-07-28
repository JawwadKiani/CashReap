import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronRight, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Store {
  id: string;
  name: string;
  categoryId: string;
  isOnline?: boolean;
}

interface StoreBrowserProps {
  onStoreSelect: (store: Store) => void;
  selectedStore?: Store | null;
  onClose?: () => void;
}

const CATEGORY_INFO = {
  dining: { name: "Dining & Restaurants", icon: "🍽️", color: "bg-orange-100 text-orange-700" },
  grocery: { name: "Grocery Stores", icon: "🛒", color: "bg-green-100 text-green-700" },
  gas: { name: "Gas Stations", icon: "⛽", color: "bg-blue-100 text-blue-700" },
  department: { name: "Department Stores", icon: "🏬", color: "bg-purple-100 text-purple-700" },
  warehouse: { name: "Warehouse Clubs", icon: "📦", color: "bg-amber-100 text-amber-700" },
  online: { name: "Online Shopping", icon: "💻", color: "bg-indigo-100 text-indigo-700" },
  drugstores: { name: "Pharmacies", icon: "💊", color: "bg-pink-100 text-pink-700" },
  travel: { name: "Travel", icon: "✈️", color: "bg-cyan-100 text-cyan-700" },
  streaming: { name: "Streaming Services", icon: "📺", color: "bg-red-100 text-red-700" },
  entertainment: { name: "Entertainment", icon: "🎮", color: "bg-purple-100 text-purple-700" },
  fitness: { name: "Fitness & Wellness", icon: "💪", color: "bg-emerald-100 text-emerald-700" },
  electronics: { name: "Electronics", icon: "📱", color: "bg-slate-100 text-slate-700" },
  home: { name: "Home Improvement", icon: "🔨", color: "bg-orange-100 text-orange-700" },
  clothing: { name: "Clothing & Fashion", icon: "👕", color: "bg-rose-100 text-rose-700" },
  telecom: { name: "Telecommunications", icon: "📞", color: "bg-blue-100 text-blue-700" },
  transit: { name: "Transit", icon: "🚗", color: "bg-yellow-100 text-yellow-700" },
  automotive: { name: "Automotive", icon: "🚙", color: "bg-gray-100 text-gray-700" },
  utilities: { name: "Utilities", icon: "⚡", color: "bg-lime-100 text-lime-700" },
  financial: { name: "Financial Services", icon: "🏦", color: "bg-teal-100 text-teal-700" },
  insurance: { name: "Insurance", icon: "🛡️", color: "bg-violet-100 text-violet-700" }
};

const POPULAR_STORES = [
  "amazon", "target", "walmart", "starbucks", "mcdonalds", "whole-foods", 
  "costco", "shell", "chevron", "home-depot", "best-buy", "cvs",
  "netflix", "spotify", "disney-plus", "uber", "lyft", "planet-fitness",
  "apple-store", "gap", "amc-theaters"
];

export function StoreBrowser({ onStoreSelect, selectedStore, onClose }: StoreBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Filter stores based on search term
  const filteredStores = stores.filter((store: Store) => {
    return store.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group stores by category
  const storesByCategory = stores.reduce((acc: Record<string, Store[]>, store: Store) => {
    if (!acc[store.categoryId]) acc[store.categoryId] = [];
    acc[store.categoryId].push(store);
    return acc;
  }, {});

  // Get popular stores
  const popularStores = stores.filter((store: Store) => 
    POPULAR_STORES.includes(store.id)
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const StoreCard = ({ store }: { store: Store }) => {
    const categoryInfo = CATEGORY_INFO[store.categoryId as keyof typeof CATEGORY_INFO];
    const isSelected = selectedStore?.id === store.id;
    
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "ring-2 ring-primary bg-primary/5" : ""
        }`}
        onClick={() => onStoreSelect(store)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="text-xl">{categoryInfo?.icon || "🏪"}</div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{store.name}</h3>
              <Badge variant="outline" className={`text-xs mt-1 ${categoryInfo?.color || ""}`}>
                {categoryInfo?.name || "Other"}
              </Badge>
            </div>
            {store.isOnline && (
              <Badge variant="secondary" className="text-xs">Online</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CategorySection = ({ categoryId, stores }: { categoryId: string; stores: Store[] }) => {
    const categoryInfo = CATEGORY_INFO[categoryId as keyof typeof CATEGORY_INFO];
    const isExpanded = expandedCategories.has(categoryId);
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleCategory(categoryId)}
          className="w-full p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{categoryInfo?.icon || "🏪"}</span>
            <div className="text-left">
              <h3 className="font-semibold text-sm">{categoryInfo?.name || categoryId}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stores.length} stores</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 space-y-2 bg-white dark:bg-gray-900">
            {stores.map((store) => (
              <div 
                key={store.id}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => onStoreSelect(store)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryInfo?.icon || "🏪"}</span>
                  <span className="font-medium text-sm">{store.name}</span>
                  {store.isOnline && (
                    <Badge variant="secondary" className="text-xs ml-auto">Online</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Choose a Store</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {searchTerm ? (
          // Search Results
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-600">Search Results ({filteredStores.length})</h3>
            {filteredStores.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No stores found</p>
            ) : (
              <div className="space-y-2">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Popular Stores */}
            {popularStores.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-sm">Popular Stores</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {popularStores.slice(0, 6).map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Browse by Category</h3>
              <div className="space-y-2">
                {Object.entries(storesByCategory).map(([categoryId, categoryStores]) => (
                  <CategorySection
                    key={categoryId}
                    categoryId={categoryId}
                    stores={categoryStores}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}