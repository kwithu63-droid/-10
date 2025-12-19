
export interface Question {
  id: number;
  text: string;
}

export interface CategoryResult {
  name: string;
  subFactors: SubFactorResult[];
  totalScore: number;
}

export interface SubFactorResult {
  id: number;
  label: string;
  score: number;
  questionIds: number[];
}

export interface DiagnosisState {
  answers: Record<number, number>;
  currentPage: number;
  isComplete: boolean;
}
