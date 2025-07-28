import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Target, DollarSign, Clock, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PurchasePlanWithRecommendations, StoreWithCategory, MerchantCategory } from "@shared/schema";

export default function PurchasePlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    amount: "",
    storeId: "",
    categoryId: "",
    targetDate: null as Date | null,
  });

  const { data: purchasePlans = [] } = useQuery<PurchasePlanWithRecommendations[]>({
    queryKey: ["/api/purchase-plans", user?.id],
    enabled: !!user?.id,
  });

  const { data: stores = [] } = useQuery<StoreWithCategory[]>({
    queryKey: ["/api/stores"],
  });

  const { data: categories = [] } = useQuery<MerchantCategory[]>({
    queryKey: ["/api/categories"],
  });

  const createPlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      return apiRequest("/api/purchase-plans", "POST", plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-plans"] });
      setShowAddForm(false);
      setNewPlan({
        title: "",
        amount: "",
        storeId: "",
        categoryId: "",
        targetDate: null,
      });
      toast({
        title: "Purchase plan created!",
        description: "Your purchase plan has been added successfully.",
      });
    },
  });

  const completePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiRequest(`/api/purchase-plans/${planId}/complete`, "PATCH");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-plans"] });
      toast({
        title: "Purchase completed!",
        description: "Congratulations on your purchase!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.title || !newPlan.amount) return;

    createPlanMutation.mutate({
      ...newPlan,
      userId: user?.id,
      amount: parseFloat(newPlan.amount),
    });
  };

  const activePlans = purchasePlans.filter(plan => !plan.isCompleted);
  const completedPlans = purchasePlans.filter(plan => plan.isCompleted);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Purchase Planner</h1>
          <p className="text-muted-foreground">Plan your purchases and maximize your rewards</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Purchase Plan
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Purchase Plan</CardTitle>
            <CardDescription>Plan your upcoming purchase to get the best rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Purchase Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., New laptop, Grocery shopping"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newPlan.amount}
                    onChange={(e) => setNewPlan({ ...newPlan, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Store (Optional)</Label>
                  <Select value={newPlan.storeId} onValueChange={(value) => setNewPlan({ ...newPlan, storeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.slice(0, 20).map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category (Optional)</Label>
                  <Select value={newPlan.categoryId} onValueChange={(value) => setNewPlan({ ...newPlan, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Target Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPlan.targetDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPlan.targetDate ? format(newPlan.targetDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPlan.targetDate || undefined}
                      onSelect={(date) => setNewPlan({ ...newPlan, targetDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createPlanMutation.isPending}>
                  {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
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
        {activePlans.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Active Plans ({activePlans.length})
            </h2>
            <div className="grid gap-4">
              {activePlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${parseFloat(plan.amount).toFixed(2)}
                          </span>
                          {plan.targetDate && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(plan.targetDate), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => completePlanMutation.mutate(plan.id)}
                        disabled={completePlanMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </div>

                    {plan.store && (
                      <div className="mb-3">
                        <Badge variant="secondary">{plan.store.name}</Badge>
                      </div>
                    )}

                    {plan.recommendedCards.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Best Cards for This Purchase:</h4>
                        <div className="space-y-2">
                          {plan.recommendedCards.slice(0, 3).map((card, index) => (
                            <div key={card.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div>
                                <span className="font-medium">{card.name}</span>
                                <div className="text-sm text-muted-foreground">
                                  {card.rewardRate}% cashback • {card.issuer}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-green-600">
                                  ${(parseFloat(plan.amount) * parseFloat(card.rewardRate) / 100).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">rewards</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Total Potential Earnings: ${plan.potentialEarnings.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedPlans.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Completed Plans ({completedPlans.length})
            </h2>
            <div className="grid gap-4">
              {completedPlans.slice(0, 5).map((plan) => (
                <Card key={plan.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{plan.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          ${parseFloat(plan.amount).toFixed(2)} • Completed
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Done
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activePlans.length === 0 && completedPlans.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No purchase plans yet</h3>
              <p className="text-muted-foreground mb-4">
                Start planning your purchases to maximize your credit card rewards
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}