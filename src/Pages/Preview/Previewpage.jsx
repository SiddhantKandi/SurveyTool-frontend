import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdRadioButtonOff } from "react-icons/io";
import { MdEdit, MdDelete, MdSave } from "react-icons/md";
import { toast } from "react-toastify";
import { apiConnector } from "../../utils/apiConnector.js";
import Spinner from "../../utils/Spinner.jsx";
import Logo from "../../assets/Logo.png";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import { capitalizeFirstLetter } from "../../utils/constants.js";
import File from "./File.jsx";

const Preview = () => {
  const { surveyTitle, surveyType, surveyCategory } = useParams(); // Capture surveyTitle from the route
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedOptions, setEditedOptions] = useState([]);
  const [showlink, setShowlink] = useState(false);
  const [surveyLink, setSurveyLink] = useState(""); // To store the generated link
  const [loading, setLoading] = useState(true);
  const [surveyTemplate, setSurveyTemplate] = useState([]);

  const navigate = useNavigate();

  // Fetch survey data
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (hasFetched.current) return; // Prevent duplicate execution
      setLoading(true);
      try {
        const url = "newSurvey/getSurvey";
        const response = await apiConnector(
          "GET",
          url,
          {},
          {},
          { surveyTitle, surveyType, surveyCategory }
        );
        setSurveyQuestions(response?.data.surveyQuestions);
        setSurveyLink(response?.data.surveyLink);
        setSurveyTemplate(response?.data?.template);

        toast.success(
          response.data.message || "Preview Page loaded successfully"
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error loading survey preview"
        );
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark as fetched
      }
    };

    fetchSurveyData();
  });

  // Handle editing a question and its options
  const handleEdit = (index, questionText, options) => {
    setEditingIndex(index);
    setEditedQuestion(questionText); // Pass the question text directly
    setEditedOptions(options); // Pass the options array directly
  };

  const copyToClipboard = (url) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use Clipboard API if available
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("URL copied to clipboard!");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Failed to copy");
        });
      setShowlink(false);
    } else {
      // Fallback method for unsupported browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("URL copied to clipboard!");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to copy");
      }
      document.body.removeChild(textArea); // Remove the textarea after copying
    }
    setShowlink(false);
  };

  // Handle option change while editing
  const handleOptionChange = (optionIndex, value) => {
    setEditedOptions((prevOptions) =>
      prevOptions.map((option, index) =>
        index === optionIndex ? value : option
      )
    );
  };

  // Handle saving the edited question and options
  const handleSave = async (id, index, questiontype, questioncategory) => {
    if (!editedQuestion.trim() || editedOptions.some((opt) => !opt.trim())) {
      toast.error("Question and options cannot be empty."); // Validation
      return;
    }

    const updateQuestion = {
      question: editedQuestion.trim(),
      options: editedOptions.map((opt) => opt.trim()), // Trim each option
      questiontype: questiontype,
      _id: id,
      questioncategory: questioncategory,
    };

    const toastId = showLoadingToast("Updating Questions...");

    try {
      const url = `newSurvey/updateQuestion`;
      const response = await apiConnector(
        "PUT",
        url,
        { updateQuestion },
        {},
        {}
      );
      // Update the surveyQuestions state after saving
      if (response?.data.success) {
        setSurveyQuestions((prevQuestions) =>
          prevQuestions.map((q, i) => (i === index ? updateQuestion : q))
        );
        updateToast(
          toastId,
          response?.data?.message || "Questions updated successfully!",
          "success"
        );
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Questions updated successfully!",
        "error"
      );
    }

    setEditingIndex(null); // Exit editing mode
  };

  // Handle deleting a question
  const handleDelete = async (id, index) => {
    const toastId = showLoadingToast("Deleting Questions...");
    try {
      const url = `newSurvey/deletequestion/${id}`;

      const response = await apiConnector("DELETE", url, {}, {}, {});

      // Remove the question from the state
      if (response?.data.success) {
        updateToast(
          toastId,
          response?.data?.message || "Questions deleted successfully",
          "success"
        );
        setSurveyQuestions((prevQuestions) =>
          prevQuestions.filter((_, i) => i !== index)
        );
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Error deleting question",
        "error"
      );
    }
  };

  const generateSurveyLink = async () => {
    try {
      if (surveyType === "targeted") {
        navigate(
          `/targettedsurvey/${surveyTitle}/${surveyType}/${surveyCategory}`,
          "_blank"
        );
      } else if (surveyType === "respondent_details") {
        setShowlink(true); // Show the modal with the link
      } else {
        setShowlink(true); // Show the modal with the link
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update survey type for all questions. Please try again."
      );
    }
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <>
          <>
            {/* Show User Details Form for Non-Anonymous Surveys */}
            {/* Logo positioned absolutely at the top left */}
            <div className="absolute top-0 left-2 mt-1 ">
              <img
                src={Logo}
                alt="Logo"
                className="h-16"
                onClick={() => {
                  navigate("/home");
                }}
              />
            </div>
          </>
          <>
            <div className="mx-auto my-8 p-6 bg-white rounded-lg">
              <div className="flex flex-row justify-between items-center mb-6 mt-6">
                <h1 className="text-4xl font-bold ">Survey Preview</h1>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  onClick={generateSurveyLink}
                >
                  Send Survey
                </button>
              </div>
              <h2 className="text-3xl font-semibold text-center mb-4 text-red-700">
                {capitalizeFirstLetter(surveyTitle)}
              </h2>

              {/* */}
              {surveyQuestions.map((question, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md relative group hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-row pr-36 items-center">
                    <h3 className="text-lg font-bold mr-2">{`Q${
                      index + 1
                    }.`}</h3>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedQuestion}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <p>{capitalizeFirstLetter(question.question)}</p>
                    )}
                  </div>

                  <ul className="list-disc pl-5 mt-1">
                    {editingIndex === index
                      ? editedOptions.map((option, optionIndex) => (
                          <li
                            key={optionIndex}
                            className="flex items-center mb-2"
                          >
                            <IoMdRadioButtonOff className="text-gray-500 text-xl mr-2" />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(optionIndex, e.target.value)
                              }
                              className="w-full p-1 border border-gray-300 rounded"
                            />
                          </li>
                        ))
                      : question.options.map((option, i) => (
                          <li
                            key={i}
                            className="text-gray-700 flex items-center"
                          >
                            <IoMdRadioButtonOff className="text-gray-500 text-xl mr-2" />
                            {capitalizeFirstLetter(option)}
                          </li>
                        ))}
                  </ul>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {editingIndex === index ? (
                      <button
                        onClick={() => {
                          handleSave(
                            question._id,
                            index,
                            question.questiontype
                          );
                        }}
                        className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Save <MdSave className="ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEdit(index, question.question, question.options)
                        }
                        className="flex items-center bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Edit <MdEdit className="ml-2" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(question._id, index)}
                      className="flex items-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete <MdDelete className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Modal for showing the generated link */}
              {showlink && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
                    <button
                      onClick={() => setShowlink(false)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                    >
                      &times;
                    </button>
                    <h3 className="text-xl font-semibold mb-4">Survey Link</h3>
                    <p className="mb-4 break-words">{surveyLink}</p>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => copyToClipboard(surveyLink)}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}

              {surveyTemplate.length > 0 && (
                <File surveyTemplate={surveyTemplate} />
              )}
            </div>
          </>
        </>
      )}
    </>
  );
};

export default Preview;
