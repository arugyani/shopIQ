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
  selectHistory,
} from "./app/features/historySlice";
import { useAppSelector } from "./app/hooks";
import { Button } from "./components/ui/button";
import { useDispatch } from "react-redux";

function App() {
  const historyList = useAppSelector(selectHistory);
  const dispatch = useDispatch();

  const handleAddToHistory = () => {
    const historyObjectToAdd = {
      id: "34532465345",
      name: "Coffee Grinder for Use in an Office",
      svg: "mixer.svg",
    };
    dispatch(addToHistory(historyObjectToAdd));
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
          <div className='flex-auto overflow-y-auto mb-8 w-full pr-4'>
            <SearchBar />
            <div className='flex grow flex-col gap-1'>
              <div>Multiple choice and LLM Interactions with Products</div>
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
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
