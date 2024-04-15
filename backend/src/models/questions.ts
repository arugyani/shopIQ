export interface LLMQuestion {
  question: string;
  questionInfo: string;
  multipleAnswers: boolean;
  answers: LLMAnswer[];
}

export interface Question {
  id: string;
  question: string;
  questionInfo: string;
  multipleAnswers: boolean;
  answers: Answer[];
  other: string;
}

export interface LLMAnswer {
  text: string;
}

export interface Answer {
  text: string;
  selected: boolean;
}
