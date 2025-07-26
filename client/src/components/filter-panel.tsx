import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterOptions } from "@/types";

interface FilterPanelProps {
  isOpen: boolean;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ isOpen, filters, onFiltersChange }: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-3 bg-white border-b border-surface-variant">
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={filters.annualFee || "any"}
          onValueChange={(value) => 
            onFiltersChange({ 
              ...filters, 
              annualFee: value as FilterOptions['annualFee']
            })
          }
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Annual Fee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Annual Fee</SelectItem>
            <SelectItem value="0">No Annual Fee</SelectItem>
            <SelectItem value="100">Under $100</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.creditScore?.toString() || "any"}
          onValueChange={(value) => 
            onFiltersChange({ 
              ...filters, 
              creditScore: value === "any" ? undefined : parseInt(value)
            })
          }
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Credit Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Credit Score</SelectItem>
            <SelectItem value="750">Excellent (750+)</SelectItem>
            <SelectItem value="700">Good (700-749)</SelectItem>
            <SelectItem value="650">Fair (650-699)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
