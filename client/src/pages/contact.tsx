import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock, Send, MessageSquare, HelpCircle, Building, Wheat, DollarSign } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Wheat className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Contact CashReap</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about credit card rewards? Need help with the platform? 
            We're here to help you harvest more rewards.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@cashreap.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Business Inquiries</p>
                    <p className="text-sm text-muted-foreground">partnerships@cashreap.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Is CashReap really free?</p>
                  <p className="text-xs text-muted-foreground">Yes! Our core features are completely free. We earn through affiliate partnerships.</p>
                </div>
                
                <div>
                  <p className="font-medium text-sm">Do you store my financial data?</p>
                  <p className="text-xs text-muted-foreground">No. We don't require bank account linking and don't store sensitive financial information.</p>
                </div>
                
                <div>
                  <p className="font-medium text-sm">Can I suggest new businesses?</p>
                  <p className="text-xs text-muted-foreground">Absolutely! Use the form to suggest businesses you'd like to see added.</p>
                </div>
                
                <div>
                  <p className="font-medium text-sm">How accurate are the recommendations?</p>
                  <p className="text-xs text-muted-foreground">We update reward rates regularly and source data directly from card issuers.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" required>
                      <SelectTrigger>
                        <SelectValue placeholder="What can we help you with?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="business-suggestion">Suggest a Business</SelectItem>
                        <SelectItem value="card-suggestion">Suggest a Credit Card</SelectItem>
                        <SelectItem value="technical-support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="press">Press Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>We'd Love to Hear From You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Your input helps us improve CashReap for everyone.
                </p>
              </div>
              
              <div className="text-center">
                <Building className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Business Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Know a business we should add? Let us know!
                </p>
              </div>
              
              <div className="text-center">
                <HelpCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Need help using the platform? We're here for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}