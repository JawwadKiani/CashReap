import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNavigation } from "@/components/ui/top-navigation";
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
import SpendingAnalyticsPage from "@/pages/spending-analytics";
import InsightsDashboard from "@/pages/insights-dashboard";
import AIRecommendations from "@/pages/ai-recommendations";
import { Landing } from "@/pages/landing";
import { SignIn, SignUp } from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="pt-16"> {/* Add padding for top navigation */}
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
        <Route path="/spending-analytics" component={SpendingAnalyticsPage} />
        <Route path="/insights-dashboard" component={InsightsDashboard} />
        <Route path="/ai-recommendations" component={AIRecommendations} />
        {/* Auth pages - available but not required */}
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/landing" component={Landing} />
        <Route component={NotFound} />
      </Switch>
      <TopNavigation />
    </div>
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
