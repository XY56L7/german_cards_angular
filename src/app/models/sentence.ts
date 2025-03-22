export interface Sentence {
  id: string;
  incomplete: string;
  correct: string;
  translation: string;
  hint?: string;
  category?: string;
}