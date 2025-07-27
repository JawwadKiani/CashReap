import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function History() {
  const { user } = useAuth();

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: [`/api/search-history/${user?.id}`],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex flex-col items-center">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-32 mb-2" />
            <h1 className="text-xl font-bold text-on-surface">Search History</h1>
            <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {searchHistory && searchHistory.length > 0 ? (
          <div className="space-y-3">
            {searchHistory.map((search: any) => (
              <Card key={search.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className={`${search.store.category.iconClass} text-primary`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-on-surface">{search.store.name}</h3>
                      <p className="text-sm text-on-surface-variant">{search.store.category.name}</p>
                      {search.store.address && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-on-surface-variant" />
                          <p className="text-xs text-on-surface-variant truncate">{search.store.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(search.searchedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(search.searchedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-2">No Search History</h2>
            <p className="text-on-surface-variant">
              Your store searches will appear here once you start using the app.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
