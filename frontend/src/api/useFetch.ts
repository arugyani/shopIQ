/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from "@/app/features/questionSlice";

const fetchQuestions = async (query: string): Promise<Question[]> => {
  const requestOptions: RequestInit = {
    method: "GET",
    mode: "cors",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://localhost:3000/search",
      requestOptions
    );
    const result: Question[] = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { fetchQuestions };
