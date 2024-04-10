import { MultipleChoiceObject } from "@/types-and-interfaces";
import { Dispatch, FC, SetStateAction } from "react";

interface SummaryChoicesProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  questions: MultipleChoiceObject[];
}

const SummaryChoices: FC<SummaryChoicesProps> = ({
  setExpanded,
  questions,
}) => {
  return (
    <div
      className='rounded-xl border p-4 my-4 flex gap-2 overflow-auto flex-wrap hover:bg-slate-50 cursor-pointer'
      onClick={() => setExpanded(true)}
    >
      {questions.map((question, questionIndex) => {
        const selectedAnswers = question.answers.filter(
          (question) => question.selected
        );

        return selectedAnswers.map((answer, answerIndex) => {
          return (
            <div
              className='rounded-3xl p-2 bg-[#FFCA3A] border-[#A67900] text-sm text-[#A67900] font-bold min-w-24 max-h-12 flex justify-center'
              key={`${questionIndex},${answerIndex}`}
            >
              {answer.text}
            </div>
          );
        });
      })}
    </div>
  );
};

export default SummaryChoices;
