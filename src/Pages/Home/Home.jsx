import { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../utils/Spinner.jsx";
import { apiConnector } from "../../utils/apiConnector.js";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import IndividualSurveys from "./IndividualSurveys.jsx";
import IndustrySurveys from "./IndustrySurveys.jsx";
import { HomeContext } from "../../Context/HomeContext.jsx";

const ArchiveComponent = () => {
  const {
    setIndividualSurveys,
    isModalOpen,
    setIsModalOpen,
    surveyToDelete,
    setIndustrySurveys,
  } = useContext(HomeContext);


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "home/getdata";

        const response = await apiConnector("GET", url, {}, {}, {});

        if (response?.status === 200) {
          setIndividualSurveys(response.data.data.individualSurveyData);
          setIndustrySurveys(response.data.data.industrysurveyData);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error occurred while getting data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setIndividualSurveys, setIndustrySurveys]);

  const deleteSurvey = async () => {
    if (!surveyToDelete) return;

    const toastId = showLoadingToast("Deleting survey...");
    try {
      const url = "newSurvey/deleteSurvey";
      const response = await apiConnector(
        "DELETE",
        url,
        surveyToDelete,
        {},
        {}
      );
      if (response?.status === 200) {
        updateToast(
          toastId,
          response?.data?.message || "Survey deleted successfully!",
          "success"
        );

        

        // Update the setIndividualSurveys state to remove the deleted survey
        setIndividualSurveys((prevData) =>
          prevData.filter(
            (item) =>
              item.surveyTitle !== surveyToDelete.surveyTitle ||
              item.surveyType !== surveyToDelete.surveyType ||
              item.surveyCategory !== surveyToDelete.surveyCategory
          )
        );
        setIndustrySurveys((prevData) =>
          prevData.filter(
            (item) =>
              item.surveyTitle !== surveyToDelete.surveyTitle ||
              item.surveyType !== surveyToDelete.surveyType ||
              item.surveyCategory !== surveyToDelete.surveyCategory
          )
        );
      } else {
        updateToast(toastId, "Failed to delete survey.", "error");
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Error deleting survey.",
        "error"
      );
    } finally {
      setIsModalOpen(false); // Close the modal after action
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
          <div className="flex mt-4 pl-4 ml-2 mr-10">
            <h2 className="text-3xl font-bold text-indigo-600 font-sans ml-4">
              Welcome back, let&apos;s design some exciting surveys!
            </h2>
          </div>

          {/* Confirmation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-center mb-4">
                  Are you sure you want to delete the survey with survey name{" "}
                  <strong>{surveyToDelete?.surveyTitle}</strong>?
                </p>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteSurvey}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-10"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 mt-2 ml-2 mr-3 mb-10 rounded-lg bg-gray-50 shadow-lg">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 p-4 border border-gray-300 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-bold font-serif">My Workspace</h2>
              <div className="flex items-center space-x-4"></div>
            </div>

            <IndividualSurveys className="mt-4 mb-4"/>

            <IndustrySurveys className="mt-4 mb-4"/>
          </div>
        </>
      )}
    </>
  );
};

export default ArchiveComponent;
