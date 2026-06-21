export const TURNAROUND_MODULE_SESSION_KEY = "neopoly:turnaround-module-session";

export type TurnaroundModuleSession = {
  isModuleScanComplete: boolean;
  isModuleListConfirmed: boolean;
  isModuleListDrawerOpen?: boolean;
  moduleParts: unknown[];
  generatedModules: string[];
  moduleSets: unknown[];
  selectedPart: string;
  moduleDrafts: Record<string, unknown>;
  moduleNameInputs: Record<string, string>;
  newSetTag: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const parseTurnaroundModuleSession = (raw: string | null): TurnaroundModuleSession | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !isRecord(parsed) ||
      typeof parsed.isModuleScanComplete !== "boolean" ||
      typeof parsed.isModuleListConfirmed !== "boolean" ||
      !Array.isArray(parsed.moduleParts) ||
      !Array.isArray(parsed.generatedModules) ||
      !parsed.generatedModules.every((item) => typeof item === "string") ||
      !Array.isArray(parsed.moduleSets) ||
      typeof parsed.selectedPart !== "string" ||
      !isRecord(parsed.moduleDrafts) ||
      !isRecord(parsed.moduleNameInputs) ||
      !Object.values(parsed.moduleNameInputs).every((item) => typeof item === "string") ||
      typeof parsed.newSetTag !== "string"
    ) {
      return null;
    }

    return parsed as TurnaroundModuleSession;
  } catch {
    return null;
  }
};

export const createFallbackConfirmedModuleSession = <
  TPart extends { id: string },
  TSet,
  TDraft,
>(
  moduleParts: TPart[],
  moduleSets: TSet[],
  moduleDrafts: Record<string, TDraft>,
  moduleNameInputs: Record<string, string>,
  newSetTag: string,
): TurnaroundModuleSession => ({
  isModuleScanComplete: true,
  isModuleListConfirmed: true,
  isModuleListDrawerOpen: false,
  moduleParts,
  generatedModules: moduleParts.map((part) => part.id),
  moduleSets,
  selectedPart: moduleParts[0]?.id ?? "",
  moduleDrafts,
  moduleNameInputs,
  newSetTag,
});
