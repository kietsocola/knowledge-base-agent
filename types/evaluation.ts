export interface RadarScores {
  "Hiểu khái niệm": number;
  "Giải quyết vấn đề": number;
  "Ghi nhớ kiến thức": number;
  "Vận dụng thực tế": number;
  "Tư duy phản biện": number;
}

export interface EvaluationResult {
  overallScore: number; // 0-10
  strengths: string[];
  gaps: string[];
  radarScores: RadarScores;
  recommendedTopics: string[];
  nextStepMessage: string;
}
