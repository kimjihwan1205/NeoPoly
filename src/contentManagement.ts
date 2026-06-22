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
  if (value >= 1000000) {
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

export function normalizeRevenueTrend(
  points: Array<{ month: string; revenue: number }>,
) {
  const maxRevenue = Math.max(0, ...points.map((point) => point.revenue));

  return points.map((point) => ({
    ...point,
    height:
      maxRevenue > 0
        ? Math.round((Math.max(0, point.revenue) / maxRevenue) * 100)
        : 0,
  }));
}

export function scaleRevenueTrend(
  points: Array<{ month: string; revenue: number }>,
  ratio: number,
) {
  const normalizedRatio = Math.max(0, ratio);
  return points.map((point) => ({
    ...point,
    revenue: Math.round(point.revenue * normalizedRatio),
  }));
}

export function calculateRevenueShares(
  rows: Array<{ label: string; revenue: number }>,
) {
  const total = rows.reduce((sum, row) => sum + Math.max(0, row.revenue), 0);
  return rows.map((row) => ({
    ...row,
    share: total > 0 ? Math.round((Math.max(0, row.revenue) / total) * 100) : 0,
  }));
}

export function getRevenueChartPositions(
  points: Array<{ height: number }>,
) {
  const horizontalPadding = 3.5;
  const verticalPadding = 10;
  const usableWidth = 100 - horizontalPadding * 2;
  const usableHeight = 100 - verticalPadding * 2;

  return points.map((point, index) => ({
    xPercent:
      points.length <= 1
        ? 50
        : horizontalPadding + (index / (points.length - 1)) * usableWidth,
    yPercent:
      verticalPadding +
      (1 - Math.max(0, Math.min(100, point.height)) / 100) * usableHeight,
  }));
}

export function parseWon(value?: string) {
  if (!value) return 0;
  return Number(value.replace(/[^\d]/g, "")) || 0;
}
