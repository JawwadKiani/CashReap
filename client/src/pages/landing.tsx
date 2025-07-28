import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Search, Shield } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import { GuestCardFinder } from "@/components/guest-card-finder";
import { UniqueFeaturesSection } from "@/components/unique-features-section";
import { TrendingSection } from "@/components/trending-section";
import { SmartInsightsSection } from "@/components/smart-insights-section";
import { InnovationHighlights } from "@/components/innovation-highlights";
import { RewardsForecast } from "@/components/rewards-forecast";

export function Landing() {
  const [, navigate] = useWouterLocation();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleReplitLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <svg width="200" height="200" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <ellipse cx="210" cy="155" rx="15" ry="8" fill="#22C55E" transform="rotate(15 210 155)"/>
              <path d="M205 160 Q210 155 215 150" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
              <circle cx="220" cy="150" r="6" fill="#F59E0B"/>
              <text x="220" y="154" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-4">Welcome to CashReap</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            Harvest Your Rewards - Find the best credit card for maximum cash back at any major US business
          </p>
        </header>

        {/* Guest Card Finder - Try Before Sign Up */}
        <div className="max-w-2xl mx-auto mb-12">
          <GuestCardFinder onSignUpClick={handleSignUp} />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Search className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search any major US business and get instant credit card recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Rotating Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Stay updated with current quarter rotating categories that are active right now
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">34+ Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive database of cards from all major US issuers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data is secure and we never share your personal information
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Trending/Hot This Quarter */}
        <div className="max-w-4xl mx-auto mb-12">
          <TrendingSection />
        </div>

        {/* Smart AI Features */}
        <div className="max-w-4xl mx-auto mb-12">
          <SmartInsightsSection />
        </div>

        {/* Innovation Highlights */}
        <div className="max-w-4xl mx-auto mb-12">
          <InnovationHighlights />
        </div>

        {/* Rewards Forecast */}
        <div className="max-w-5xl mx-auto mb-12">
          <RewardsForecast onGetStarted={handleSignUp} />
        </div>

        {/* Competitive Differentiation */}
        <div className="max-w-4xl mx-auto mb-12">
          <UniqueFeaturesSection />
        </div>

        {/* Sign Up Call to Action */}
        <div className="text-center mb-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready for Full Access?</CardTitle>
              <CardDescription>
                Sign up to save your favorite cards, track search history, and get personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={handleSignUp}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  Sign Up Free
                </Button>
                <Button 
                  onClick={handleSignIn}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Sign In
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-variant"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-on-surface-variant">Or</span>
                </div>
              </div>

              <Button 
                onClick={handleReplitLogin}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue with Replit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-on-surface-variant">
          <p>Join thousands of users maximizing their credit card rewards</p>
        </div>
      </div>
    </div>
  );
}