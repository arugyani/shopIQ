import {
  selectCurrentHistoryId,
  updateCurrentHistoryId,
} from "@/app/features/historySlice";
import { useAppSelector } from "@/app/hooks";
import { HistoryObject } from "@/types-and-interfaces";
import { useDispatch } from "react-redux";
import { FC } from "react";

interface SearchHistoryProps {
  history: HistoryObject[];
}
const SearchHistory: FC<SearchHistoryProps> = ({ history }) => {
  const dispatch = useDispatch();
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);

  const historyObjectStyles = (id: string) => {
    return `
      rounded
      min-h-10
      border-gray-400
      p-2
      justify-center
      text-white
      bg-${currentHistoryId === id ? "[#475569]" : "[#0043A2]/40"}
      hover:bg-[#475569]
      font-bold truncate
      cursor-pointer`;
  };

  const handleClick = (id: string) =>
    dispatch(updateCurrentHistoryId({ historyId: id }));

  return (
    <div className='flex gap-2 flex-col px-4 mr-2 overflow-auto h-full rounded'>
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
