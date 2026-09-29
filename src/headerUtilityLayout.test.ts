import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");
const headerStart = source.indexOf("function Header(");
const headerEnd = source.indexOf("// --- Hero Section ---", headerStart);
const headerSource = source.slice(headerStart, headerEnd);

test("cart and notification actions remain visible below the desktop breakpoint", () => {
  assert.match(headerSource, /<div className="relative" ref=\{cartRef\}>/);
  assert.match(headerSource, /<div className="relative" ref=\{notifRef\}>/);
  assert.doesNotMatch(headerSource, /isCartOpen \? 'block' : 'hidden lg:block'/);
  assert.doesNotMatch(headerSource, /isNotifOpen \? 'block' : 'hidden lg:block'/);
});

test("mobile menu does not duplicate header utility actions", () => {
  const mobileMenuStart = headerSource.indexOf("{isMobileMenuOpen && (");
  const mobileMenuSource = headerSource.slice(mobileMenuStart);
  assert.doesNotMatch(mobileMenuSource, />장바구니 \{cartItems\.length\}</);
  assert.doesNotMatch(mobileMenuSource, />알림</);
});

test("mobile header controls preserve touch targets and compact logo spacing", () => {
  assert.equal((headerSource.match(/flex h-11 w-11 cursor-pointer items-center justify-center/g) ?? []).length, 2);
  assert.match(headerSource, /h-\[20px\].*min-\[360px\]:h-\[24px\].*sm:absolute/);
});
