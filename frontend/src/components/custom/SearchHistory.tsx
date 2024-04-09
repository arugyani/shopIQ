import { selectCurrentHistoryId, updateCurrentHistoryId } from "@/app/features/historySlice";
import { useAppSelector } from "@/app/hooks";
import { HistoryObject } from "@/types-and-interfaces";
import { useDispatch } from "react-redux";

interface SearchHistoryProps {
  history: HistoryObject[];
}
const SearchHistory: React.FC<SearchHistoryProps> = ({ history }) => {
  const dispatch = useDispatch();
  const currentHistoryId = useAppSelector(selectCurrentHistoryId)
  
  return (
    <div className="flex gap-2 flex-col px-4 overflow-auto h-full">
      {history.map((historyObj, historyIndex) => {
        if (currentHistoryId == historyObj.id) {
          return (
            <div
              key={historyIndex}
              className="rounded min-h-10 border-gray-400 p-2 bg-[#475569] justify-center text-white hover:bg-[#475569] font-bold truncate"
            >
              {historyObj.name}
            </div>
          );
        } else {
          return (
            <div
              key={historyIndex}
              className="rounded min-h-10 border-none p-2 bg-[#0043A2]/40 justify-center text-white hover:bg-[#475569] font-bold truncate"
              onClick={() => {
                dispatch(updateCurrentHistoryId({historyId: historyObj.id}));
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
