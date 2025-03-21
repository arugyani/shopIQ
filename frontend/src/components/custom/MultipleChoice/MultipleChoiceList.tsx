import {
  selectCurrentHistoryId,
  selectCurrentQuestions,
  setQuestionsExpanded,
} from "@/app/features/historySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import SummaryChoices from "./SummaryChoices";
import { MultipleChoice } from "./MultipleChoice";

const MultipleChoiceList = () => {
  const dispatch = useAppDispatch();

  const expanded = useAppSelector((state) => state.history.questionsExpanded);
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentQuestions = useAppSelector(selectCurrentQuestions);

  const shouldDisplay =
    currentHistoryId !== "" && currentQuestions.length !== 0;

  return (
    shouldDisplay && (
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
    )
  );
};

export default MultipleChoiceList;
