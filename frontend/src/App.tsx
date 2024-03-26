import "./App.css";
import Header from "./components/custom/Header";
import SearchBar from "./components/custom/SearchBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SearchHistory from "./components/custom/SearchHistory";
import { addToHistory, clearHistory, selectHistory } from "./app/features/historySlice";
import { useAppSelector } from "./app/hooks";
import { Button } from "./components/ui/button";
import { useDispatch } from "react-redux";

function App() {
    const historyList = useAppSelector(selectHistory);
    const dispatch = useDispatch();
  
    const handleAddToHistory = () => {
      const historyObjectToAdd = {
        id: "34532465345",
        name: "Coffee Grinder",
        svg: "mixer.svg", 
      };
      dispatch(addToHistory(historyObjectToAdd));
    };
  
  return (
    <div className="app px-10 h-[92vh]">
      <Header />
      <ResizablePanelGroup
        direction="horizontal"
        className="overflow-auto"
      >
        <ResizablePanel
          defaultSize={25}
          className="overflow-auto"
        >
          <SearchHistory history={historyList} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={75}
          className="px-8 flex flex-col"
        >
          <SearchBar />
          <div className="flex grow flex-col gap-1">
            <div>Multiple choice and LLM Interactions with Products</div>
            <Button onClick={handleAddToHistory}>Add random History</Button>
            <Button onClick={()=>{dispatch(clearHistory())}}>Clear History</Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
