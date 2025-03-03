import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoMdRadioButtonOff } from "react-icons/io";
import { LuPlusCircle } from "react-icons/lu";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Spinner from "../../utils/Spinner.jsx";
import { apiConnector } from "../../utils/apiConnector.js";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";
import {capitalizeFirstLetter} from '../../utils/constants.js';

export default function AddQuestion() {
  const { questionsList, setQuestionsList, setShowQuestionBank } =
    useContext(CreateSurveyContext);

  const [jsonData, setJsonData] = useState([]); // Initialize with an empty array
  const [preview, setPreview] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  const [loading, setLoading] = useState(false);

  // Fetch survey data
  const hasFetched = useRef(false);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (hasFetched.current) return; // Prevent duplicate execution
        const url = "questions/getquestions";
        const response = await apiConnector("GET", url, {}, {}, {});
        const data = response?.data?.data;
        if (response?.data?.success) {
          setJsonData(data);
        } else {
          toast.error("Error fetching questions");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch questions"
        );
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark as fetched
      }
    };

    fetchData();
  }, []);

  

  const deletequestion = async (id) => {
    const url = `questions/${id}`;
    const response = await apiConnector("DELETE", url, {}, {}, {});
    if (response?.status) {
      setShowQuestionBank(false);
      toast.success(response.data.message || "Question deleted successfully"); // Extracting the 'message' array
    } else {
      toast.error("Could not delete question, Please try again");
    }
  };

  // Function to delete question from preview
  const deleteFromPreview = (index) => {
    const updatedPreview = preview.filter((_, ind) => ind !== index);
    setPreview(updatedPreview);
  };

  // Function to add question to preview
  const addToPreview = (obj) => {
    // Create a new object with the question in lowercase for storage
    const formattedQuestion = {
      ...obj,
      question: obj.question.toLowerCase(), // Convert question to lowercase
    };

    if (!preview.some((item) => item._id === formattedQuestion._id)) {
      setPreview([...preview, formattedQuestion]);
    }
  };

  const addingQuestions = () => {
    // Filter out questions from 'preview' that already exist in 'questionsList'
    const uniquePreviewQuestions = preview.filter(
      (previewQuestion) =>
        !questionsList.some(
          (existingQuestion) =>
            existingQuestion.question.toLowerCase() ===
            previewQuestion.question.toLowerCase()
        )
    );

    // If no new questions to add, alert the user
    if (uniquePreviewQuestions.length === 0) {
      toast.error(
        "No new questions to add. All questions already exists in the database."
      );
      return;
    }

    // Add unique questions to the existing list
    const newQuestionsList = [...questionsList, ...uniquePreviewQuestions];

    // Update the state
    setQuestionsList(newQuestionsList);
    setPreview([]); // Clear the preview after adding
    setShowQuestionBank(false);
  };

  // Filtered questions based on search input
  const filteredQuestions = useMemo(
    () =>
      jsonData.filter((question) =>
        question.question.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [jsonData, searchInput]
  );

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 py-1">
          <div className="relative bg-white shadow-md w-10/12 h-5/6">
            {/* Header div with full width and gray border */}
            <div className="relative w-full h-10 border border-gray-400 p-0 m-0">
              <h2 className="text-2xl font-bold absolute top-1 left-4">
                Question Bank
              </h2>
              <button
                onClick={() => {
                  setShowQuestionBank(false);
                }}
                className="flex flex-row absolute right-1 text-black rounded-md bg-red-400 pl-1 pr-1 m-0 items-center justify-center text-sm top-1"
              >
                <MdClose className="text-xl text-black" />
              </button>
            </div>

            {/* Flex container to align slate and green divs side by side */}
            <div className="flex w-full h-[calc(100%-40px)]">
              {/* Slate div (9/12 width) */}
              <div className="w-8/12 h-full border border-r-2 border-r-black box-border bg-slate-100 p-3 overflow-y-auto">
                {/* Search bar */}
                <div className="relative border border-black w-full h-10 mb-3">
                  <div className="flex flex-row h-full w-full">
                    {/* Input field with search icon */}
                    <div className="flex items-center w-10/12 p-2">
                      <CiSearch className="ml-1" />
                      <input
                        className="w-full p-2 h-8 bg-slate-100 focus:outline-none"
                        type="text"
                        placeholder="Search for the question in the question bank"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)} // Update search input on change
                      />
                    </div>
                  </div>
                </div>

                {/* Questions grid */}
                <div className="grid grid-cols-2 gap-4">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={question._id} // Ensure question._id is unique for each question
                      className="p-2 bg-white border border-gray-300 rounded-md"
                    >
                      <div className="p-2">
                        <div className="flex flex-col mb-4">
                          <div className="flex flex-row items-center justify-between mb-1">
                            <div className="flex items-center ">
                              <LuPlusCircle
                                className="mr-2 text-xl text-green-300 cursor-pointer"
                                onClick={() => addToPreview(question)}
                              />
                              {capitalizeFirstLetter(question.question)}
                            </div>
                            <MdDelete
                              className="text-xl text-red-700 cursor-pointer flex items-center"
                              onClick={() => deletequestion(question._id)}
                            />
                          </div>
                          <div className="flex text-center items-center px-4 text-red-400">
                            ({capitalizeFirstLetter(question.questiontype)})
                          </div>
                        </div>

                        {/* Display options as an unordered list */}
                        <ul className="list-disc pl-5">
                          {question.options.map((option, optionIndex) => (
                            <li
                              key={optionIndex}
                              className="flex items-center mb-2 text-sm"
                            >
                              {question.questiontype === "multiple select" ? (
                                <>
                                  <input
                                    type="checkbox"
                                    id={`q${index}_o${optionIndex}`}
                                    value={option}
                                    className="mr-2"
                                    disabled // Disable selection
                                  />
                                  <label
                                    htmlFor={`q${index}_o${optionIndex}`}
                                    className="text-gray-700"
                                  >
                                    {capitalizeFirstLetter(option)}
                                  </label>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="radio"
                                    name={`q${index}`}
                                    id={`q${index}_o${optionIndex}`}
                                    value={option}
                                    className="mr-2"
                                    disabled // Disable selection
                                  />
                                  <label
                                    htmlFor={`q${index}_o${optionIndex}`}
                                    className="text-gray-700"
                                  >
                                    {capitalizeFirstLetter(option)}
                                  </label>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Green div (3/12 width) */}
              <div className="w-4/12 h-full p-4 flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Preview</h3>
                {/* Preview area with scroll */}
                <div className="flex-grow overflow-y-auto">
                  {preview?.map((obj, index) => (
                    <div
                      key={obj._id} // Ensure each previewed question also has a unique key
                      className="p-2 mb-3 bg-white border border-gray-300 rounded-md"
                    >
                      <div className="p-2">
                        <div className="flex flex-row items-center mb-2">
                          {capitalizeFirstLetter(obj.question)}{" "}
                          {/* Displaying capitalized */}
                          <RiCloseCircleLine
                            className=" text-2xl ml-3 text-red-500 cursor-pointer"
                            onClick={() => deleteFromPreview(index)}
                          />
                        </div>
                        <ul>
                          {obj.options.length > 0 ? (
                            obj.options.map((option, index) => (
                              <li
                                key={index} // Using index is okay here since options don't change dynamically
                                className="flex flex-row items-center mb-1 text-sm"
                              >
                                <IoMdRadioButtonOff className="text-gray-500 text-xl mr-2" />
                                {capitalizeFirstLetter(option)}{" "}
                                {/* Capitalizing the first letter */}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 text-sm">
                              <textarea
                                value={""}
                                onChange={() => {}}
                                maxLength={300}
                                placeholder="Type your answer (max 300 characters)"
                                className="w-full p-2 border rounded-lg"
                              />
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Button at the bottom */}
                <button
                  className="bg-green-500 text-white w-full p-3 rounded-md mt-4"
                  onClick={addingQuestions}
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
