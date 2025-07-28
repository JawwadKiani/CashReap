import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Scale, Users, Wheat, DollarSign } from "lucide-react";

export default function TermsOfService() {
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
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            The rules and guidelines for using CashReap
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 28, 2025
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-6 h-6" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p className="mb-2">
              By using CashReap, you agree to these terms. Please read them carefully.
            </p>
            <ul className="space-y-1 text-sm">
              <li>• CashReap provides credit card recommendations for informational purposes only</li>
              <li>• We are not a financial advisor or credit card issuer</li>
              <li>• Credit card approval and terms are determined by the issuing banks</li>
              <li>• Always review full terms and conditions before applying for any credit card</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By accessing or using the CashReap website and services, you agree to be bound by these 
              Terms of Service and our Privacy Policy. If you do not agree to these terms, please 
              do not use our services.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of CashReap after changes constitutes 
              acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Description of Service */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What CashReap Provides</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Credit card recommendations based on merchant categories</li>
                <li>Information about credit card rewards, fees, and features</li>
                <li>Tools to compare credit cards and track potential rewards</li>
                <li>A database of businesses and their associated reward categories</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What CashReap Does Not Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Credit card applications or approval decisions</li>
                <li>Financial advice or investment recommendations</li>
                <li>Guarantees about credit card approval or terms</li>
                <li>Direct access to your financial accounts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Account Security</h3>
              <p className="text-muted-foreground">
                You are responsible for maintaining the security of your account credentials and 
                for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Accurate Information</h3>
              <p className="text-muted-foreground">
                You agree to provide accurate and up-to-date information when using our services 
                and to update it as necessary.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Acceptable Use</h3>
              <p className="text-muted-foreground mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Share false or misleading information</li>
                <li>Use automated tools to access the service without permission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Information Accuracy</h3>
              <p className="text-muted-foreground">
                While we strive to provide accurate and up-to-date information about credit cards 
                and rewards, we cannot guarantee the accuracy or completeness of all information. 
                Credit card terms, fees, and rewards can change without notice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">No Financial Advice</h3>
              <p className="text-muted-foreground">
                CashReap provides informational tools and recommendations, not financial advice. 
                You should consult with qualified financial professionals before making credit 
                card decisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Third-Party Links</h3>
              <p className="text-muted-foreground">
                Our service contains links to third-party websites and services. We are not 
                responsible for the content or practices of these third parties.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Relationships */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Affiliate Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Compensation Disclosure</h3>
              <p className="text-muted-foreground">
                CashReap may receive compensation when you click on or apply for credit cards 
                through our platform. This compensation helps us keep our service free for users.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Editorial Independence</h3>
              <p className="text-muted-foreground">
                Our compensation does not influence our recommendations. We strive to provide 
                objective information based on actual reward rates and card features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">CashReap Content</h3>
              <p className="text-muted-foreground">
                The CashReap platform, including its design, functionality, and content, is 
                protected by copyright and other intellectual property laws. You may not copy, 
                modify, or distribute our content without permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">User Content</h3>
              <p className="text-muted-foreground">
                Any feedback, suggestions, or other content you provide to CashReap may be used 
                by us to improve our services without compensation to you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">By You</h3>
              <p className="text-muted-foreground">
                You may terminate your account at any time by contacting us or using the 
                account deletion feature in your settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">By CashReap</h3>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate these terms 
                or engage in fraudulent or harmful activities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, CashReap shall not be liable for any 
              indirect, incidental, special, or consequential damages arising from your use 
              of our services.
            </p>
            <p className="text-muted-foreground">
              Our total liability to you for any claims related to the service shall not 
              exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the United States. Any disputes will be 
              resolved through binding arbitration in accordance with the rules of the American 
              Arbitration Association.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@cashreap.com</p>
              <p><strong>General Support:</strong> support@cashreap.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}