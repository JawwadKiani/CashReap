import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, User, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { LocalSearchHistory } from "@/lib/local-storage";

export default function History() {
  const { user } = useAuth();
  const [localHistory, setLocalHistory] = useState<LocalSearchHistory[]>([]);

  const { data: apiSearchHistory, isLoading } = useQuery({
    queryKey: [`/api/search-history/${user?.id}`],
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      import("@/lib/local-storage").then(({ getSearchHistory }) => {
        setLocalHistory(getSearchHistory());
      });
    }
  }, [user]);

  const searchHistory = user ? apiSearchHistory : localHistory;

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
        {!user && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Local History</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              Your search history is stored locally. Sign in to sync across devices.
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              variant="outline"
              size="sm"
            >
              Sign In
            </Button>
          </div>
        )}

        {searchHistory && searchHistory.length > 0 ? (
          <div className="space-y-3">
            {searchHistory.map((search: any) => (
              <Card key={search.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-on-surface">
                        {user ? search.store?.name : search.storeName}
                      </h3>
                      <p className="text-sm text-on-surface-variant">Store Search</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(user ? search.searchedAt : search.searchedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(user ? search.searchedAt : search.searchedAt).toLocaleTimeString([], { 
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
