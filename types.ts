
export type EntryType = 'water' | 'urine';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: EntryType;
  amount: number; // in ml
  note?: string;
}

export interface UserSettings {
  waterPresets: number[];
  urinePresets: number[];
}

export interface DailySummary {
  date: string;
  totalWater: number;
  totalUrine: number;
  countWater: number;
  countUrine: number;
}
