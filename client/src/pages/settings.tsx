import { useState } from "react";
import { Bell, CreditCard, Shield, HelpCircle, LogOut, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your search history? This action cannot be undone.")) {
      // TODO: Call API to clear user search history
      window.location.reload();
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex flex-col items-center">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-32 mb-2" />
            <h1 className="text-xl font-bold text-on-surface">Settings</h1>
            <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* User Profile */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-on-surface">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                  </p>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              <Separator />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="font-medium text-on-surface">Notifications</p>
                  <p className="text-sm text-on-surface-variant">Get alerts about new card offers</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="font-medium text-on-surface">Save Search History</p>
                  <p className="text-sm text-on-surface-variant">Keep track of your store searches</p>
                </div>
              </div>
              <Switch
                checked={saveHistory}
                onCheckedChange={setSaveHistory}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleClearHistory}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Clear Search History
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & FAQ
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-3" />
              Privacy Policy
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-on-surface-variant">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/src/assets/logo.png" alt="CashReap" className="h-6" />
                <span className="text-xs font-medium">Harvest Your Rewards</span>
              </div>
              <p>CashReap v1.0.0</p>
              <p className="mt-1">© 2025 CashReap. All rights reserved.</p>
              <p className="mt-2 text-xs">
                This app provides information for educational purposes only. 
                Please consult with financial advisors for personalized advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
