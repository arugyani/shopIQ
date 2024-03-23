import { Question } from "@/app/features/questionSlice";

const fetchQuestions = async (query: string): Promise<Question[]> => {
  const requestOptions: RequestInit = {
    method: "GET",
    mode: "cors",
    redirect: "follow",
  };

  try {
    console.log(query); // temp line to avoid TypeScript anger while waiting for API to be finished and allow params
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
