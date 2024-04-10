import "./styles/App.css";
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
  selectHistory,
} from "./app/features/historySlice";
import { useAppSelector } from "./app/hooks";
import { Button } from "./components/ui/button";
import { useDispatch } from "react-redux";
import MultipleChoiceList from "./components/custom/MultipleChoice/MultipleChoiceList";
import { HistoryObject } from "./types-and-interfaces";
import { sampleHistoryObject } from "./lib/sampledata";
function App() {
  const historyList = useAppSelector(selectHistory);
  const dispatch = useDispatch();

  const handleAddToHistory = () => {
    const historyObjectToAdd = sampleHistoryObject;
    dispatch(addToHistory(historyObjectToAdd as HistoryObject));
  };

  return (
    <div className='app px-10 h-screen flex flex-col bg-[#faf9f6]'>
      <Header />
      <ResizablePanelGroup direction='horizontal' className='overflow-auto'>
        <ResizablePanel defaultSize={25} className='overflow-auto'>
          <SearchHistory history={historyList} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={75}
          className='pl-4 flex flex-col overflow-y-auto'
        >
          <div className='flex-auto overflow-y-auto mb-8 w-full pr-4'>
            <SearchBar />
            <div className='flex flex-col gap-1'>
              <MultipleChoiceList />
              <Button onClick={handleAddToHistory}>Add sample History</Button>
              <Button
                className='mb-4'
                onClick={() => {
                  dispatch(clearHistory());
                }}
              >
                Clear History
              </Button>
            </div>
            <ProductList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
