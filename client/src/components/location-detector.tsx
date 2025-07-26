import { useState } from "react";
import { MapPin, Search, Crosshair } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/hooks/use-location";
import type { StoreWithCategory } from "@shared/schema";

interface LocationDetectorProps {
  onStoreSelect: (store: StoreWithCategory) => void;
  selectedStore?: StoreWithCategory | null;
}

export function LocationDetector({ onStoreSelect, selectedStore }: LocationDetectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { location, isLoading: locationLoading, detectLocation, error: locationError } = useLocation();

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/stores/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const { data: nearbyStores } = useQuery({
    queryKey: ["/api/stores/nearby", location?.latitude, location?.longitude],
    enabled: !!location?.latitude && !!location?.longitude,
  });

  return (
    <div className="space-y-3">
      {/* Current Store Display */}
      {selectedStore && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <MapPin className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface">{selectedStore.name}</p>
            <p className="text-xs text-on-surface-variant">{selectedStore.address}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={detectLocation}
            disabled={locationLoading}
            className="text-primary hover:text-primary/80"
          >
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Current Location Display */}
      {location && !selectedStore && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <MapPin className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface">{location.name}</p>
            <p className="text-xs text-on-surface-variant">{location.address}</p>
          </div>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive">{locationError}</p>
        </div>
      )}

      {/* Manual Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a store..."
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
            <div className="p-3 text-center text-on-surface-variant">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mx-auto"></div>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="bg-white rounded-lg border border-surface-variant max-h-48 overflow-y-auto">
              {searchResults.map((store: StoreWithCategory) => (
                <button
                  key={store.id}
                  onClick={() => {
                    onStoreSelect(store);
                    setSearchQuery("");
                  }}
                  className="w-full p-3 text-left hover:bg-surface transition-colors border-b border-surface-variant last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${store.category.iconClass} text-on-surface-variant`} />
                    <div>
                      <p className="text-sm font-medium text-on-surface">{store.name}</p>
                      <p className="text-xs text-on-surface-variant">{store.category.name}</p>
                      {store.address && (
                        <p className="text-xs text-on-surface-variant">{store.address}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 2 ? (
            <div className="p-3 text-center text-on-surface-variant">
              <p className="text-sm">No stores found</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Nearby Stores */}
      {nearbyStores && nearbyStores.length > 0 && !searchQuery && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-on-surface">Nearby Stores</h3>
          <div className="bg-white rounded-lg border border-surface-variant max-h-32 overflow-y-auto">
            {nearbyStores.slice(0, 3).map((store: StoreWithCategory) => (
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
        </div>
      )}
    </div>
  );
}
