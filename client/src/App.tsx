import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import CardDetails from "@/pages/card-details";
import MyCards from "@/pages/my-cards";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import CardBrowser from "@/pages/card-browser";
import PurchasePlanner from "@/pages/purchase-planner";
import RewardCalculator from "@/pages/reward-calculator";
import WelcomeBonusTracker from "@/pages/welcome-bonus-tracker";
import CardComparison from "@/pages/card-comparison";
import { Landing } from "@/pages/landing";
import { SignIn, SignUp } from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </>
      ) : (
        <>
          <div className="pb-16"> {/* Add padding for bottom navigation */}
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/card/:id" component={CardDetails} />
              <Route path="/my-cards" component={MyCards} />
              <Route path="/history" component={History} />
              <Route path="/settings" component={Settings} />
              <Route path="/browse-cards" component={CardBrowser} />
              <Route path="/purchase-planner" component={PurchasePlanner} />
              <Route path="/reward-calculator" component={RewardCalculator} />
              <Route path="/welcome-bonus-tracker" component={WelcomeBonusTracker} />
              <Route path="/card-comparison" component={CardComparison} />
              <Route component={NotFound} />
            </Switch>
            <BottomNavigation />
          </div>
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
