import { MultipleChoiceObject } from "@/types-and-interfaces";
import { Button } from "../ui/button";
interface MultipleChoiceQuestionProps {
  questionObj: MultipleChoiceObject;
  handleOptionSelect: (id: string, option: string) => void;
  handleOtherInput: (id: string, option: string) => void;
}
const MulitpleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionObj,
  handleOptionSelect,
  handleOtherInput,
}) => {
  return (
    <div className='p-4 w-full'>
      <p className='font-medium'>{questionObj.question}</p>
      <div className='w-full my-2 flex gap-2'>
        {questionObj.answers.map((option, optionIndex) => {
          if (option.selected) {
            return (
              <Button
                key={optionIndex}
                className='rounded-3xl p-4 border bg-[#FFCA3A] text-black border-[#A67900] hover:bg-white hover:border-[#6C5C94]'
                onClick={() => {
                  handleOptionSelect(questionObj.id, option.text);
                }}
              >
                {option.text}
              </Button>
            );
          } else {
            return (
              <Button
                key={optionIndex}
                className='rounded-3xl p-4 border bg-white text-black border-[#6C5C94] hover:bg-[#FFCA3A] hover:border-[#A67900]'
                onClick={() => {
                  handleOptionSelect(questionObj.id, option.text);
                }}
              >
                {option.text}
              </Button>
            );
          }
        })}
        <input
          className='border border-black p-2 rounded-lg'
          placeholder='Other'
          value={questionObj.other}
          onChange={(event) => {
            handleOtherInput(questionObj.id, event.target.value);
          }}
        ></input>
      </div>
    </div>
  );
};

export default MulitpleChoiceQuestion;
