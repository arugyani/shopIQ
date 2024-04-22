export interface HistoryObject {
  id: string;
  name: string;
  svg: string;
  questions: MultipleChoiceObject[];
  products: ProductObject[];
}

// export interface ProductObject {
//   id: string;
//   title: string;
//   imgLink: string;
//   bullets: string[];
//   description: string | null;
//   reviews: string[];
//   price: string;
//   reviewScore: string;
//   numReviews: string;
//   pros: { name: string }[];
//   cons: { name: string }[];
// }

export interface ProductObject {
  id: string;
  title: string;
  bullets: string[];
  pros: ProConType;
  cons: ProConType;
  prodLink: string;
  imgLink: string;
  price: string;
  given_score: string;
  reviews: string[];
}

export type ProConType = {
  [key: string]: string;
};

/* MULTIPLE CHOICE */

export interface MultipleChoiceObject {
  id: string;
  question: string;
  answers: AnswerType[];
  multipleAnswers: boolean;
  other: string;
}

export type AnswerType = {
  text: string;
  selected: boolean;
};
