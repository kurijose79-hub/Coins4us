export type Mode = "fixed" | "reaction";

export interface HistoryEntry {
  id: string;
  exercise: string;
  mode: Mode;
  timestamp: number;
  /** For "fixed" mode: seconds held. For "reaction" mode: reaction time in ms. */
  result: number;
  falseStart?: boolean;
}
