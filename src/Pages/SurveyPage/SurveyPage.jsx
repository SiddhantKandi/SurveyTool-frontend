import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/Logo.png";
import { apiConnector } from "../../utils/apiConnector.js";
import Spinner from "../../utils/Spinner.jsx";
import { MdErrorOutline } from "react-icons/md";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import { capitalizeFirstLetter } from "../../utils/constants.js";
import File from '../Preview/File.jsx'

const SurveyPage = () => {
  const { surveyTitle, surveyType, surveyCategory } = useParams();
  const location = useLocation();
  const { username, email } = location.state || {};

  const [surveyData, setSurveyData] = useState({
    questions: [],
    status: "",
  });
  const [responses, setResponses] = useState({});
  const [state, setState] = useState({
    isSubmitted: false,
    loading: false,
    error: null,
    showValidationPopup: false,
    locationPopup: true,
    userLocation: null,
  });
  const [userId, setUserId] = useState(null);
  const [surveyTemplate,setSurveyTemplate] = useState([]);

  const hasFetched = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("userId");
    if (id) setUserId(id);

    if (localStorage.getItem(`surveySubmitted_${surveyTitle}`)) {
      setState((prev) => ({ ...prev, isSubmitted: true }));
    }

    const fetchSurveyData = async () => {
      if (hasFetched.current) return;

      setState((prev) => ({ ...prev, loading: true }));
      try {
        const response = await apiConnector(
          "GET",
          "newSurvey/getSurvey",
          {},
          {},
          { surveyTitle, surveyType, surveyCategory }
        );


        setSurveyData({
          questions: response.data.surveyQuestions || [],
          status: response.data.surveyOpenClose || "",
        });
        setSurveyTemplate(response?.data?.template);
        hasFetched.current = true;
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Error occurred while displaying the survey"
        );
        setState((prev) => ({ ...prev, error: error.message }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSurveyData();
  }, [location, surveyTitle, surveyType, surveyCategory]);

  const handleResponseChange = (questionId, option, isMultiple) => {
    setResponses((prev) => {
      const currentResponses = prev[questionId] || [];
      const updatedResponses = isMultiple
        ? currentResponses.includes(option)
          ? currentResponses.filter((o) => o !== option)
          : [...currentResponses, option]
        : option;

      return { ...prev, [questionId]: updatedResponses };
    });
  };

  const validateResponses = () => {
    return surveyData.questions.every(
      (q) => responses[q._id] && responses[q._id].length > 0
    );
  };

  const handleSubmit = async () => {
    if (!validateResponses()) {
      setState((prev) => ({ ...prev, showValidationPopup: true }));
      return;
    }

    // Check if location is available
    if (
      !state.userLocation ||
      !state.userLocation.latitude ||
      !state.userLocation.longitude
    ) {
      toast.error("Location data is missing. Please allow location access.");
      return;
    }

    const toastId = showLoadingToast("Submitting the survey...");

    try {
      const payload = {
        userLocation: state.userLocation,
        submissions: surveyData.questions.map((q) => ({
          surveyId: q.surveyId,
          questionId: q._id,
          answer: responses[q._id] || [],
        })),
      };

      if (surveyType === "targeted" && userId) {
        payload.userId = userId;
        await apiConnector(
          "POST",
          "answers/submitanswerfortargetted",
          { payload },
          {},
          {}
        );
      } else {
        payload.username = username;
        payload.email = email;
        await apiConnector("POST", "answers/submitAnswer", { payload }, {}, {});
      }

      updateToast(toastId, "Survey submitted successfully", "success");
      localStorage.setItem(`surveySubmitted_${surveyTitle}`, "true");
      setState((prev) => ({ ...prev, isSubmitted: true }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error submitting answers");
      updateToast(
        toastId,
        error?.response?.data?.message || "Error submitting answers",
        "error"
      );
    }
  };

  const getLocation = async () => {
    const toastId = showLoadingToast("Getting location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            // Call Microsoft Reverse Geocoding API
            const response = await apiConnector(
              "GET",
              "newSurvey/getLocation",
              {},
              {},
              { latitude, longitude }
            );

            const address = response?.data?.data;

            setState((prev) => ({
              ...prev,
              loading: false,
              userLocation: {
                latitude,
                longitude,
                address: address || "Address not found", // Fallback if no address is available
              },
              locationPopup: false,
            }));

            updateToast(
              toastId,
              "Location and address fetched successfully.",
              "success"
            );
          } catch (error) {
            setState((prev) => ({
              ...prev,
              loading: false,
              error: "Failed to fetch address.",
              locationPopup: false,
            }));
            updateToast(toastId, "Failed to fetch address.", "error");
          }
        },
        (error) => {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "User location is off or User denied location.",
            locationPopup: false,
          }));
          updateToast(toastId, "Failed to fetch location.", "error");
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser.",
        locationPopup: false,
      }));
      updateToast(
        toastId,
        "Geolocation is not supported by your browser.",
        "error"
      );
    }
  };

  const renderQuestions = () => {
    return surveyData.questions.map((q, index) => (
      <div
        key={q._id}
        className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md"
      >
        <h3 className="text-lg font-bold mb-2">{`Q${
          index + 1
        }. ${capitalizeFirstLetter(q.question)}`}</h3>
        <ul className="list-disc pl-5">
          {q.options.map((option, optionIndex) => (
            <li key={optionIndex} className="flex items-center mb-2">
              <input
                type={
                  q.questiontype === "multiple select" ? "checkbox" : "radio"
                }
                id={`q${index}_o${optionIndex}`}
                name={`q${index}`}
                value={option}
                checked={
                  q.questiontype === "multiple select"
                    ? responses[q._id]?.includes(option) || false
                    : responses[q._id] === option
                }
                onChange={() =>
                  handleResponseChange(
                    q._id,
                    option,
                    q.questiontype === "multiple select"
                  )
                }
                className="mr-2"
              />
              <label
                htmlFor={`q${index}_o${optionIndex}`}
                className="text-gray-700"
              >
                {capitalizeFirstLetter(option)}
              </label>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  if (state.loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
        <Spinner />
      </div>
    );
  }

  if (surveyData.status === "closed") {
    return (
      <div className="text-center mt-4 text-red-500">
        This survey is currently closed.
      </div>
    );
  }

  if (state.isSubmitted) {
    return (
      <div className="text-center mt-4 text-green-500">
        Thank you for submitting the survey!
      </div>
    );
  }

  if (state.locationPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-[90%] max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Allow Location Access
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            To proceed with the survey, we need to access your location. This
            helps us serve you better and ensure compliance with local
            requirements.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white py-2 px-6 rounded-full transition duration-200 ease-in-out shadow-md focus:outline-none"
            onClick={getLocation}
          >
            Allow Access
          </button>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-md text-center">
          <div className="flex mb-4">
            {/* React Icon */}
            <div className="flex flex-row">
              <MdErrorOutline className="text-red-500 text-2xl mt-0.5 mr-2 " />
              <p className="text-lg font-semibold text-red-500">
                {state.error}
              </p>
            </div>
          </div>
          <p className="text-black text-sm ">
            Please turn on the location, refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 p-6 bg-white rounded-lg">
      <div className="absolute top-0 left-2 mt-1">
        <img src={Logo} alt="Logo" className="h-16" />
      </div>
      <div className="survey-content p-6">
        {state.isSubmitted ? (
          <div className="thank-you-message">
            <h2>Thank you for completing the survey!</h2>
            <p>Your responses have been recorded.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-center mb-4 text-red-700 mt-5">
              {capitalizeFirstLetter(surveyTitle)}
            </h2>
            {renderQuestions()}
            {state.showValidationPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                  <h2 className="text-2xl font-semibold text-red-600 mb-4 text-center">
                    Validation Error
                  </h2>
                  <p className="text-gray-700 text-center mb-6">
                    Please answer all the questions before submitting.
                  </p>
                  {/* Flex container to center the button */}
                  <div className="flex justify-center">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          showValidationPopup: false,
                        }))
                      }
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
            {surveyTemplate.length > 0 && (
              <File surveyTemplate={surveyTemplate}/>
            )}
            <div className="flex justify-center mt-28">
              <button
                className="bg-blue-500 text-xl text-white py-2 px-6 rounded-md hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
