import assert from "node:assert/strict";
import {
  applyPricing,
  calculateRevenueSummary,
  formatCompactWon,
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
assert.deepEqual(
  calculateRevenueSummary([
    { sales: 3, revenue: 285000 },
    { sales: 2, revenue: 78000 },
  ]),
  { totalRevenue: 363000, totalSales: 5, averageOrderValue: 72600 },
);

console.log("콘텐츠 가격과 수익 계산 규칙이 올바릅니다.");
