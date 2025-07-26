import { Link, useLocation } from "wouter";
import { Home, CreditCard, History, Settings } from "lucide-react";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-cards", icon: CreditCard, label: "My Cards" },
    { path: "/history", icon: History, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-variant">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            return (
              <Link key={path} href={path}>
                <button className={`flex flex-col items-center py-2 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant hover:text-primary"
                }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                    {label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
