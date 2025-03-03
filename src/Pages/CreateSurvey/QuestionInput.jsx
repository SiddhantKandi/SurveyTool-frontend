import React, { useContext } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";
import {capitalizeFirstLetter} from '../../utils/constants.js';

const QuestionInput = () => {
  const {
    questionsList,
    question = { number: questionsList.length + 1, text: question },
    optionsType,
    dropdownVisible,
    setDropdownVisible,
    questioncategory,
    setquestionCategory,
    setQuestion,
    setOptionsType,
    setShowOptionsInput,
    setOptionValues
  } = useContext(CreateSurveyContext);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handlecategorychange = (event) => {
    setquestionCategory(event.target.value);
  };

const handleOptionClick = (questiontype) => {
  setOptionsType(questiontype);
  setDropdownVisible(false);
  setShowOptionsInput(true);
  setOptionValues(
    questiontype === "dichotomous"
      ? ["", ""]
      : questiontype === "multiple select" || questiontype === "single choice"
      ? ["", "", "", ""]
      : []
  );
};

  return (
    <div className="flex flex-row bg-slate-300 w-auto h-48 mt-4 mb-4 ml-3 mr-3 justify-center items-center border border-black">
      {/* Question component*/}
      <h3 className="ml-0">Q{question.number}</h3>
      <div className="flex flex-row w-7/12 ml-0">
        <input
          type="text"
          value={question.text}
          onChange={handleQuestionChange}
          className="mx-2 text-xl bg-indigo-100 p-2 w-full rounded-lg shadow-md border border-black text-center placeholder-gray-400 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-red-200"
          placeholder="Enter your question here"
        />
      </div>

      {/* Questioncategory component*/}
      <div className="flex flex-row w-2/12 ml-2">
        <input
          type="text"
          value={questioncategory}
          onChange={handlecategorychange}
          className="mx-2 text-sm bg-indigo-100 p-2 w-full rounded-lg shadow-md border border-black text-center placeholder-gray-400 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-red-200"
          placeholder="Enter the question category"
        />
      </div>

      {/* QuestionType component*/}
      <div className="w-2/12 ml-2 relative">
        <button
          onClick={toggleDropdown}
          aria-expanded={dropdownVisible}
          className="flex flex-row mx-2 text-l bg-indigo-100 p-2 w-full rounded-lg shadow-md border border-black text-center focus:outline-none focus:ring-1 focus:ring-red-200 justify-center items-center"
        >
          {capitalizeFirstLetter(optionsType)}
          <IoIosArrowDropdownCircle className="ml-3" />
        </button>

        {dropdownVisible && (
          <ul className="option-dropdown absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {["multiple select", "dichotomous", "single choice"].map((type) => (
              <li
                key={type}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOptionClick(type)}
              >
                {capitalizeFirstLetter(type)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuestionInput;
