import { ChangeEvent, FormEvent, useState } from "react";
import { useAppDispatch } from "@/app/hooks";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { questionsAsync } from "@/app/features/questionSlice";

const placeholders = [
  "I want to buy a cheap sports camera",
  "What's the best TV for me?",
  "High quality camping gear",
  "Best wireless headphones for jogging",
  "Affordable home office desk ideas",
  "Top-rated gaming PCs under $1000",
  "Best beginner tennis racket",
];

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");

  const randomPlaceholder = (): string => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.length <= 75) {
      setQuery(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(questionsAsync(query));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='search-bar flex flex-row items-center border border-1 rounded-full px-3'
    >
      <SearchIcon className='text-gray-500 w-5 h-5 mr-2' />
      <Input
        type='text'
        placeholder={`${randomPlaceholder()}...`}
        className='flex-1 border-0 pl-0 focus-visible:outline-none'
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
