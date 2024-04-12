import {
  clearHistory,
  selectCurrentHistoryId,
  updateCurrentHistoryId,
} from "@/app/features/historySlice";
import { useAppSelector } from "@/app/hooks";
import { HistoryObject } from "@/types-and-interfaces";
import { useDispatch } from "react-redux";
import { FC } from "react";
import { Button } from "../ui/button";

interface SearchHistoryProps {
  history: HistoryObject[];
}
const SearchHistory: FC<SearchHistoryProps> = ({ history }) => {
  const dispatch = useDispatch();
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);

  const historyObjectStyles = (id: string) => {
    const backgroundColor =
      currentHistoryId === id ? "bg-[#475569]" : "bg-[#0043A2]/40";

    return `flex items-center rounded min-h-14 p-3  border-gray-400 text-white ${backgroundColor} hover:bg-[#475569] font-bold text-md cursor-pointer truncate`;
  };

  const handleClick = (id: string) =>
    dispatch(updateCurrentHistoryId({ historyId: id }));

  return (
    <div className='flex gap-2 flex-col pr-4 overflow-y-auto h-full rounded'>
      <div className='flex flex-row justify-between mb-4'>
        <Button
          className='grow mr-2 rounded-3xl bg-slate-300'
          onClick={() => {
            dispatch(clearHistory());
          }}
        >
          Clear History
        </Button>
        <Button
          className='rounded-3xl bg-slate-500'
          onClick={() => handleClick("")}
        >
          + New Search
        </Button>
      </div>
      {history.map((historyObj, index) => {
        return (
          <div
            key={index}
            className={historyObjectStyles(historyObj.id)}
            onClick={() => handleClick(historyObj.id)}
          >
            {historyObj.name}
          </div>
        );
      })}
    </div>
  );
};

export default SearchHistory;
