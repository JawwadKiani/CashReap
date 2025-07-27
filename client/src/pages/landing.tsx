import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Search, Shield } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-24" />
          </div>
          <h1 className="text-4xl font-bold text-on-surface mb-4">Welcome to CashReap</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            Harvest Your Rewards - Find the best credit card for maximum cash back at any major US business
          </p>
        </header>

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

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready to Start Harvesting?</CardTitle>
              <CardDescription>
                Create an account to access personalized recommendations and save your favorite cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={handleSignUp}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  Sign Up
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
              
              <div className="text-xs text-on-surface-variant">
                Multiple secure authentication options available
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 text-sm text-on-surface-variant">
          <p>Join thousands of users maximizing their credit card rewards</p>
        </div>
      </div>
    </div>
  );
}