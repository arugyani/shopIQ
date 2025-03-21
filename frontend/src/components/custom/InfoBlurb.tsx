// import { ChangeEvent, FormEvent, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { Info } from "lucide-react";
import { FC } from "react";
// import { Input } from "../ui/input";
// import { LoadingSpinner } from "../ui/LoadingSpinner";

interface InfoBlurbProps{
  info: string;
}

const InfoBlurb: FC<InfoBlurbProps> = ({ info }) => {
  return (
    <div className="relative group ">
      <Info className="cursor-pointer text-gray-500 w-4"/>
      <div className="absolute bottom-4 min-w-60 max-w-96 left-10 opacity-0 z-10 text-sm bg-white p-2 border rounded shadow-lg transition-opacity group-hover:opacity-100">
        {info}
      </div>
    </div>
  );
};

export default InfoBlurb;

