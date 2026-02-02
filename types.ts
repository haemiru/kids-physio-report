
export enum MealStatus {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum BowelStatus {
  NORMAL = 'Normal',
  CONSTIPATED = 'Constipated',
  DIARRHEA = 'Diarrhea',
  NONE = 'None'
}

export interface SurvivalRecord {
  id: string;
  patientId: string;
  date: string;
  respiratoryRate: number; // breaths per minute
  mealStatus: MealStatus;
  mealAmount: number; // percentage 0-100
  exerciseMinutes: number;
  bowelStatus: BowelStatus;
  sleepHours: number;
  notes: string;
  therapistId: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  guardianName: string;
  contact: string;
  imageUrl?: string;
}

export interface AIAnalysisResult {
  summary: string;
  warnings: string[];
  recommendations: string[];
}
