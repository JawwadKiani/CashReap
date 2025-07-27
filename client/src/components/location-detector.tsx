import { useState } from "react";
import { Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { StoreWithCategory } from "@shared/schema";

interface BusinessSearchProps {
  onStoreSelect: (store: StoreWithCategory) => void;
  selectedStore?: StoreWithCategory | null;
}

export function LocationDetector({ onStoreSelect, selectedStore }: BusinessSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: [`/api/stores/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 2,
  });

  return (
    <div className="space-y-3">
      {/* Current Store Display */}
      {selectedStore && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Store className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface">{selectedStore.name}</p>
            <p className="text-xs text-on-surface-variant">{selectedStore.category.name}</p>
          </div>
        </div>
      )}

      {/* Business Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for any US business..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
      </div>

      {/* Search Results */}
      {searchQuery.length > 2 && (
        <div className="space-y-2">
          {searchLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="bg-white rounded-lg border border-surface-variant max-h-48 overflow-y-auto">
              {searchResults.map((store: StoreWithCategory) => (
                <button
                  key={store.id}
                  onClick={() => onStoreSelect(store)}
                  className="w-full p-3 text-left hover:bg-surface transition-colors border-b border-surface-variant last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${store.category.iconClass} text-on-surface-variant`} />
                    <div>
                      <p className="text-sm font-medium text-on-surface">{store.name}</p>
                      <p className="text-xs text-on-surface-variant">{store.category.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-on-surface-variant">No businesses found</p>
            </div>
          )}
        </div>
      )}

      {/* Popular Business Suggestions - only show when typing */}
      {searchQuery.length > 0 && searchQuery.length <= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-on-surface">Popular Recommendations</h3>
          <div className="bg-white rounded-lg border border-surface-variant">
            {['Target', 'Walmart', 'Amazon', 'Starbucks', 'McDonald\'s']
              .filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="w-full p-3 text-left hover:bg-surface transition-colors border-b border-surface-variant last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-on-surface-variant" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">{suggestion}</p>
                    <p className="text-xs text-on-surface-variant">Popular chain</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}