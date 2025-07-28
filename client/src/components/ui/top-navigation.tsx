import { Link, useLocation } from "wouter";
import { Home, CreditCard, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/browse-cards", icon: CreditCard, label: "Browse" },
    { path: "/card-comparison", icon: Scale, label: "Compare" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-surface-variant z-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </svg>
            <span className="font-bold text-lg">CashReap</span>
          </div>
          
          {/* Navigation Items */}
          <div className="flex gap-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location === path;
              return (
                <Link key={path} href={path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="p-2"
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}