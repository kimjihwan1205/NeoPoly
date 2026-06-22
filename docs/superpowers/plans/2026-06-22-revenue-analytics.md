# Revenue Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the basic revenue summary with the approved analytics-focused revenue management dashboard.

**Architecture:** Keep the existing content and pricing state in `ContentManagementPage.tsx`. Add small pure helpers to transform revenue series and calculate category shares, then render interactive period, channel, and sorting controls from React state.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, motion, Node assert tests.

---

### Task 1: Revenue Analytics Data

**Files:**
- Modify: `src/contentManagement.ts`
- Modify: `src/contentManagement.test.ts`

- [ ] Add failing assertions for scaled trend series and percentage shares.
- [ ] Run `node --import tsx src/contentManagement.test.ts` and confirm missing exports fail.
- [ ] Implement `scaleRevenueTrend` and `calculateRevenueShares`.
- [ ] Re-run the test and confirm it passes.

### Task 2: Analytics Dashboard UI

**Files:**
- Modify: `src/components/ContentManagementPage.tsx`

- [ ] Add period, channel, and work-sort state.
- [ ] Replace the existing revenue layout with four compact metrics and a primary line chart.
- [ ] Add product-type share and sales-efficiency panels.
- [ ] Extend the work revenue list with share bars and sorting controls.
- [ ] Keep the existing responsive page and sidebar behavior.

### Task 3: Verification

**Files:**
- Verify: `src/components/ContentManagementPage.tsx`
- Verify: `src/contentManagement.ts`

- [ ] Run all `src/*.test.ts` scripts.
- [ ] Run `tsc --noEmit`.
- [ ] Run the production build.
- [ ] Capture the revenue page at desktop size and inspect text, chart, and overflow.
