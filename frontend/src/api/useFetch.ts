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
      `https://shopiq.azurewebsites.net/search/${query}`,
      requestOptions
    );
    const result: MultipleChoiceObject[] = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const fetchProducts = async (body: JSON): Promise<ProductObject[]> => {
  const requestOptions: RequestInit = {
    method: "POST",
    mode: "cors",
    redirect: "follow",
  };

  try {
    console.log(body); // avoid TypeScript error for now
    const response = await fetch(
      "http://shopiq.azurewebsites.net/recommendations",
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
