export interface HistoryObject {
  id: string;
  name: string;
  svg: string;
  questions: MultipleChoiceObject[];
  products: ProductObject[];
}

export interface ProductObject {
  id: string;
  title: string;
  imgLink: string;
  bullets: string[];
  description: string | null;
  reviews: string[];
  price: string;
  reviewScore: string;
  numReviews: string;
}

/* MULTIPLE CHOICE */

export interface MultipleChoiceObject {
  id: string;
  question: string;
  answers: AnswerType[];
  multipleAnswers: boolean;
  other: string;
  questionInfo?: string;
}

export type AnswerType = {
  text: string;
  selected: boolean;
};
