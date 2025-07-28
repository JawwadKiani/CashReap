import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Sparkles,
  CheckCircle,
  Gift,
  DollarSign
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const SAMPLE_CARDS = [
  {
    id: "chase-freedom-flex",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    rewardRate: "5%",
    category: "rotating categories",
    annualFee: 0,
    description: "5% cash back on rotating categories (up to $1,500 each quarter)"
  },
  {
    id: "citi-double-cash",
    name: "Citi Double Cash Card",
    issuer: "Citi",
    rewardRate: "2%",
    category: "all purchases",
    annualFee: 0,
    description: "2% cash back on all purchases (1% when you buy, 1% when you pay)"
  },
  {
    id: "amex-gold",
    name: "Gold Card",
    issuer: "American Express",
    rewardRate: "4X",
    category: "dining & groceries",
    annualFee: 250,
    description: "4X points at restaurants and up to $25k annually at grocery stores"
  }
];

const SAMPLE_STORES = [
  { name: "Starbucks", category: "Dining", bestCard: "Chase Freedom Flex", reward: "5%" },
  { name: "Target", category: "Department", bestCard: "Citi Double Cash", reward: "2%" },
  { name: "Whole Foods", category: "Grocery", bestCard: "Gold Card", reward: "4X" }
];

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSampleRecommendation, setShowSampleRecommendation] = useState(false);

  const steps = [
    {
      title: "Welcome to CashReap",
      subtitle: "Harvest Your Rewards",
      content: "Get personalized credit card recommendations for maximum cash back at any store"
    },
    {
      title: "How It Works",
      subtitle: "Simple 3-Step Process",
      content: "Find stores, get recommendations, save money"
    },
    {
      title: "See It In Action",
      subtitle: "Sample Recommendation",
      content: "Here's how CashReap finds the best card for you"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-4">
            {currentStep === 0 && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-green-500 rounded-full flex items-center justify-center">
                <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-12 w-12" />
              </div>
            )}
            {currentStep === 1 && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            )}
            {currentStep === 2 && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            )}
            
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg font-medium text-primary">
              {steps[currentStep].subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  {steps[currentStep].content}
                </p>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🏪</div>
                    <div className="text-xs font-medium">50+ Stores</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">💳</div>
                    <div className="text-xs font-medium">34+ Cards</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="text-xs font-medium">AI Powered</div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-200">Save Money</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Users typically save $500+ annually by optimizing their credit card rewards
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <div className="font-medium">Choose a Store</div>
                      <div className="text-sm text-muted-foreground">Browse or search 50+ major retailers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <div className="font-medium">Get AI Recommendations</div>
                      <div className="text-sm text-muted-foreground">See the best cards for maximum rewards</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <div className="font-medium">Save Money</div>
                      <div className="text-sm text-muted-foreground">Harvest more rewards on every purchase</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Smart Features</span>
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Personal card tracking</li>
                    <li>• Spending analytics</li>
                    <li>• AI-powered insights</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-muted-foreground mb-4">
                    Let's see CashReap in action with a sample recommendation
                  </p>
                  
                  {!showSampleRecommendation ? (
                    <Button 
                      onClick={() => setShowSampleRecommendation(true)}
                      className="bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Find Best Card for Starbucks
                    </Button>
                  ) : (
                    <div className="space-y-3 text-left">
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">Best Match Found!</span>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Chase Freedom Flex</div>
                            <Badge className="bg-green-100 text-green-700">5% Cash Back</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Dining category (Q4 2025)
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            💰 Save $50 on $1,000 Starbucks spending
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button 
                          onClick={handleNext}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Start Finding My Best Cards
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={currentStep === 0 ? onSkip : handlePrevious}
                disabled={showSampleRecommendation && currentStep === 2}
              >
                {currentStep === 0 ? "Skip" : "Previous"}
              </Button>
              
              {!(currentStep === 2 && showSampleRecommendation) && (
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        {currentStep > 0 && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Skip tutorial and explore the app
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}