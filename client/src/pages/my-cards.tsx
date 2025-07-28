import { useState, useEffect } from "react";
import { EnhancedMyCards } from "@/components/enhanced-my-cards";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreditCard, Trash2, Star, DollarSign } from "lucide-react";
import type { LocalSavedCard } from "@/lib/local-storage";

export default function MyCards() {
  const { user } = useAuth();
  const [localSavedCards, setLocalSavedCards] = useState<LocalSavedCard[]>([]);

  useEffect(() => {
    if (!user) {
      import("@/lib/local-storage").then(({ getSavedCards }) => {
        setLocalSavedCards(getSavedCards());
      });
    }
  }, [user]);

  const handleRemoveCard = async (cardId: string) => {
    const { removeSavedCard, getSavedCards } = await import("@/lib/local-storage");
    removeSavedCard(cardId);
    setLocalSavedCards(getSavedCards());
  };

  // Show local saved cards if not logged in and have cards
  if (!user && localSavedCards.length > 0) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex flex-col items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="140" y="180" width="120" height="80" rx="8" fill="#F59E0B" stroke="#000" strokeWidth="2"/>
                <rect x="140" y="195" width="120" height="12" fill="#000"/>
                <circle cx="220" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                <circle cx="235" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                <path d="M180 180 Q185 140 200 120 Q210 110 220 105" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M220 105 L225 85" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M220 90 L225 85 L230 90" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="195" cy="135" rx="25" ry="15" fill="#22C55E" transform="rotate(-30 195 135)"/>
                <path d="M180 140 Q195 135 205 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                <circle cx="185" cy="125" r="8" fill="#F59E0B"/>
                <text x="185" y="130" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
                <ellipse cx="240" cy="125" rx="20" ry="12" fill="#22C55E" transform="rotate(45 240 125)"/>
                <path d="M225 115 Q240 125 250 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                <circle cx="250" cy="115" r="8" fill="#F59E0B"/>
                <text x="250" y="120" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
              </svg>
              <h1 className="text-xl font-bold text-on-surface">My Saved Cards</h1>
              <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-4 space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-on-surface-variant mb-4">
              {localSavedCards.length} card{localSavedCards.length !== 1 ? 's' : ''} saved locally
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              variant="outline"
              size="sm"
            >
              Sign in to sync across devices
            </Button>
          </div>

          <div className="space-y-3">
            {localSavedCards.map((savedCard) => (
              <Card key={savedCard.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-on-surface">{savedCard.name}</h3>
                    <p className="text-sm text-on-surface-variant">{savedCard.issuer}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{savedCard.baseRewardRate}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm">${savedCard.annualFee}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCard(savedCard.cardId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => window.open(`/apply/${savedCard.cardId}`, '_blank')}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex flex-col items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="140" y="180" width="120" height="80" rx="8" fill="#F59E0B" stroke="#000" strokeWidth="2"/>
                <rect x="140" y="195" width="120" height="12" fill="#000"/>
                <circle cx="220" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                <circle cx="235" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                <path d="M180 180 Q185 140 200 120 Q210 110 220 105" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M220 105 L225 85" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M220 90 L225 85 L230 90" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="195" cy="135" rx="25" ry="15" fill="#22C55E" transform="rotate(-30 195 135)"/>
                <path d="M180 140 Q195 135 205 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                <circle cx="185" cy="125" r="8" fill="#F59E0B"/>
                <text x="185" y="130" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
                <ellipse cx="240" cy="125" rx="20" ry="12" fill="#22C55E" transform="rotate(45 240 125)"/>
                <path d="M225 115 Q240 125 250 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                <circle cx="250" cy="115" r="8" fill="#F59E0B"/>
                <text x="250" y="120" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
              </svg>
              <h1 className="text-xl font-bold text-on-surface">My Cards</h1>
              <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Sign in to save cards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-on-surface-variant">
                Create an account to save your favorite credit cards and track your rewards
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Browse Cards Instead
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex flex-col items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="140" y="180" width="120" height="80" rx="8" fill="#F59E0B" stroke="#000" strokeWidth="2"/>
              <rect x="140" y="195" width="120" height="12" fill="#000"/>
              <circle cx="220" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
              <circle cx="235" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
              <path d="M180 180 Q185 140 200 120 Q210 110 220 105" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M220 105 L225 85" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M220 90 L225 85 L230 90" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <ellipse cx="195" cy="135" rx="25" ry="15" fill="#22C55E" transform="rotate(-30 195 135)"/>
              <path d="M180 140 Q195 135 205 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
              <circle cx="185" cy="125" r="8" fill="#F59E0B"/>
              <text x="185" y="130" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
              <ellipse cx="240" cy="125" rx="20" ry="12" fill="#22C55E" transform="rotate(45 240 125)"/>
              <path d="M225 115 Q240 125 250 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
              <circle cx="250" cy="115" r="8" fill="#F59E0B"/>
              <text x="250" y="120" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
            </svg>
            <h1 className="text-xl font-bold text-on-surface">My Cards</h1>
            <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <EnhancedMyCards />
      </main>
    </div>
  );
}