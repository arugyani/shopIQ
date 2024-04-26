import {
  selectCurrentHistoryId,
  selectCurrentQuestions,
  selectQuestionStatus,
  setQuestionsExpanded,
} from "@/app/features/historySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import SummaryChoices from "./SummaryChoices";
import { MultipleChoice } from "./MultipleChoice";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
const MultipleChoiceList = () => {
  const dispatch = useAppDispatch();

  const expanded = useAppSelector((state) => state.history.questionsExpanded);
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentQuestions = useAppSelector(selectCurrentQuestions);
  const status = useAppSelector(selectQuestionStatus)
  const shouldDisplay =
    currentHistoryId !== "" && currentQuestions.length !== 0 && status!="failed";

  return (
    shouldDisplay?(
      <>
        {expanded ? (
          <>
            {currentQuestions.map((question, index) => {
              return <MultipleChoice key={index} data={question} />;
            })}
            <div
              className='text-sm mb-4 hover:underline hover:text-blue-400 cursor-pointer'
              onClick={() => dispatch(setQuestionsExpanded(false))}
            >
              Minimize
            </div>
          </>
        ) : (
          <SummaryChoices questions={currentQuestions} />
        )}
      </>
    ):(status=="failed"?<div className="flex w-full font-medium text-center justify-center my-8 pr-4 gap-3 items-center text-lg"><ExclamationTriangleIcon className="w-5 h-5"/>Something went wrong.</div>:<></>)
  );
};

export default MultipleChoiceList;
