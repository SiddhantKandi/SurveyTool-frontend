import React, { useState, useEffect, useContext } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiConnector } from "../../utils/apiConnector.js";
import Spinner from "../../utils/Spinner.jsx";
import { AnalysisContext } from "../../Context/AnalysisContext.jsx";
import { capitalizeFirstLetter } from "../../utils/constants.js";

export default function CustomAnalysis() {
  const { surveyData, setShowPopup, setSurveyData } =
    useContext(AnalysisContext);

  const { surveyTitle, surveyType, surveyCategory } = useParams();

  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  // Update responses whenever surveyData changes
  useEffect(() => {
    const initialResponses = {};
    surveyData.forEach((question) => {
      initialResponses[question._id] = [];
    });
    setResponses(initialResponses);
  }, [surveyData]);

  const handleCheckboxChange = (questionId, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: prevResponses[questionId]?.includes(option)
        ? prevResponses[questionId].filter((o) => o !== option)
        : [...(prevResponses[questionId] || []), option],
    }));
  };

  const handleRadioChange = (questionId, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: [option], // Store as an array for consistency
    }));
  };

  const getCustomAnalysis = async () => {
    try {
      const url = `answers/getCustomAnalysis/${surveyTitle}/${surveyType}/${surveyCategory}`;
      setLoading(true);
      const response = await apiConnector("GET", url, {}, {}, responses);

      setSurveyData(response?.data?.data);
      toast.success(response.data.message || "Custom survey Analaysis done");
      setResponses({});
      setShowPopup(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error showing custom Analysis"
      );
      setResponses({});
      setShowPopup(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading survey data...</p>;

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 py-5">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-8 overflow-y-auto max-h-full m-4">
            <div>
              <button
                className="top-6 right-7 text-white bg-transparent p-2 rounded-full hover:bg-gray-200 bg-blue-300"
                onClick={() => setShowPopup(false)}
              >
                <IoMdCloseCircle className="text-red-500 text-3xl" />
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Survey options for custom analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {surveyData?.map((questionObject, index) => (
                <div
                  key={index} // Unique key for each question div
                  className="p-6 rounded-lg bg-gray-50 border border-black shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    {`Q${index + 1}. ${capitalizeFirstLetter(
                      questionObject.question
                    )}`}
                  </h3>
                  <ul className="list-none pl-5 space-y-4">
                    {questionObject.options.map((option, optionIndex) => (
                      <li
                        key={`${optionIndex}`} // Unique key for each option
                        className="flex items-center space-x-3 text-gray-600"
                      >
                        {questionObject.questiontype === "multiple select" ? (
                          <>
                            <input
                              type="checkbox"
                              id={`q${index}_o${optionIndex}`}
                              value={option}
                              checked={(
                                responses[questionObject._id] || []
                              ).includes(option)}
                              onChange={() =>
                                handleCheckboxChange(questionObject._id, option)
                              }
                              className="form-checkbox"
                            />
                            <label
                              htmlFor={`q${index}_o${optionIndex}`}
                              className="text-sm font-medium"
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
                              checked={
                                (responses[questionObject._id] || [])[0] ===
                                option
                              }
                              onChange={() =>
                                handleRadioChange(questionObject._id, option)
                              }
                              className="form-radio"
                            />
                            <label
                              htmlFor={`q${index}_o${optionIndex}`}
                              className="text-sm font-medium"
                            >
                              {capitalizeFirstLetter(option)}
                            </label>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                className="bg-green-600 text-white p-4 rounded-lg text-lg font-semibold max-w-xs mx-auto hover:bg-green-700 transition duration-300"
                onClick={getCustomAnalysis}
              >
                Get Custom Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
