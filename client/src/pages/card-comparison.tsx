import { CardComparison } from "@/components/card-comparison";

export default function CardComparisonPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white shadow-sm border-b border-surface-variant">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-green-500 rounded-lg flex items-center justify-center">
              <div className="text-xl">⚖️</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Card Comparison</h1>
              <p className="text-sm text-on-surface-variant">Compare credit cards side by side</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <CardComparison />
      </main>
    </div>
  );
}