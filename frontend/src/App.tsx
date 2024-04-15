import "./styles/App.css";
import Header from "./components/custom/Header";
import SearchBar from "./components/custom/SearchBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SearchHistory from "./components/custom/SearchHistory";
import { ProductList } from "./components/custom/ProductList/ProductList";
import { selectHistory } from "./app/features/historySlice";
import { useAppSelector } from "./app/hooks";
import MultipleChoiceList from "./components/custom/MultipleChoice/MultipleChoiceList";

function App() {
  const historyList = useAppSelector(selectHistory);

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
            <MultipleChoiceList />
            <ProductList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
