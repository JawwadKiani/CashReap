import { EnhancedMyCards } from "@/components/enhanced-my-cards";

export default function MyCards() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-variant sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="relative">
            {/* Centered Logo and Title */}
            <div className="flex flex-col items-center justify-center">
              <img src="/src/assets/logo-transparent.svg" alt="CashReap" className="h-24 mb-2" />
              <h1 className="text-xl font-bold text-on-surface">My Cards</h1>
              <div className="text-xs text-on-surface-variant font-medium">Harvest Your Rewards</div>
            </div>
            

          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <EnhancedMyCards />
      </main>
    </div>
  );
}