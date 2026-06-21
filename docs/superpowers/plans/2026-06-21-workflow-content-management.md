# Workflow And Content Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the workflow state transitions, model save flow, sidebar cleanup, and prototype pricing/revenue management.

**Architecture:** Keep visual state in the existing React pages and extract calculation/state helpers into small TypeScript modules. Reuse the shared workflow header/sidebar components so spacing and typography remain consistent.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Motion, Vite

---

### Task 1: Workflow State Helpers

**Files:**
- Create: `src/workflowState.ts`
- Create: `src/workflowState.test.ts`
- Modify: `src/components/TurnaroundPage.tsx`

- [ ] Add failing tests for filtering resolved consistency issues and creating a generated project.
- [ ] Run `node node_modules/tsx/dist/cli.mjs src/workflowState.test.ts` and confirm failure.
- [ ] Implement the helpers and connect them to turnaround and project storage.
- [ ] Re-run the tests and confirm they pass.

### Task 2: Modeling Generation And Save Flow

**Files:**
- Modify: `src/components/FullWorkflowPage.tsx`
- Modify: `src/components/ModelingGenerationPage.tsx`
- Modify: `src/components/ProjectPage.tsx`

- [ ] Add a direct-model generation request flag before navigation.
- [ ] Show a generation overlay before revealing the model.
- [ ] Replace the final action with a project-name dialog and save the generated project.
- [ ] Allow ProjectPage to load saved projects in addition to defaults.

### Task 3: Workflow Layout Cleanup

**Files:**
- Modify: `src/components/WorkflowHeader.tsx`
- Modify: `src/components/FullWorkflowPage.tsx`
- Modify: `src/components/TurnaroundPage.tsx`
- Modify: `src/components/ModelingGenerationPage.tsx`

- [ ] Move progress controls to the far right of every workflow header.
- [ ] Remove nonessential sidebar descriptions and helper copy.
- [ ] Keep only state, selection, and action information needed to complete the workflow.

### Task 4: Pricing And Revenue Management

**Files:**
- Create: `src/contentManagement.ts`
- Create: `src/contentManagement.test.ts`
- Modify: `src/components/ContentManagementPage.tsx`

- [ ] Add failing tests for price updates, discounted price validation, and revenue summaries.
- [ ] Implement a price editor for market content.
- [ ] Separate monthly revenue from upload status cards.
- [ ] Add a revenue menu with summary and per-content revenue rows.

### Task 5: Verification And Publishing

**Files:**
- Verify all modified files.

- [ ] Run TypeScript checks and focused tests.
- [ ] Build the production bundle.
- [ ] Inspect workflow and uploads pages at desktop widths.
- [ ] Commit and push to GitHub.
- [ ] Deploy the linked Vercel project and verify its public URL.
