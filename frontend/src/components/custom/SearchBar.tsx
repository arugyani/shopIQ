import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { v4 as uuid } from "uuid";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/LoadingSpinner";

import {
  questionsAsync,
  selectCurrentHistoryId,
  selectCurrentQuery,
  selectQuestionStatus,
  setQuestionsExpanded,
} from "@/app/features/historySlice";

const placeholders = [
  "Cheap sports camera",
  "What's the best TV for me?",
  "High quality camping gear",
  "Best wireless headphones for jogging",
  "Affordable home office desk ideas",
  "Top-rated gaming PCs under $1000",
  "Best beginner tennis racket",
  "Lightweight travel backpack",
  "Powerful blender for smoothies",
  "Noise-cancelling headphones for work",
  "Durable smartwatch with fitness tracking",
  "Compact and portable projector",
  "High-end mirrorless camera for photography",
  "Ergonomic office chair for long hours",
  "Stylish and functional messenger bag",
  "Smart home security system",
  "Professional-grade espresso machine",
  "Ultra-wide curved gaming monitor",
  "Powerful laptop for video editing",
  "Versatile multifunctional printer",
];

const SearchBar = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectQuestionStatus);
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentQuery = useAppSelector(selectCurrentQuery);

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (currentHistoryId === "") {
      setQuery("");
    } else {
      setQuery(currentQuery);
    }
  }, [currentHistoryId, currentQuery]);

  const randomPlaceholder = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.length <= 75) {
      setQuery(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const historyId = currentHistoryId !== "" ? currentHistoryId : uuid();

    dispatch(questionsAsync({ search: query, historyId }));
    dispatch(setQuestionsExpanded(true));
  };

  const iconClasses = "text-gray-500 w-5 h-5 mr-2";

  return (
    <form
      onSubmit={handleSubmit}
      className='search-bar flex flex-row items-center border border-1 border-[#E1E1E1] rounded-full px-3 bg-[#334155]/5 w-full'
    >
      {status === "loading" ? (
        <LoadingSpinner className={iconClasses} />
      ) : (
        <SearchIcon className={iconClasses} />
      )}
      <Input
        type='text'
        placeholder={`${randomPlaceholder}...`}
        className='flex-1 border-0 pl-0 focus-visible:outline-none bg-transparent text-gray-500'
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
