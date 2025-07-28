import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function CompetitiveAdvantages() {
  const comparison = [
    {
      feature: "Privacy (No Bank Sync)",
      cashreap: true,
      maxrewards: false,
      cardpointers: true,
      importance: "high"
    },
    {
      feature: "Guest/Try Before Signup",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "high"
    },
    {
      feature: "Business-Specific Search",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "Streaming Services Optimized",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "95+ Major US Businesses",
      cashreap: true,
      maxrewards: true,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "Agricultural/Harvest Theme",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "low"
    }
  ];

  const CheckIcon = ({ has }: { has: boolean }) => (
    has ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">How CashReap Stands Out</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Feature comparison vs. leading competitors
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Feature</th>
                <th className="text-center py-2 px-2">
                  <div className="font-bold text-primary">CashReap</div>
                </th>
                <th className="text-center py-2 px-2">
                  <div className="text-sm">MaxRewards</div>
                </th>
                <th className="text-center py-2 px-2">
                  <div className="text-sm">CardPointers</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.feature}</span>
                      {item.importance === "high" && (
                        <Badge variant="destructive" className="text-xs">Key</Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.cashreap} />
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.maxrewards} />
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.cardpointers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>CashReap's Key Advantage:</strong> We respect your privacy and let you try our recommendations instantly without requiring bank access or immediate signup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}