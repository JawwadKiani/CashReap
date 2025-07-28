import { useState } from "react";
import { Bell, CreditCard, Shield, HelpCircle, LogOut, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import type { User as UserType } from "@shared/schema";

export default function Settings() {
  const { user } = useAuth() as { user: UserType | undefined };
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
                <svg width="24" height="24" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="140" y="180" width="120" height="80" rx="8" fill="#F59E0B" stroke="#000" strokeWidth="2"/>
                  <rect x="140" y="195" width="120" height="12" fill="#000"/>
                  <circle cx="220" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                  <circle cx="235" cy="225" r="8" fill="#F59E0B" stroke="#000" strokeWidth="1"/>
                  <path d="M180 180 Q185 140 200 120 Q210 110 220 105" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round"/>
                  <path d="M220 105 L225 85" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  <path d="M220 90 L225 85 L230 90" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <ellipse cx="195" cy="135" rx="25" ry="15" fill="#22C55E" transform="rotate(-30 195 135)"/>
                  <path d="M180 140 Q195 135 205 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                  <circle cx="185" cy="125" r="8" fill="#F59E0B"/>
                  <text x="185" y="130" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
                  <ellipse cx="240" cy="125" rx="20" ry="12" fill="#22C55E" transform="rotate(45 240 125)"/>
                  <path d="M225 115 Q240 125 250 130" stroke="#22C55E" strokeWidth="2" fill="none"/>
                  <circle cx="250" cy="115" r="8" fill="#F59E0B"/>
                  <text x="250" y="120" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
                  <ellipse cx="210" cy="155" rx="15" ry="8" fill="#22C55E" transform="rotate(15 210 155)"/>
                  <path d="M205 160 Q210 155 215 150" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
                  <circle cx="220" cy="150" r="6" fill="#F59E0B"/>
                  <text x="220" y="154" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#fff">$</text>
                </svg>
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
