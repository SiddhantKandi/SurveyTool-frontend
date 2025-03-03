import React, { useContext } from "react";
import Question from "./DisplayingParticularQuestion.jsx";
import { apiConnector } from "../utils/apiConnector.js";
import { showLoadingToast, updateToast } from "../utils/toastUtils.js";
import { CreateSurveyContext } from "../Context/CreateSurveyContext.jsx";

export default function QuestionList() {
  const { questionsList } =
    useContext(CreateSurveyContext);

  const handleSave = async () => {
    const toastId = showLoadingToast("Displaying question list...");
    try {
      const url = "questions/add";
      const response = await apiConnector(
        "POST",
        url,
        { questionsList },
        {},
        {}
      );
      if (response?.data.success) {
        // Update the toast to success
        updateToast(
          toastId,
          response?.data?.message || "Displaying Question list successfully!",
          "success"
        );
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message ||
          "Could not add questions,already exists in question bank",
        "error"
      );
    }
  };

  return (
    <>
      <div className="bg-gray-300 p-4 rounded-lg shadow-lg border border-b-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Questions List</h3>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleSave}
          >
            {"Add to Question Bank"}
          </button>
        </div>
        <Question
        />
      </div>
    </>
  );
}
