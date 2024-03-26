import { HistoryObject } from "@/types-and-interfaces";
import { useState } from "react";

interface SearchHistoryProps {
  history: HistoryObject[];
}
const SearchHistory: React.FC<SearchHistoryProps> = ({ history }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <div className="flex gap-2 flex-col px-2 overflow-auto h-full">
      {history.map((historyObj, historyIndex) => {
        if (selectedItem == historyIndex) {
          return (
            <div
              key={historyIndex}
              className="rounded border-2 border-gray-400 p-2 bg-[#475569] justify-center text-white hover:bg-[#475569] font-bold"
            >
              {historyObj.name}
            </div>
          );
        } else {
          return (
            <div
              key={historyIndex}
              className="rounded border-2 border-gray-400 p-2 bg-[#0043A2]/40 justify-center text-white hover:bg-[#475569] font-bold"
              onClick={() => {
                setSelectedItem(historyIndex);
              }}
            >
              {historyObj.name}
            </div>
          );
        }
      })}
    </div>
  );
};

export default SearchHistory;
