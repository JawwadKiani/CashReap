import { SpendingAnalytics } from "@/components/spending-analytics";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SpendingAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Spending Analytics</h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and optimize your credit card rewards
            </p>
          </div>
        </div>

        <SpendingAnalytics />
      </div>
    </div>
  );
}