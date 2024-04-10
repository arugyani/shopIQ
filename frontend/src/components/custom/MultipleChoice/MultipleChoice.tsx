import {
  selectCurrentHistoryId,
  selectCurrentQuestions,
  updateQuestion,
} from "@/app/features/historySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { MultipleChoiceObject, AnswerType } from "@/types-and-interfaces";
import { FC } from "react";

interface MultipleChoiceProps {
  data: MultipleChoiceObject;
}

interface AnswerUIProps {
  option: AnswerType;
  id: string;
}

const AnswerUI: FC<AnswerUIProps> = ({ option, id }) => {
  const { text, selected } = option;

  const dispatch = useAppDispatch();

  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentQuestions = useAppSelector(selectCurrentQuestions);

  const backgroundStyle = selected ? "[#FFCA3A]" : "transparent";
  const borderStyle = selected ? "[#A67900]" : "[#FFCA3A]";
  const textStyle = selected ? "[#A67900]" : "[#FFCA3A]";

  const buttonStyles = `grow rounded-3xl p-4 border-2 border-${borderStyle} bg-${backgroundStyle} text-${textStyle} hover:bg-[#FFCA3A] hover:border-[#A67900] hover:text-[#A67900]`;

  const handleSelect = () => {
    currentQuestions.forEach((question) => {
      if (question.id === id) {
        console.log(question.multipleAnswers);
        const updatedQuestion = { ...question };
        updatedQuestion.answers = updatedQuestion.answers.map((choice) => {
          if (choice.text === text) {
            return { text: choice.text, selected: !choice.selected };
          } else {
            if (question.multipleAnswers) {
              return choice;
            } else {
              return { text: choice.text, selected: false };
            }
          }
        });
        dispatch(
          updateQuestion({
            historyId: currentHistoryId,
            question: updatedQuestion,
          })
        );
      }
    });
  };

  return (
    <Button className={buttonStyles} onClick={() => handleSelect()}>
      {text}
    </Button>
  );
};

const MultipleChoice: FC<MultipleChoiceProps> = ({ data }) => {
  const { id, question, answers } = data;

  const dispatch = useAppDispatch();
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentQuestions = useAppSelector(selectCurrentQuestions);

  const handleOther = (id: string, value: string) => {
    currentQuestions.forEach((question) => {
      if (question.id === id) {
        const updatedQuestion = {
          ...question,
          other: value,
        };
        dispatch(
          updateQuestion({
            historyId: currentHistoryId,
            question: updatedQuestion,
          })
        );
      }
    });
  };

  const otherStyles = `border-2 px-4 py-2 text-gray-500 rounded-3xl`;

  return (
    <div className='py-4 rounded w-full'>
      <p className='font-medium text-md mb-4'>{question}</p>
      <div className='w-full my-2 flex gap-2'>
        {answers.map((option, index) => {
          return <AnswerUI key={index} option={option} id={id} />;
        })}
        <input
          className={otherStyles}
          placeholder='Other'
          value={data.other}
          onChange={(e) => handleOther(id, e.target.value)}
        />
      </div>
    </div>
  );
};

export { AnswerUI, MultipleChoice };