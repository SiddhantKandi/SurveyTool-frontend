import React, { useState, useContext } from "react";
import { IoMdRadioButtonOff } from "react-icons/io";
import { MdEdit, MdDelete, MdSave, MdAdd } from "react-icons/md";
import { CreateSurveyContext } from "../Context/CreateSurveyContext.jsx";
import { capitalizeFirstLetter } from "../utils/constants.js";

//Displaying question on the frontend of the create survey component
export default function Question() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedOptions, setEditedOptions] = useState([]);

  const { setQuestionsList, questionsList } = useContext(CreateSurveyContext);

  //Edit function to edit question
  const handleEdit = (index, questionText, options) => {
    setEditingIndex(index);
    setEditedQuestion(questionText);
    setEditedOptions(options);
  };


  const handleDelete = (index) => {
    setQuestionsList((prevList) => prevList.filter((_, i) => i !== index));
  };

  //Edit function to edit question options
  const handleOptionChange = (optionIndex, value) => {
    setEditedOptions((prevOptions) =>
      prevOptions.map((option, index) =>
        index === optionIndex ? value : option
      )
    );
  };

  const SaveQuestion = (index, updatedData) => {
    setQuestionsList((prevList) =>
      prevList.map((q, i) => (i === index ? { ...q, ...updatedData } : q))
    );
  };

  //deleting the option
  const handleDeleteOption = (optionIndex) => {
    setEditedOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== optionIndex)
    );
  };

  //Add options
  const handleAddOption = () => {
    setEditedOptions((prevOptions) => [...prevOptions, ""]);
  };

  //saving the question details
  const handleSave = (index) => {
    SaveQuestion(index, {
      question: editedQuestion,
      options: editedOptions,
    });
    setEditingIndex(null);
    setEditedOptions([]); // Clear options after saving
  };

  if (questionsList.length === 0) {
    return null; // Do not render anything if there are no questions
  }

  return (
    <div className="mb-8">
      {questionsList.map((question, questionIndex) => {
        const filteredOptions = question.options
          ? question.options.filter(
              (option) => option.trim() && option.trim().toLowerCase() !== "na"
            )
          : [];

        return (
          <div
            key={questionIndex}
            className="relative mb-4 p-4 border border-white border-b-2 rounded-lg hover:shadow-lg transition-shadow duration-200 group bg-gray-100"
          >
            <div className="pr-36">
              <div className="flex items-center">
                <h4 className="text-lg font-bold mr-2">{`Q${
                  questionIndex + 1
                }`}</h4>
                {editingIndex === questionIndex ? (
                  <input
                    type="text"
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="w-full p-1 border border-white border-b-2 rounded"
                  />
                ) : (
                  <p>{capitalizeFirstLetter(question.question)}</p> // Capitalize the first letter
                )}
              </div>

              {question.questiontype === "Descriptive" ? (
                <div className="mt-2 p-4 border border-gray-100 rounded bg-gray-100">
                  <textarea
                    className="w-full p-2 border border-white border-b-4 rounded"
                    placeholder="Type your answer here"
                  />
                </div>
              ) : (
                <div className="flex flex-col mt-2">
                  {editingIndex === questionIndex
                    ? editedOptions.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-1"
                        >
                          <IoMdRadioButtonOff className="text-gray-500 text-xl mr-2" />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(optionIndex, e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded mr-2"
                          />
                          <button
                            onClick={() => handleDeleteOption(optionIndex)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-200"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      ))
                    : filteredOptions.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-1"
                        >
                          <IoMdRadioButtonOff className="text-gray-500 text-xl mr-2" />
                          <p>{capitalizeFirstLetter(option)}</p>
                        </div>
                      ))}
                </div>
              )}

              {/* Add new option button (shown during editing) */}
              {editingIndex === questionIndex && (
                <div className="flex items-center mt-4">
                  <button
                    onClick={handleAddOption}
                    className="flex items-center bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                  >
                    Add Option <MdAdd className="ml-2" />
                  </button>
                </div>
              )}
            </div>

            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {editingIndex === questionIndex ? (
                <button
                  onClick={() => handleSave(questionIndex)}
                  className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Save <MdSave className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleEdit(
                      questionIndex,
                      question.question,
                      filteredOptions
                    )
                  }
                  className="flex items-center bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Edit <MdEdit className="ml-2" />
                </button>
              )}
              <button
                onClick={() => handleDelete(questionIndex)}
                className="flex items-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete <MdDelete className="ml-2" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
