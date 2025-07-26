import type { StoreWithCategory } from "@shared/schema";

interface StoreInfoProps {
  store: StoreWithCategory;
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-variant">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <i className={`${store.category.iconClass} text-red-600 text-lg`} />
        </div>
        <div>
          <h2 className="font-semibold text-on-surface">{store.name}</h2>
          <p className="text-sm text-on-surface-variant">{store.category.name}</p>
        </div>
      </div>
      <div className="bg-accent/10 rounded-lg p-3">
        <p className="text-sm text-accent font-medium">
          💡 Pro Tip: {store.category.description || "Check for rotating quarterly categories for bonus cash back!"}
        </p>
      </div>
    </div>
  );
}
