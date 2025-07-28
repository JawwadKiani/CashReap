import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, TrendingUp, Wheat, DollarSign } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Wheat className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold text-primary">CashReap</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">Harvest Your Rewards</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We help millions of Americans maximize their credit card rewards by finding the perfect card for every purchase.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              CashReap was founded on the belief that everyone deserves to maximize their purchasing power. 
              Just like farmers carefully tend their crops to achieve the best harvest, we help you cultivate 
              the perfect credit card strategy to reap maximum rewards from every dollar you spend.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Our platform makes it simple to find the best credit card for any business - from your local 
              grocery store to your favorite streaming service. No more guessing, no more leaving money on the table.
            </p>
          </CardContent>
        </Card>

        {/* Why Choose CashReap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Why Choose CashReap?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Comprehensive Database
                </h3>
                <p className="text-muted-foreground">
                  220+ major US businesses and 50+ credit cards from all major issuers, 
                  including regional powerhouses often missed by competitors.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Privacy-First Approach
                </h3>
                <p className="text-muted-foreground">
                  No bank account linking required. Get personalized recommendations 
                  without compromising your financial privacy.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Business-Specific Search
                </h3>
                <p className="text-muted-foreground">
                  Search by specific business name, not just categories. Find the best 
                  card for Netflix, Planet Fitness, or your local Wegmans.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-amber-600" />
                  Smart Fallback System
                </h3>
                <p className="text-muted-foreground">
                  Can't find your business? Select its category and still get 
                  personalized recommendations. No search goes unanswered.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Transparency</Badge>
                <p className="text-muted-foreground">
                  We provide honest, unbiased recommendations based on actual reward rates and fees.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Simplicity</Badge>
                <p className="text-muted-foreground">
                  Credit card optimization shouldn't be complicated. We make it easy for everyone.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Innovation</Badge>
                <p className="text-muted-foreground">
                  We're constantly expanding our database and features to serve you better.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Community</Badge>
                <p className="text-muted-foreground">
                  Your feedback helps us grow. We're building this platform for real people with real spending needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              CashReap started when our founders realized they were missing out on thousands of dollars 
              in credit card rewards each year. Despite being financially savvy, they found existing tools 
              either too complex, too generic, or missing their favorite local businesses.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              That's when the idea was born: create a simple, comprehensive platform that works for 
              everyone - from college students buying their first groceries to families planning major purchases. 
              Today, CashReap helps users across all 50 states find the perfect credit card for their lifestyle.
            </p>
            <div className="mt-6 p-4 bg-amber-100 dark:bg-amber-900 rounded-lg border-l-4 border-amber-500">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                "Just like a successful harvest requires the right tools and timing, 
                maximizing your rewards requires the right card and knowledge. We provide both."
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-2">
                — CashReap Founders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}