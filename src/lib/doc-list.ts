import type { DocKind } from "./kinds";

export const DOC_LIST: Array<{ kind: DocKind; title: string }> = [
  { kind: "prd", title: "Product Requirements" },
  { kind: "requirements", title: "Functional Requirements" },
  { kind: "data-model", title: "Data Model" },
  { kind: "api", title: "API Contract" },
  { kind: "architecture", title: "Architecture" },
];
