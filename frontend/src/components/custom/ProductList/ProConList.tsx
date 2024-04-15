import { ProConType } from "@/types-and-interfaces";
import { FC } from "react";

export interface ProConListProps {
  pros: ProConType;
  cons: ProConType;
}

export interface ProConItemProps {
  text: string;
  value: string;
  color: string;
}

const ProConItem: FC<ProConItemProps> = ({ text, value, color }) => {
  return (
    <div className='grid grid-cols-2 items-center'>
      <h1 className='text-md font-bold text-left'>{text}</h1>
      <div
        className='h-4 rounded-r-3xl'
        style={{
          width: `${parseInt(value) * 20}px`,
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};

const ProConList: FC<ProConListProps> = ({ pros, cons }) => {
  const green = "#4ade80";
  const red = "#f87171";

  return (
    <div className='flex flex-col gap-2'>
      {Object.entries(pros).map(([key, value]) => (
        <ProConItem key={key} text={key} value={value} color={green} />
      ))}

      {Object.entries(cons).map(([key, value]) => (
        <ProConItem key={key} text={key} value={value} color={red} />
      ))}
    </div>
  );
};

export default ProConList;
