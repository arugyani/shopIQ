import { MultipleChoiceObject, ProductObject } from "@/types-and-interfaces";

const fetchQuestions = async (
  query: string
): Promise<MultipleChoiceObject[]> => {
  const requestOptions: RequestInit = {
    method: "GET",
    mode: "cors",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `http://localhost:3000/search/${query}`,
      requestOptions
    );
    const result: MultipleChoiceObject[] = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const fetchProducts = async (
  query: string,
  body: string
): Promise<ProductObject[]> => {
  const requestOptions: RequestInit = {
    method: "POST",
    mode: "cors",
    redirect: "follow",
    body,
  };

  try {
    // console.log(body); // avoid TypeScript error for now
    const response = await fetch(
      `http://localhost:3000/recommendations/${query}`,
      requestOptions
    );

    const result: ProductObject[] = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { fetchQuestions, fetchProducts };
