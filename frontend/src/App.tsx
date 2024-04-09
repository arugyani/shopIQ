import "./App.css";
import Header from "./components/custom/Header";
import SearchBar from "./components/custom/SearchBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SearchHistory from "./components/custom/SearchHistory";
import { ProductList } from "./components/custom/ProductList";
import {
  addToHistory,
  clearHistory,
  selectCurrentHistoryId,
  selectHistory,
  updateQuestion,
} from "./app/features/historySlice";
import { useAppSelector } from "./app/hooks";
import { Button } from "./components/ui/button";
import { useDispatch } from "react-redux";
import MulitpleChoiceQuestion from "./components/custom/MulitpleChoiceQuestion";
import { MultipleChoiceObject } from "./types-and-interfaces";
import { useEffect, useState } from "react";
function App() {
  const historyList = useAppSelector(selectHistory);
  const dispatch = useDispatch();
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const [interactionsExpanded, setInteractionsExpanded] = useState(false);
  const [MultipleChoiceData, setMultipleChoiceData] = useState<
    MultipleChoiceObject[]
  >([]);
  useEffect(() => {
    if (currentHistoryId != "" && historyList.length > 0) {
      const currentQuestions = historyList.find(
        (historyObj) => historyObj.id == currentHistoryId
      )?.questions;
      if (currentQuestions) {
        setMultipleChoiceData(currentQuestions);
      }
    }
  }, [currentHistoryId, historyList]);

  const handleAddToHistory = () => {
    const historyObjectToAdd = {
      id: "3453345",
      name: "Coffee Grinder for Use in an Office",
      svg: "mixer.svg",
      questions: [
        {
          id: "1",
          question: "Where will you use this?",
          answers: [
            { text: "At Home", selected: true },
            { text: "At Home", selected: false },
            { text: "In Office", selected: false },
            { text: "Outside", selected: false },
          ],
          other: "",
          multipleAnswers: false,
        },

        {
          id: "2",
          question: "Where will you use this?",
          answers: [
            { text: "At Home", selected: false },
            { text: "At Home", selected: false },
            { text: "In Office", selected: false },
            { text: "Outside", selected: false },
          ],
          other: "string",
          multipleAnswers: true,
        },
        {
          id: "3",
          question: "Where will you use this?",
          answers: [
            { text: "At Home", selected: false },
            { text: "At Home", selected: false },
            { text: "In Office", selected: false },
            { text: "Outside", selected: false },
          ],
          other: "string",
          multipleAnswers: true,
        },
        {
          id: "4",
          question: "Where will you use this?",
          answers: [
            { text: "At Home", selected: false },
            { text: "At Home", selected: false },
            { text: "In Office", selected: false },
            { text: "Outside", selected: false },
          ],
          other: "string",
          multipleAnswers: true,
        },
      ],
      products: [],
    };
    dispatch(addToHistory(historyObjectToAdd));
  };

  const handleMulitpleChoiceSelection = (id: string, option: string) => {
    console.log("Selected", id, option);
    MultipleChoiceData.forEach((multiplechoicequestion) => {
      if (multiplechoicequestion.id == id) {
        var updatedMultipleChoice = { ...multiplechoicequestion };
        updatedMultipleChoice.answers = updatedMultipleChoice.answers.map(
          (choice) => {
            if (choice.text == option) {
              return { text: choice.text, selected: !choice.selected };
            } else {
              if (multiplechoicequestion.multipleAnswers) {
                return choice;
              } else {
                return { text: choice.text, selected: false };
              }
            }
          }
        );
        dispatch(
          updateQuestion({
            historyId: currentHistoryId,
            question: updatedMultipleChoice,
          })
        );
      }
    });
  };
  const handleOtherInput = (id: string, option: string) => {
    MultipleChoiceData.forEach((multiplechoicequestion) => {
      if (multiplechoicequestion.id == id) {
        const updatedMultipleChoice = {
          ...multiplechoicequestion,
          other: option,
        };
        dispatch(
          updateQuestion({
            historyId: currentHistoryId,
            question: updatedMultipleChoice,
          })
        );
      }
    });
  };

  return (
    <div className='app px-10 h-screen flex flex-col'>
      <Header />
      <ResizablePanelGroup direction='horizontal' className='overflow-auto'>
        <ResizablePanel defaultSize={25} className='overflow-auto'>
          <SearchHistory history={historyList} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={75}
          className='px-8 flex flex-col overflow-y-auto'
        >
          <SearchBar />
          <div className="flex grow flex-col gap-1">
            <div>
              {currentHistoryId != "" &&
              MultipleChoiceData.length > 0 &&
              interactionsExpanded ? (
                <>
                  {MultipleChoiceData.map((questionObj) => {
                    return (
                      <MulitpleChoiceQuestion
                        questionObj={questionObj}
                        handleOptionSelect={handleMulitpleChoiceSelection}
                        handleOtherInput={handleOtherInput}
                      ></MulitpleChoiceQuestion>
                    );
                  })}
                  <div className="text-sm p-4 hover:underline hover:text-blue-400" onClick={()=>{setInteractionsExpanded(false)}}>Minimize</div>
                </>
              ) : (
                <></>
              )}
              {currentHistoryId != "" &&
              MultipleChoiceData.length > 0 &&
              !interactionsExpanded ? (
                <div
                  className="rounded-xl border p-4 my-4 flex gap-2 overflow-auto flex-wrap hover:bg-slate-50"
                  onClick={() => {
                    setInteractionsExpanded(true);
                  }}
                >
                  {MultipleChoiceData.map((questionObj) => {
                    return questionObj.answers.map((option) => {
                      if (option.selected) {
                        return (
                          <div className="rounded-3xl p-2 border bg-[#FFCA3A] text-black border-[#A67900] text-sm min-w-24 max-h-12 flex justify-center">
                            {option.text}
                          </div>
                        );
                      }
                    });
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>
            <Button onClick={handleAddToHistory}>Add random History</Button>
            <Button
              onClick={() => {
                dispatch(clearHistory());
              }}
            >
              Clear History
            </Button>
          </div>
          <ProductList />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
