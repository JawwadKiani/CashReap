import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, Wheat, DollarSign } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Your privacy is our priority. Here's how we protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 28, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <UserCheck className="w-6 h-6" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 dark:text-green-300">
            <ul className="space-y-2">
              <li>• <strong>No bank account linking required</strong> - We don't access your financial accounts</li>
              <li>• <strong>Minimal data collection</strong> - Only what's needed for recommendations</li>
              <li>• <strong>No selling of personal data</strong> - We earn through affiliate partnerships, not data sales</li>
              <li>• <strong>Secure authentication</strong> - Powered by Replit's secure login system</li>
              <li>• <strong>You control your data</strong> - Delete your account and data anytime</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Account Information</h3>
              <p className="text-muted-foreground mb-2">When you create an account, we collect:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Email address</li>
                <li>Name (first and last)</li>
                <li>Profile picture (if provided)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Usage Information</h3>
              <p className="text-muted-foreground mb-2">To improve our recommendations, we track:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Businesses you search for</li>
                <li>Credit cards you save or compare</li>
                <li>General usage patterns (anonymized)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Information</h3>
              <p className="text-muted-foreground mb-2">Standard web data for security and performance:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* What We Don't Collect */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Eye className="w-6 h-6" />
              What We Don't Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 dark:text-blue-300">
            <ul className="space-y-2">
              <li>• <strong>Bank account information</strong> - We never ask for or store banking details</li>
              <li>• <strong>Credit card numbers</strong> - We don't handle actual card information</li>
              <li>• <strong>Social Security Numbers</strong> - We don't collect SSNs or tax IDs</li>
              <li>• <strong>Transaction data</strong> - We don't see your actual purchases or spending</li>
              <li>• <strong>Credit scores</strong> - We don't access your credit reports</li>
            </ul>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                We use your search history and saved cards to provide better credit card suggestions 
                tailored to your preferences and spending patterns.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Platform Improvement</h3>
              <p className="text-muted-foreground">
                Aggregated usage data helps us identify popular businesses to add to our database 
                and improve our recommendation algorithms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Communication</h3>
              <p className="text-muted-foreground">
                We may send you important updates about our service, new features, or changes to our terms. 
                You can opt out of non-essential communications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Encryption</h3>
              <p className="text-muted-foreground">
                All data is encrypted in transit using TLS and at rest using industry-standard encryption methods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                User authentication is handled by Replit's secure login system, which supports 
                multi-factor authentication and OAuth providers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Access Controls</h3>
              <p className="text-muted-foreground">
                Only authorized personnel have access to user data, and all access is logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sharing and Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Affiliate Partners</h3>
              <p className="text-muted-foreground">
                When you click on credit card offers, we may share anonymized data with our affiliate partners 
                to track referrals. This helps us earn commission to keep CashReap free.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Service Providers</h3>
              <p className="text-muted-foreground">
                We work with trusted service providers for hosting, analytics, and customer support. 
                These partners are bound by strict data protection agreements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose information if required by law, court order, or to protect our rights 
                and the safety of our users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Access and Portability</h3>
              <p className="text-muted-foreground">
                You can request a copy of all data we have about you in a portable format.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Correction</h3>
              <p className="text-muted-foreground">
                You can update your account information at any time through your settings page.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Deletion</h3>
              <p className="text-muted-foreground">
                You can delete your account and all associated data at any time. Some aggregated, 
                anonymized data may be retained for analytics purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Opt-Out</h3>
              <p className="text-muted-foreground">
                You can opt out of non-essential communications and certain data collection features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About This Policy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@cashreap.com</p>
              <p><strong>General Support:</strong> support@cashreap.com</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We'll respond to privacy inquiries within 30 days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}