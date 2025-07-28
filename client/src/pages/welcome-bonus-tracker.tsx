import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Gift, Target, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format, differenceInDays, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WelcomeBonusProgress, CreditCard } from "@shared/schema";

export default function WelcomeBonusTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTracker, setNewTracker] = useState({
    cardId: "",
    requiredSpending: "",
    timeframeMonths: "3",
    startDate: new Date(),
  });

  const { data: bonusTrackers = [] } = useQuery<WelcomeBonusProgress[]>({
    queryKey: ["/api/welcome-bonus-tracking", user?.id],
    enabled: !!user?.id,
  });

  const { data: creditCards = [] } = useQuery<CreditCard[]>({
    queryKey: ["/api/credit-cards"],
  });

  const { data: savedCards = [] } = useQuery<string[]>({
    queryKey: ["/api/saved-cards", user?.id],
    enabled: !!user?.id,
  });

  const createTrackerMutation = useMutation({
    mutationFn: async (tracker: any) => {
      return apiRequest("/api/welcome-bonus-tracking", "POST", tracker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/welcome-bonus-tracking"] });
      setShowAddForm(false);
      setNewTracker({
        cardId: "",
        requiredSpending: "",
        timeframeMonths: "3",
        startDate: new Date(),
      });
      toast({
        title: "Welcome bonus tracker created!",
        description: "Your progress will be tracked automatically.",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, currentSpending }: { id: string; currentSpending: number }) => {
      return apiRequest(`/api/welcome-bonus-tracking/${id}`, "PATCH", { currentSpending });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/welcome-bonus-tracking"] });
      toast({
        title: "Progress updated!",
        description: "Your spending progress has been updated.",
      });
    },
  });

  const completeTrackerMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/welcome-bonus-tracking/${id}/complete`, "PATCH");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/welcome-bonus-tracking"] });
      toast({
        title: "Welcome bonus earned!",
        description: "Congratulations on earning your welcome bonus!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTracker.cardId || !newTracker.requiredSpending) return;

    createTrackerMutation.mutate({
      ...newTracker,
      userId: user?.id,
      requiredSpending: parseFloat(newTracker.requiredSpending),
      timeframeMonths: parseInt(newTracker.timeframeMonths),
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getUrgencyBadge = (daysRemaining: number, progressPercentage: number) => {
    if (progressPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">Urgent: {daysRemaining} days</Badge>;
    }
    if (daysRemaining <= 30) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">
        {daysRemaining} days left
      </Badge>;
    }
    return <Badge variant="secondary">{daysRemaining} days left</Badge>;
  };

  const activeTrackers = bonusTrackers.filter(tracker => !tracker.isCompleted);
  const completedTrackers = bonusTrackers.filter(tracker => tracker.isCompleted);

  // Available cards for new tracker (exclude already tracked cards)
  const availableCards = creditCards.filter(card => 
    !bonusTrackers.some(tracker => tracker.cardId === card.id && !tracker.isCompleted)
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-8 w-8 text-purple-500" />
            Welcome Bonus Tracker
          </h1>
          <p className="text-muted-foreground">Track your progress toward earning welcome bonuses</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Track New Bonus
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Track New Welcome Bonus</CardTitle>
            <CardDescription>Add a credit card welcome bonus to track your spending progress</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cardId">Credit Card</Label>
                <Select value={newTracker.cardId} onValueChange={(value) => setNewTracker({ ...newTracker, cardId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a credit card" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} ({card.issuer})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requiredSpending">Required Spending ($)</Label>
                  <Input
                    id="requiredSpending"
                    type="number"
                    placeholder="4000"
                    value={newTracker.requiredSpending}
                    onChange={(e) => setNewTracker({ ...newTracker, requiredSpending: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe (Months)</Label>
                  <Select value={newTracker.timeframeMonths} onValueChange={(value) => setNewTracker({ ...newTracker, timeframeMonths: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="4">4 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTracker.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTracker.startDate ? format(newTracker.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTracker.startDate}
                      onSelect={(date) => setNewTracker({ ...newTracker, startDate: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createTrackerMutation.isPending}>
                  {createTrackerMutation.isPending ? "Creating..." : "Start Tracking"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {activeTrackers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Active Bonus Tracking ({activeTrackers.length})
            </h2>
            <div className="grid gap-4">
              {activeTrackers.map((tracker) => (
                <Card key={tracker.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {tracker.card.name}
                          {savedCards.includes(tracker.cardId) && (
                            <Badge variant="secondary">Saved</Badge>
                          )}
                        </h3>
                        <p className="text-muted-foreground">{tracker.card.issuer}</p>
                        <div className="text-sm text-muted-foreground mt-1">
                          Welcome Bonus: {tracker.card.welcomeBonus}
                        </div>
                      </div>
                      <div className="text-right">
                        {getUrgencyBadge(tracker.daysRemaining, tracker.progressPercentage)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            ${tracker.currentSpending.toFixed(2)} / ${tracker.requiredSpending.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={tracker.progressPercentage} className="h-3" />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {tracker.progressPercentage.toFixed(1)}% complete
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ${tracker.remainingSpending.toFixed(2)} remaining
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-semibold">{tracker.daysRemaining}</div>
                          <div className="text-xs text-muted-foreground">Days Remaining</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-semibold">
                            ${(tracker.remainingSpending / tracker.daysRemaining).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Per Day Needed</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Update spending amount"
                            onChange={(e) => {
                              const amount = parseFloat(e.target.value) || 0;
                              if (amount > 0) {
                                updateProgressMutation.mutate({
                                  id: tracker.id,
                                  currentSpending: amount,
                                });
                              }
                            }}
                          />
                        </div>
                        {tracker.progressPercentage >= 100 && (
                          <Button
                            onClick={() => completeTrackerMutation.mutate(tracker.id)}
                            disabled={completeTrackerMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </div>

                      {tracker.daysRemaining <= 7 && tracker.progressPercentage < 100 && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-700 dark:text-red-300">
                            Urgent: You need ${(tracker.remainingSpending / tracker.daysRemaining).toFixed(2)}/day to meet the deadline!
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedTrackers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Completed Bonuses ({completedTrackers.length})
            </h2>
            <div className="grid gap-4">
              {completedTrackers.slice(0, 5).map((tracker) => (
                <Card key={tracker.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{tracker.card.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          ${tracker.requiredSpending.toFixed(2)} requirement met
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {tracker.card.welcomeBonus}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTrackers.length === 0 && completedTrackers.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No welcome bonuses tracked yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your credit card welcome bonus spending requirements
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Track Your First Bonus
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}