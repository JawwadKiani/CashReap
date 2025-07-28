import { SimpleAIInsights } from "@/components/simple-ai-insights";

export default function AIRecommendations() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white shadow-sm border-b border-surface-variant">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="text-xl">🤖</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">AI Recommendations</h1>
              <p className="text-sm text-on-surface-variant">Personalized insights to maximize rewards</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <SimpleAIInsights />
      </main>
    </div>
  );
}