export interface GrammarTask {
  id: string;
  task: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  category: string;
  explanation?: string;
} 