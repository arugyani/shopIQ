export interface HistoryObject {
  id: string;
  name: string;
  svg: string;
  questions: MultipleChoiceObject[];
  products: ProductObject[];
}

export interface MultipleChoiceObject {
  id:string;
  question: string;
  answers: {text:string, selected: boolean}[];
  multipleAnswers: boolean;
  other: string;
}

export interface ProductObject  {
  id:string;
  title: string;
  imgLink: string;
  bullets: string[];
  description: string | null;
  reviews: string[];
  price: string;
  reviewScore: number;
  numReviews: string;
};