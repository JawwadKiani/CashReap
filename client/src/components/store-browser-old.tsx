import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
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
}

const CATEGORY_INFO = {
  dining: { name: "Dining & Restaurants", icon: "🍽️", color: "bg-orange-100 text-orange-700" },
  grocery: { name: "Grocery Stores", icon: "🛒", color: "bg-green-100 text-green-700" },
  gas: { name: "Gas Stations", icon: "⛽", color: "bg-blue-100 text-blue-700" },
  department: { name: "Department Stores", icon: "🏬", color: "bg-purple-100 text-purple-700" },
  warehouse: { name: "Warehouse Clubs", icon: "📦", color: "bg-amber-100 text-amber-700" },
  online: { name: "Online Shopping", icon: "💻", color: "bg-indigo-100 text-indigo-700" },
  drugstores: { name: "Pharmacies", icon: "💊", color: "bg-pink-100 text-pink-700" }
};

const POPULAR_STORES = [
  "amazon", "target", "walmart", "starbucks", "mcdonalds", "whole-foods", 
  "costco", "shell", "chase", "home-depot", "best-buy", "cvs"
];

export function StoreBrowser({ onStoreSelect, selectedStore }: StoreBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
  });

  // Filter stores based on search term and category
  const filteredStores = stores.filter((store: StoreWithCategory) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || store.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group stores by category
  const storesByCategory = stores.reduce((acc: Record<string, StoreWithCategory[]>, store: StoreWithCategory) => {
    if (!acc[store.categoryId]) acc[store.categoryId] = [];
    acc[store.categoryId].push(store);
    return acc;
  }, {});

  // Get popular stores
  const popularStores = stores.filter((store: StoreWithCategory) => 
    POPULAR_STORES.includes(store.id)
  );

  const StoreCard = ({ store }: { store: StoreWithCategory }) => {
    const categoryInfo = CATEGORY_INFO[store.categoryId as keyof typeof CATEGORY_INFO];
    const isSelected = selectedStore?.id === store.id;
    
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "ring-2 ring-primary bg-primary/5" : ""
        }`}
        onClick={() => onStoreSelect(store)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{categoryInfo?.icon || "🏪"}</div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{store.name}</h3>
              <Badge variant="outline" className={`text-xs mt-1 ${categoryInfo?.color || ""}`}>
                {categoryInfo?.name || store.categoryId}
              </Badge>
            </div>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for stores (e.g., Target, Starbucks)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      {!searchTerm && !selectedCategory && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("Starbucks")}
            className="text-xs"
          >
            ☕ Starbucks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("Target")}
            className="text-xs"
          >
            🎯 Target
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("Amazon")}
            className="text-xs"
          >
            📦 Amazon
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory("dining")}
            className="text-xs"
          >
            🍽️ Dining
          </Button>
        </div>
      )}

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {filteredStores.length} stores found
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Store Results */}
          <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1" : "grid-cols-1"}`}>
            {filteredStores.slice(0, 20).map((store: StoreWithCategory) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>

          {filteredStores.length === 0 && searchTerm && (
            <div className="text-center py-8 text-muted-foreground">
              <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No stores found for "{searchTerm}"</p>
              <p className="text-sm">Try searching for popular stores like Target, Walmart, or Starbucks</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-3">
            {popularStores.map((store: StoreWithCategory) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {Object.entries(storesByCategory).map(([categoryId, categoryStores]) => {
            const categoryInfo = CATEGORY_INFO[categoryId as keyof typeof CATEGORY_INFO];
            if (!categoryInfo) return null;

            return (
              <Card key={categoryId}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-lg">{categoryInfo.icon}</span>
                    {categoryInfo.name}
                    <Badge variant="secondary" className="ml-auto">
                      {categoryStores.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {categoryStores.slice(0, 5).map((store: StoreWithCategory) => (
                      <div
                        key={store.id}
                        className={`p-2 rounded cursor-pointer hover:bg-muted transition-colors ${
                          selectedStore?.id === store.id ? "bg-primary/10" : ""
                        }`}
                        onClick={() => onStoreSelect(store)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{store.name}</span>
                          {selectedStore?.id === store.id && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryStores.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory(categoryId)}
                        className="mt-2 text-xs"
                      >
                        View all {categoryStores.length} {categoryInfo.name.toLowerCase()}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Clear Filters */}
      {(searchTerm || selectedCategory) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory(null);
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}