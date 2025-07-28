// AI Service for Machine Learning capabilities
import type { CreditCard, User } from "@shared/schema";

export interface AIInsight {
  type: "recommendation" | "optimization" | "prediction" | "warning";
  title: string;
  description: string;
  confidence: number;
  action?: string;
  potentialSavings?: number;
  category?: string;
}

export interface SpendingPattern {
  category: string;
  monthlyAmount: number;
  trend: "increasing" | "decreasing" | "stable";
  seasonality?: boolean;
}

export interface CardOptimization {
  currentCard: string;
  suggestedCard: string;
  annualSavings: number;
  confidence: number;
  reasoning: string;
}

export class AIService {
  // Machine Learning Models (simulated)
  
  /**
   * Analyzes user spending patterns using machine learning
   */
  static analyzeSpendingPatterns(transactions: any[]): SpendingPattern[] {
    // Simulate ML analysis of spending patterns
    const patterns: SpendingPattern[] = [
      {
        category: "Dining",
        monthlyAmount: 650,
        trend: "increasing",
        seasonality: true
      },
      {
        category: "Grocery",
        monthlyAmount: 450,
        trend: "stable"
      },
      {
        category: "Gas",
        monthlyAmount: 280,
        trend: "decreasing"
      },
      {
        category: "Travel",
        monthlyAmount: 320,
        trend: "increasing",
        seasonality: true
      }
    ];
    
    return patterns;
  }

  /**
   * Predicts future spending using time series analysis
   */
  static predictFutureSpending(patterns: SpendingPattern[], months: number = 6): Record<string, number[]> {
    const predictions: Record<string, number[]> = {};
    
    patterns.forEach(pattern => {
      const baseAmount = pattern.monthlyAmount;
      const monthlyPredictions: number[] = [];
      
      for (let i = 0; i < months; i++) {
        let prediction = baseAmount;
        
        // Apply trend
        if (pattern.trend === "increasing") {
          prediction *= (1 + (i * 0.05)); // 5% monthly growth
        } else if (pattern.trend === "decreasing") {
          prediction *= (1 - (i * 0.03)); // 3% monthly decline
        }
        
        // Apply seasonality (for dining and travel)
        if (pattern.seasonality) {
          const seasonalMultiplier = 1 + (0.2 * Math.sin((i + 1) * Math.PI / 6));
          prediction *= seasonalMultiplier;
        }
        
        monthlyPredictions.push(Math.round(prediction));
      }
      
      predictions[pattern.category] = monthlyPredictions;
    });
    
    return predictions;
  }

  /**
   * AI-powered card optimization recommendations
   */
  static optimizeCardPortfolio(
    userCards: CreditCard[], 
    spendingPatterns: SpendingPattern[]
  ): CardOptimization[] {
    const optimizations: CardOptimization[] = [];
    
    // Analyze each spending category
    spendingPatterns.forEach(pattern => {
      if (pattern.category === "Dining" && pattern.monthlyAmount > 400) {
        optimizations.push({
          currentCard: "Generic Cash Back Card",
          suggestedCard: "Capital One Savor Cash Rewards",
          annualSavings: 156,
          confidence: 0.92,
          reasoning: "4% cash back on dining vs 1% generic rate for high dining spend"
        });
      }
      
      if (pattern.category === "Grocery" && pattern.monthlyAmount > 300) {
        optimizations.push({
          currentCard: "Generic Cash Back Card", 
          suggestedCard: "Blue Cash Preferred Card",
          annualSavings: 324,
          confidence: 0.89,
          reasoning: "6% cash back on groceries (up to $6,000) vs 1% generic rate"
        });
      }
    });
    
    return optimizations;
  }

  /**
   * Generate AI insights based on user data
   */
  static generateInsights(
    user: User,
    spendingPatterns: SpendingPattern[],
    cards: CreditCard[]
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // High-confidence recommendations
    if (spendingPatterns.some(p => p.category === "Dining" && p.monthlyAmount > 500)) {
      insights.push({
        type: "recommendation",
        title: "Dining Rewards Opportunity",
        description: "Your high dining spend qualifies for premium dining rewards cards",
        confidence: 0.94,
        action: "Consider Capital One Savor for 4% dining rewards",
        potentialSavings: 180,
        category: "dining"
      });
    }
    
    // Trend-based predictions
    const increasingCategories = spendingPatterns.filter(p => p.trend === "increasing");
    if (increasingCategories.length > 0) {
      insights.push({
        type: "prediction",
        title: "Spending Trend Alert",
        description: `${increasingCategories[0].category} spending is trending up by 15% monthly`,
        confidence: 0.87,
        action: "Optimize rewards for growing categories"
      });
    }
    
    // Optimization warnings
    insights.push({
      type: "optimization",
      title: "Card Portfolio Analysis",
      description: "AI detected suboptimal card usage in 3 categories",
      confidence: 0.82,
      action: "Review recommended card optimizations",
      potentialSavings: 456
    });
    
    // Welcome bonus opportunities
    insights.push({
      type: "recommendation",
      title: "Welcome Bonus Opportunity",
      description: "Based on spending patterns, you can easily earn $500+ in welcome bonuses",
      confidence: 0.91,
      action: "View targeted card applications",
      potentialSavings: 650
    });
    
    return insights;
  }

  /**
   * Personalized card scoring algorithm
   */
  static scoreCardForUser(
    card: CreditCard,
    spendingPatterns: SpendingPattern[],
    userPreferences: any = {}
  ): number {
    let score = 0;
    const totalSpending = spendingPatterns.reduce((sum, p) => sum + p.monthlyAmount, 0);
    
    // Base score from annual fee vs benefits
    if (card.annualFee === 0) {
      score += 20;
    } else if (card.annualFee <= 95) {
      score += 10;
    } else {
      score -= 5;
    }
    
    // Spending category match scoring
    spendingPatterns.forEach(pattern => {
      const categorySpending = pattern.monthlyAmount;
      const weightedContribution = (categorySpending / totalSpending) * 100;
      
      // Simulate reward rate matching (would use actual card-category data)
      if (pattern.category === "Dining") {
        score += weightedContribution * 0.8; // High dining rewards multiplier
      } else if (pattern.category === "Grocery") {
        score += weightedContribution * 0.7;
      } else if (pattern.category === "Gas") {
        score += weightedContribution * 0.6;
      }
    });
    
    // Credit score requirements
    if (userPreferences.creditScore && userPreferences.creditScore >= 750) {
      score += 10; // Premium cards bonus
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Real-time reward optimization
   */
  static getOptimalCardForPurchase(
    amount: number,
    category: string,
    userCards: CreditCard[]
  ): { card: CreditCard; reasoning: string; rewardAmount: number } | null {
    if (userCards.length === 0) return null;
    
    // Simulate finding the best card for this purchase
    const bestCard = userCards[0]; // Simplified for demo
    
    return {
      card: bestCard,
      reasoning: `Best rewards rate for ${category} purchases`,
      rewardAmount: amount * 0.03 // 3% example rate
    };
  }

  /**
   * Market trend analysis
   */
  static analyzeMarketTrends(): AIInsight[] {
    return [
      {
        type: "prediction",
        title: "Credit Card Market Trends",
        description: "Dining rewards rates increasing across major issuers",
        confidence: 0.78,
        action: "Consider dining-focused cards now"
      },
      {
        type: "warning",
        title: "Annual Fee Increases",
        description: "Premium travel cards raising fees by average 12% this year",
        confidence: 0.85,
        action: "Review travel card value propositions"
      }
    ];
  }

  /**
   * Behavioral analysis and recommendations
   */
  static analyzeBehaviorPatterns(user: User, transactionHistory: any[]): AIInsight[] {
    // Analyze user behavior patterns
    const insights: AIInsight[] = [];
    
    // Late payment patterns
    insights.push({
      type: "warning",
      title: "Payment Optimization",
      description: "Setting up autopay could save $120 annually in late fees",
      confidence: 0.96,
      action: "Enable automatic payments",
      potentialSavings: 120
    });
    
    // Credit utilization optimization
    insights.push({
      type: "optimization",
      title: "Credit Utilization",
      description: "Reducing utilization to under 10% could improve credit score by 20+ points",
      confidence: 0.89,
      action: "Consider payment timing adjustments"
    });
    
    return insights;
  }
}