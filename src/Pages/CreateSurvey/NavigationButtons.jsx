import React from "react";

const NavigationButtons = ({onAddQuestion }) => {
  return (
    <div className="relative flex flex-col justify-center items-center h-full">
      <div className="flex flex-row">
      </div>
      <div className="mt-5 flex justify-center items-center">
        <button
          className="flex mt-4 bg-black text-white p-5 rounded-lg items-center justify-center border border-b-2 border-white"
          onClick={onAddQuestion}
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
