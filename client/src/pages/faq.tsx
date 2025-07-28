import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HelpCircle, ChevronDown, ChevronUp, Search, CreditCard, Shield, Users, Wheat, DollarSign } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Is CashReap really free to use?",
    answer: "Yes! CashReap is completely free for users. We earn revenue through affiliate partnerships with credit card issuers when you apply for cards through our platform. This allows us to keep all our core features free while providing unbiased recommendations.",
    category: "General"
  },
  {
    id: "2",
    question: "Do I need to link my bank account or credit cards?",
    answer: "No! Unlike many competitors, CashReap doesn't require you to connect your bank accounts or existing credit cards. We provide recommendations based on the business categories you're interested in, not your actual spending data. This protects your privacy while still giving you personalized suggestions.",
    category: "Privacy"
  },
  {
    id: "3",
    question: "How accurate are your credit card recommendations?",
    answer: "We update our database regularly with the latest reward rates, fees, and terms directly from credit card issuers. However, credit card terms can change, so we always recommend verifying the current offer details on the issuer's website before applying.",
    category: "Recommendations"
  },
  {
    id: "4",
    question: "Can I suggest businesses to add to your database?",
    answer: "Absolutely! We love hearing from users about businesses they'd like to see added. You can suggest new businesses through our contact form or by emailing us at support@cashreap.com. We regularly add popular requested businesses to our database.",
    category: "General"
  },
  {
    id: "5",
    question: "What if I search for a business that's not in your database?",
    answer: "If we don't have a specific business in our database, you can select the business category (like 'grocery stores' or 'gas stations') and we'll show you the best credit cards for that type of purchase. This ensures you always get relevant recommendations.",
    category: "Features"
  },
  {
    id: "6",
    question: "How do you make money if the service is free?",
    answer: "CashReap earns commission when users apply for credit cards through our affiliate links. This is a standard practice in the industry and doesn't cost you anything extra. It also doesn't influence our recommendations - we base them on actual reward rates and card features.",
    category: "General"
  },
  {
    id: "7",
    question: "Do you store my personal or financial information?",
    answer: "We only store the information necessary to provide our service: your email, name, and preferences like saved cards or search history. We never store sensitive financial data like bank account numbers, credit card numbers, or Social Security numbers.",
    category: "Privacy"
  },
  {
    id: "8",
    question: "Can I apply for credit cards directly through CashReap?",
    answer: "CashReap provides recommendations and links to credit card offers, but you'll complete the actual application on the credit card issuer's secure website. This ensures your sensitive information is handled directly by the bank, not by us.",
    category: "Applications"
  },
  {
    id: "9",
    question: "How often do you update credit card information?",
    answer: "We monitor credit card offers regularly and update our database when issuers change rewards rates, fees, or terms. If you notice outdated information, please let us know and we'll investigate and update it promptly.",
    category: "Recommendations"
  },
  {
    id: "10",
    question: "What's the difference between guest and registered users?",
    answer: "Guest users can search businesses and see credit card recommendations. Registered users get additional features like saving favorite cards, tracking search history, comparing multiple cards, and accessing more detailed reward calculations.",
    category: "Features"
  },
  {
    id: "11",
    question: "Do you guarantee credit card approval?",
    answer: "No, CashReap cannot guarantee credit card approval. Approval decisions are made entirely by the credit card issuers based on their own criteria, including your credit score, income, and credit history. We only provide recommendations to help you find the best cards to consider.",
    category: "Applications"
  },
  {
    id: "12",
    question: "How do you determine which credit card is 'best' for a business?",
    answer: "We rank cards primarily by reward rates for specific merchant categories, then consider factors like annual fees, welcome bonuses, and credit score requirements. Cards with higher reward rates for a specific category typically rank higher, but we also highlight no-annual-fee options.",
    category: "Recommendations"
  },
  {
    id: "13",
    question: "Can I delete my account and data?",
    answer: "Yes! You can delete your account and all associated data at any time through your account settings or by contacting us. We'll permanently remove your personal information from our systems within 30 days.",
    category: "Privacy"
  },
  {
    id: "14",
    question: "Do you cover business credit cards?",
    answer: "Currently, CashReap focuses primarily on personal credit cards, but we do include some business cards in our database when they offer exceptional rewards for certain categories. We're constantly expanding our coverage based on user feedback.",
    category: "Features"
  },
  {
    id: "15",
    question: "How do I know if a credit card offer is legitimate?",
    answer: "All credit card offers on CashReap link directly to the official issuer websites. We only work with major, established credit card companies. Always verify you're on the official bank website (look for HTTPS and the correct domain name) before entering any personal information.",
    category: "Safety"
  },
  {
    id: "16",
    question: "What if I have a problem with a credit card I applied for through CashReap?",
    answer: "Since credit cards are issued by banks, not CashReap, you'll need to contact the credit card issuer directly for any issues with your account, billing, or card features. However, if you have concerns about the information we provided, please let us know.",
    category: "Support"
  },
  {
    id: "17",
    question: "Do you have a mobile app?",
    answer: "Currently, CashReap is available as a web application that works great on mobile browsers. We're optimized for mobile use and considering a dedicated mobile app based on user demand. You can bookmark our site to your home screen for easy access.",
    category: "Features"
  },
  {
    id: "18",
    question: "How do you handle rotating category cards?",
    answer: "For cards with rotating bonus categories (like Chase Freedom Flex), we clearly indicate when a category is part of a rotating bonus and show the current quarter's categories. We also note the dates when categories change so you can plan accordingly.",
    category: "Features"
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "General", "Features", "Privacy", "Recommendations", "Applications", "Safety", "Support"];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Wheat className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 absolute -bottom-1 -right-1" />
            </div>
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about CashReap and credit card rewards
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Questions */}
        {searchTerm === "" && selectedCategory === "All" && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <CreditCard className="w-6 h-6" />
                Most Popular Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 dark:text-blue-300">
              <div className="grid md:grid-cols-2 gap-3">
                <button 
                  onClick={() => toggleItem("1")}
                  className="text-left text-sm hover:underline"
                >
                  → Is CashReap really free to use?
                </button>
                <button 
                  onClick={() => toggleItem("2")}
                  className="text-left text-sm hover:underline"
                >
                  → Do I need to link my bank account?
                </button>
                <button 
                  onClick={() => toggleItem("5")}
                  className="text-left text-sm hover:underline"
                >
                  → What if my business isn't listed?
                </button>
                <button 
                  onClick={() => toggleItem("3")}
                  className="text-left text-sm hover:underline"
                >
                  → How accurate are recommendations?
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id}>
                <Collapsible 
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="text-left">{faq.question}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {faq.category}
                          </span>
                          {openItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>

        {/* Still Have Questions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Still Have Questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a href="mailto:support@cashreap.com">Email Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}