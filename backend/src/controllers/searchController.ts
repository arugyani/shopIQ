import { Request, Response } from "express";
import { jsonrepair } from "jsonrepair";
import { v4 as uuid } from "uuid";
import { questionsPrompt } from "../prompts";
import { getLLMResponse } from "../services/llmService";
import { LLMQuestion, Question } from "../models/questions";
import { removeTicks } from "../utils";

export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.params.query;
  console.log(`\n[SEARCH] ${query}`);

  const prompt = questionsPrompt({ query });
  console.log("\n[LLM] Querying LLM for questions & answers...");
  const llmResponse = await getLLMResponse(prompt);
  const processedResponse = removeTicks(llmResponse); // Removes excess '', ``, and "" from response

  // Parse LLM response
  try {
    const repairedJSON = jsonrepair(processedResponse);
    const parsedJSON: LLMQuestion[] = JSON.parse(repairedJSON);

    // Add necessary fields
    const completedJSON: Question[] = parsedJSON.map((question) => {
      const updatedQuestion: Question = {
        id: uuid(),
        ...question,
        answers: question.answers.map((answer) => {
          return { text: answer.text, selected: false };
        }),
        other: "",
      };

      return updatedQuestion;
    });

    console.log("\n[LLM] Successfully received Q&A response...");
    res.status(200).json(completedJSON);
  } catch (error) {
    console.error(`[LLM Q&A ERROR] ${error}`);
    console.log(llmResponse);
    res.status(500).json({
      error: "Received invalid LLM response.",
    });
  }
};
