import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CiImport } from "react-icons/ci";
import { FaDatabase } from "react-icons/fa6";
import { toast } from "react-toastify";
import { apiConnector } from "../../utils/apiConnector.js";
import { AiOutlineBank } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";

const SurveyTitle = () => {
  const {
    title,
    setTitle,
    setShowImportForm,
    setShowQuestionBank,
    questionsList,
    setShowTemplate,
    surveyCategory,
    setQuestionsList,
    template
  } = useContext(CreateSurveyContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // Function to open modal
  const openModal = () => setIsModalOpen(true);

  // Function to close modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle the survey type selection
  const generateSurveyLink = async (surveyType) => {
    try {
      const surveyData = {
        surveyTitle: title.trim().toLowerCase(),
        Surveyquestions: questionsList,
        surveyType: surveyType,
        surveyCategory: surveyCategory || "individual",
        template : template
      };

      const url = "newSurvey/survey";
      const response = await apiConnector("POST", url, { surveyData }, {}, {});
      toast.success(response.data.message || "Survey saved successfully!");

      // Reset survey data
      setTitle("");
      setShowQuestionBank(false);
      setShowTemplate(false);
      setQuestionsList([]);

      const surveyTitle = surveyData.surveyTitle;

      setTimeout(() => {
        navigate(
          `/preview/${surveyTitle}/${surveyType}/${surveyCategory}/`,
          "_blank"
        );
      }, 1000);
      closeModal(); // Close modal after saving
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save survey!");
    }
  };

  const handleSaveAndNext = () => {
    openModal(); // Open modal to choose survey type
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6 mt-3 font-semibold text-center">You are now creating <span className="text-blue-700 font-bold uppercase">{surveyCategory}</span> surveys</h1>
      <div className="flex justify-between w-full items-center mb-4 ">
        <div className="flex items-center ml-2 space-x-2 relative w-6/12 mr-10 ">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-2xl bg-orange-100 p-2 w-full rounded-lg shadow-md border border-gray-300 text-center placeholder-gray-400 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Enter survey title"
          />
        </div>
        <div className="flex flex-row">
          <button
            className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200 flex flex-row justify-center items-center mr-2"
            onClick={() => {
              setShowTemplate(true);
            }}
          >
            <FaDatabase className="mr-1" />
            Show Template
          </button>
          <div className="flex items-center space-x-2 relative mr-2">
            <button
              className="bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex flex-row justify-center items-center"
              onClick={() => {
                setShowImportForm(true);
              }}
            >
              <CiImport className="mr-1" />
              Import
            </button>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button
              className="flex flex-row bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-3"
              onClick={() => {
                setShowQuestionBank((curr) => !curr);
              }}
            >
              <AiOutlineBank className="mr-1 mt-1" />
              Question Bank
            </button>
          </div>
          <div className="flex item-center space-x-2 relative">
            <button
              className="bg-green-500 flex flex-row items-center justify-center text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mr-3 p-2"
              onClick={handleSaveAndNext}
            >
              <FaRegSave className="mr-1" />
              Save
            </button>
          </div>
        </div>

        {/* Modal for selecting survey type */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">Send Survey</h3>
              <div className="flex flex-row space-x-4">
                <button
                  className="bg-blue-200 p-4 flex-1 rounded-lg font-serif"
                  onClick={() => generateSurveyLink("anonymous")}
                >
                  Anonymous survey
                </button>
                <button
                  className="bg-green-200 p-4 flex-1 rounded-lg font-serif"
                  onClick={() => generateSurveyLink("respondent_details")}
                >
                  Take Respondent details
                </button>
                <button
                  className="bg-yellow-200 p-4 flex-1 rounded-lg font-serif"
                  onClick={() => generateSurveyLink("targeted")}
                >
                  To Targeted users
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyTitle;
