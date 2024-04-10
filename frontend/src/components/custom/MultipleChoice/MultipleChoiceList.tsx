import {
  selectCurrentHistoryId,
  selectCurrentQuestions,
} from "@/app/features/historySlice";
import { useAppSelector } from "@/app/hooks";
import { useState } from "react";
import SummaryChoices from "./SummaryChoices";
import { MultipleChoice } from "./MultipleChoice";

const MultipleChoiceList = () => {
  const [expanded, setExpanded] = useState(false);

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
              onClick={() => setExpanded(false)}
            >
              Minimize
            </div>
          </>
        ) : (
          <SummaryChoices
            setExpanded={setExpanded}
            questions={currentQuestions}
          />
        )}
      </>
    )
  );
};

export default MultipleChoiceList;
