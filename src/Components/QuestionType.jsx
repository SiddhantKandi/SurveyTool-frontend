import React, { useContext, useEffect, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { LuMinusCircle } from "react-icons/lu";
import { MdAddCircleOutline } from "react-icons/md";
import {CreateSurveyContext} from '../Context/CreateSurveyContext.jsx';

const QuestionType = () => {

  const {optionsType, optionValues, setOptionValues ,setShowOptionsInput} = useContext(CreateSurveyContext);

  // Reset options based on the question type using useEffect
  useEffect(() => {
    const defaultOptions = () => {
      switch (optionsType) {
        case "dichotomous":
          return ["", ""];
        case "multiple select":
          return ["", "", "", ""]
        case "single choice":
          return ["", "", "", ""];
        default:
          return [];
      }
    };
    setOptionValues(defaultOptions());
  }, [optionsType, setOptionValues]);

  const handleClose = () => {
    // Clear option values when closing
    setShowOptionsInput(false);
    setOptionValues([]);
  };

  // Memoized function to handle option input changes
  const handleOptionInputChange = useCallback((index, event) => {
    setOptionValues(prevOptions => {
      const newOptions = [...prevOptions];
      newOptions[index] = event.target.value;
      return newOptions;
    });
  }, [setOptionValues]);

  // Memoized function to add a new option
  const addOption = useCallback(() => {
    setOptionValues(prevOptions => [...prevOptions, ""]);
  }, [setOptionValues]);

  // Memoized function to remove an option
  const handleRemoveOption = useCallback((index) => {
    setOptionValues(prevOptions => (
      prevOptions.length > 1 ? prevOptions.filter((_, i) => i !== index) : prevOptions
    ));
  }, [setOptionValues]);

  return (
    <div className="w-full bg-white p-4 mt-2 rounded-lg shadow-md relative pt-10">
      {/* Close Icon */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-black font-extrabold text-3xl"
      >
        <MdClose />
      </button>

      {/* Render UI based on question type */}
      {["multiple select", "single choice", "dichotomous"].includes(optionsType) && (
        <>
          {optionValues.map((value, index) => (
            <div
              key={index}
              className="flex flex-row mb-2 justify-center items-center"
            >
              <input
                type="text"
                value={value}
                onChange={(e) => handleOptionInputChange(index, e)}
                className="w-11/12 p-2 border rounded-lg pr-4"
                placeholder={`Option ${index + 1}`}
              />
              {optionsType !== "Dichotomous" && (
                <MdAddCircleOutline
                  className="ml-2 text-3xl cursor-pointer"
                  onClick={addOption}
                />
              )}
              {optionValues.length > 2 && (
                <LuMinusCircle
                  className="ml-2 text-2xl cursor-pointer"
                  onClick={() => handleRemoveOption(index)}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default QuestionType;
