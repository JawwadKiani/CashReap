import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation as useWouterLocation } from "wouter";
import { Search, Filter, ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { CreditCard } from "@shared/schema";

export default function CardBrowser() {
  const [, navigate] = useWouterLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [filterByIssuer, setFilterByIssuer] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["/api/credit-cards"],
  });

  // Get user's saved cards
  const { data: savedCards = [] } = useQuery({
    queryKey: [`/api/saved-cards/${user?.id}`],
    enabled: !!user?.id,
  });

  // Filter and sort cards
  const filteredCards = cards?.filter((card: CreditCard) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIssuer = filterByIssuer === "all" || card.issuer === filterByIssuer;
    return matchesSearch && matchesIssuer;
  }) || [];

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "issuer":
        return a.issuer.localeCompare(b.issuer);
      case "annualFee":
        return a.annualFee - b.annualFee;
      case "baseReward":
        return parseFloat(b.baseReward) - parseFloat(a.baseReward);
      default:
        return 0;
    }
  });

  // Get unique issuers for filter
  const issuers = Array.from(new Set(cards?.map((card: CreditCard) => card.issuer) || [])).sort();

  const handleCardClick = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Check if card is saved
  const isCardSaved = (cardId: string) => {
    return savedCards.some((saved: any) => saved.cardId === cardId);
  };

  // Save card mutation
  const saveCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await apiRequest("POST", "/api/saved-cards", { cardId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
      toast({
        title: "Card Saved",
        description: "Card added to your collection.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save card. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Unsave card mutation
  const unsaveCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await apiRequest("DELETE", `/api/saved-cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-cards/${user?.id}`] });
      toast({
        title: "Card Removed",
        description: "Card removed from your collection.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to remove card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveToggle = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation(); // Prevent card click navigation
    if (isCardSaved(cardId)) {
      unsaveCardMutation.mutate(cardId);
    } else {
      saveCardMutation.mutate(cardId);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-on-surface flex-1 text-center">Browse Cards</h1>
            <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <Input
              type="text"
              placeholder="Search cards by name or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="issuer">Issuer</SelectItem>
              <SelectItem value="annualFee">Annual Fee</SelectItem>
              <SelectItem value="baseReward">Base Reward</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterByIssuer} onValueChange={setFilterByIssuer}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Issuers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issuers</SelectItem>
              {issuers.map((issuer) => (
                <SelectItem key={issuer} value={issuer}>
                  {issuer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-on-surface-variant">
          {isLoading ? "Loading..." : `${sortedCards.length} cards found`}
        </div>

        {/* Cards List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : sortedCards.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              No cards found matching your search criteria.
            </div>
          ) : (
            sortedCards.map((card: CreditCard) => (
              <Card 
                key={card.id} 
                className="hover:shadow-md transition-shadow relative"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 cursor-pointer" onClick={() => handleCardClick(card.id)}>
                      <CardTitle className="text-lg hover:text-primary transition-colors">{card.name}</CardTitle>
                      <CardDescription>{card.issuer}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">
                          {card.baseReward}% base
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          ${card.annualFee}/year
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isCardSaved(card.id) ? "destructive" : "default"}
                        className="w-8 h-8 p-0 shrink-0"
                        onClick={(e) => handleSaveToggle(e, card.id)}
                        disabled={saveCardMutation.isPending || unsaveCardMutation.isPending}
                      >
                        {isCardSaved(card.id) ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {card.annualFee === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          No Annual Fee
                        </Badge>
                      )}
                      {card.minCreditScore && (
                        <Badge variant="outline" className="text-xs">
                          {card.minCreditScore}+ Credit Score
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-on-surface-variant cursor-pointer" onClick={() => handleCardClick(card.id)}>
                      Tap for details
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}