export interface MantraParts {
  identity: string; // "I am a person who..."
  benefit: string;  // "It makes me..."
  emotion: string;  // "So I am happy..."
}

export interface HabitData {
  id: string;
  originalGoal: string;
  mantra: MantraParts;
  createdAt: number;
  checkIns: number;
  lastCheckInDate: string | null;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  ACTIVE = 'ACTIVE',
  CELEBRATING = 'CELEBRATING'
}