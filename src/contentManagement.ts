export type PricingResult = {
  price: number;
  originalPrice: number;
  saleEnabled: boolean;
};

export function applyPricing(
  originalPrice: number,
  discountPrice: number,
  saleEnabled: boolean,
): PricingResult {
  const normalizedOriginal = Math.max(0, Math.round(originalPrice || 0));
  const normalizedDiscount = Math.max(0, Math.round(discountPrice || 0));
  const hasValidDiscount =
    saleEnabled &&
    normalizedDiscount > 0 &&
    normalizedDiscount < normalizedOriginal;

  return {
    price: hasValidDiscount ? normalizedDiscount : normalizedOriginal,
    originalPrice: normalizedOriginal,
    saleEnabled: hasValidDiscount,
  };
}

export function formatCompactWon(value: number) {
  if (value >= 10000000) {
    return `₩${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
  }
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

export function calculateRevenueSummary(
  rows: Array<{ sales: number; revenue: number }>,
) {
  const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const totalSales = rows.reduce((sum, row) => sum + row.sales, 0);

  return {
    totalRevenue,
    totalSales,
    averageOrderValue:
      totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0,
  };
}

export function parseWon(value?: string) {
  if (!value) return 0;
  return Number(value.replace(/[^\d]/g, "")) || 0;
}
