import { Link, useLocation } from "wouter";
import { Home, CreditCard, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-cards", icon: CreditCard, label: "My Cards" },
    { path: "/card-comparison", icon: Scale, label: "Compare" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-surface-variant z-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-8 w-8" />
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