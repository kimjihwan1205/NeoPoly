import assert from "node:assert/strict";
import {
  applyPricing,
  calculateRevenueSummary,
  calculateRevenueShares,
  formatCompactWon,
  getRevenueChartPositions,
  normalizeRevenueTrend,
  scaleRevenueTrend,
} from "./contentManagement";

assert.deepEqual(applyPricing(89000, 69000, true), {
  price: 69000,
  originalPrice: 89000,
  saleEnabled: true,
});
assert.deepEqual(applyPricing(89000, 95000, true), {
  price: 89000,
  originalPrice: 89000,
  saleEnabled: false,
});
assert.equal(formatCompactWon(12480000), "₩1,248만");
assert.equal(formatCompactWon(3299500), "₩330만");
assert.deepEqual(
  calculateRevenueSummary([
    { sales: 3, revenue: 285000 },
    { sales: 2, revenue: 78000 },
  ]),
  { totalRevenue: 363000, totalSales: 5, averageOrderValue: 72600 },
);
assert.deepEqual(
  normalizeRevenueTrend([
    { month: "1월", revenue: 100 },
    { month: "2월", revenue: 250 },
    { month: "3월", revenue: 0 },
  ]),
  [
    { month: "1월", revenue: 100, height: 40 },
    { month: "2월", revenue: 250, height: 100 },
    { month: "3월", revenue: 0, height: 0 },
  ],
);
assert.deepEqual(
  scaleRevenueTrend(
    [
      { month: "1월", revenue: 100 },
      { month: "2월", revenue: 250 },
    ],
    0.4,
  ),
  [
    { month: "1월", revenue: 40 },
    { month: "2월", revenue: 100 },
  ],
);
assert.deepEqual(
  calculateRevenueShares([
    { label: "캐릭터", revenue: 600 },
    { label: "환경", revenue: 300 },
    { label: "소품", revenue: 100 },
  ]),
  [
    { label: "캐릭터", revenue: 600, share: 60 },
    { label: "환경", revenue: 300, share: 30 },
    { label: "소품", revenue: 100, share: 10 },
  ],
);
assert.deepEqual(
  getRevenueChartPositions([
    { height: 25 },
    { height: 50 },
    { height: 100 },
  ]),
  [
    { xPercent: 3.5, yPercent: 70 },
    { xPercent: 50, yPercent: 50 },
    { xPercent: 96.5, yPercent: 10 },
  ],
);

console.log("콘텐츠 가격과 수익 계산 규칙이 올바릅니다.");
