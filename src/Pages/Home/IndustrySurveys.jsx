import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HomeContext } from "../../Context/HomeContext.jsx";
import { useContext } from "react";
import { capitalizeFirstLetter } from "../../utils/constants.js";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import { apiConnector } from "../../utils/apiConnector.js";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";

function IndustrySurveys() {
  const navigate = useNavigate();

  const {
    industrySurveys,
    setSurveyToDelete,
    setIndustrySurveys,
    setIsModalOpen,
  } = useContext(HomeContext);

  const { setSurveyCategory } = useContext(CreateSurveyContext);

  const handleDeleteClick = (surveyTitle, surveyType, surveyCategory) => {
    setSurveyToDelete({ surveyTitle, surveyType, surveyCategory });
    setIsModalOpen(true); // Open the modal
  };

  const setSurveyOpenClose = async (
    surveyTitle,
    surveyType,
    surveyCategory
  ) => {
    const toastId = showLoadingToast("Changing surey status...");
    try {
      const url = "newSurvey/setSurveyOpenClose";
      const response = await apiConnector(
        "POST",
        url,
        { surveyTitle, surveyType, surveyCategory },
        {},
        {}
      );
      if (response?.status === 200) {
        updateToast(
          toastId,
          response?.data?.message || "Survey status updated successfully!",
          "success"
        );

        // Update the survey status in the individualSurveys state
        setIndustrySurveys((prevData) =>
          prevData.map((item) =>
            item.surveyTitle === surveyTitle && item.surveyType === surveyType
              ? {
                  ...item,
                  surveyOpenClose:
                    item.surveyOpenClose === "open" ? "closed" : "open",
                }
              : item
          )
        );
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Error changing survey status",
        "error"
      );
    }
  };

  const createSurvey = () => {
    setSurveyCategory("industry");
    navigate("/createSurvey");
  };

  const previewPage = (surveyTitle, surveyType, surveyCategory) => {
    navigate(`/preview/${surveyTitle}/${surveyType}/${surveyCategory}`);
  };

  return (
    <>
      <div className="flex flex-row items-center min-w-full">
        <h1 className="text-2xl font-semibold  mt-8">
          Industry Reachout Surveys
        </h1>
        <button
          className="absolute right-10 mt-4 bg-orange-400 text-white py-1 px-4 rounded shadow hover:bg-orange-600 transition flex flex-row items-center"
          onClick={createSurvey}
        >
          <FiPlus className="mr-2" /> Create Industry Surveys
        </button>
      </div>
      <div className="w-full bg-white shadow-sm rounded-lg border border-gray-300 mt-2 mb-4">
        {industrySurveys.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">
              You don&apos;t have any surveys yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start by creating a new survey.
            </p>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition flex flex-row items-center"
                onClick={createSurvey}
              >
                <FiPlus className="mr-2" /> Create Industry Survey
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white shadow-sm rounded-lg border border-gray-300">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 font-medium text-gray-600">
              <div className="text-left">Survey Title</div>
              <div className="text-center">Survey Type</div>
              <div className="text-center">Number of Respondents</div>
              <div className="text-center">Survey Date Created</div>
              <div className="text-center">Analyze Survey</div>
              <div className="text-center">Survey Status</div>
            </div>
            {industrySurveys.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 p-4 pl-0 border-b border-gray-200 items-center hover:bg-gray-50 transition duration-150"
              >
                {/* Survey Title & Delete Column */}
                <div className="flex items-center">
                  <button
                    className="group flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-200 rounded-md px-2 py-1"
                    onClick={() =>
                      previewPage(
                        item.surveyTitle,
                        item.surveyType,
                        item.surveyCategory
                      )
                    }
                  >
                    <span className="text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                      {capitalizeFirstLetter(item.surveyTitle)}
                    </span>
                  </button>
                  <MdDelete
                    className="text-2xl text-red-500 hover:text-red-600 transition-colors cursor-pointer ml-3"
                    aria-label="Delete survey"
                    onClick={() =>
                      handleDeleteClick(
                        item.surveyTitle,
                        item.surveyType,
                        item.surveyCategory
                      )
                    }
                  />
                </div>

                {/* Survey Type Column */}
                <div className="text-center text-gray-700">
                  {capitalizeFirstLetter(item.surveyType)}
                </div>

                {/* Respondents Column */}
                <div className="text-center text-gray-700">
                  {item.responses} Respondents
                </div>

                {/* Date Column */}
                <div className="text-center text-gray-700">
                  {item.DateCreated}
                </div>

                {/* Analysis Column */}
                <div className="text-center">
                  {parseInt(item.responses) === 0 ? (
                    <span className="text-red-500 text-sm">
                      No data to analyze
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(
                          `/analysis/${item.surveyTitle}/${item.surveyType}/industry`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 hover:text-orange-300"
                    >
                      Analyze
                    </button>
                  )}
                </div>

                {/* Survey Status Column */}
                <div className="text-center ">
                  <button
                    onClick={() =>
                      setSurveyOpenClose(
                        item.surveyTitle,
                        item.surveyType,
                        item.surveyCategory
                      )
                    }
                    className="text-gray-700  px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 hover:bg-blue-200"
                  >
                    {capitalizeFirstLetter(item.surveyOpenClose)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default IndustrySurveys;
