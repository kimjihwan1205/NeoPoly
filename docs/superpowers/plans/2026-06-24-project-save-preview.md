# Project Save Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the final modeling save dialog so users can select a representative view and review the project data that will be saved.

**Architecture:** Keep the active module-set and representative-view state in `ModelingGenerationPage`. Pass the selected module set through the viewport browser, derive the four preview images from the existing `orc_3DF` assets, and pass the chosen image and set title into `createGeneratedProject`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Motion, Node assert tests

---

### Task 1: Extend generated project data

**Files:**
- Modify: `src/workflowState.ts`
- Modify: `src/workflowState.test.ts`

- [ ] Add a failing assertion that the selected representative image becomes `image` and `listImage`, the four views become `viewerImages`, and the selected set title is included in the tags.
- [ ] Run `node --import tsx src/workflowState.test.ts` and confirm the new assertion fails.
- [ ] Extend `createGeneratedProject` with an optional save-preview payload and preserve current defaults when it is omitted.
- [ ] Run the test and confirm it passes.

### Task 2: Share the active module set

**Files:**
- Modify: `src/components/ModelingGenerationPage.tsx`

- [ ] Move the active module-set ID to `ModelingGenerationPage`.
- [ ] Pass the value and change callback through `ModelViewport` into `ModuleSetBrowser`.
- [ ] Update the active set whenever a set card is opened.

### Task 3: Build the save preview dialog

**Files:**
- Modify: `src/components/ModelingGenerationPage.tsx`

- [ ] Expand the dialog to a responsive two-column layout.
- [ ] Add a large representative-image preview and four directional thumbnail buttons.
- [ ] Add project name, polygon count, module set count, active set, applied post-processing, and save-item summaries.
- [ ] Save the selected representative image and module set with the project.
- [ ] Run TypeScript validation and the workflow-state test.
