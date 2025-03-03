import React, { useState, useEffect, useContext } from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import { apiConnector } from "../../utils/apiConnector.js";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../utils/constants.js";
import { AnalysisContext } from "../../Context/AnalysisContext.jsx";

const UserDetailsComponent = ({
  UserDetails,
  title,
  surveyTitle,
  surveyCategory,
  surveyType,
}) => {
  const [users, setUsers] = useState([]);

  const { ref } = useContext(AnalysisContext);

  useEffect(() => {
    setUsers(UserDetails);
  }, [UserDetails]);

  const getIndiandateandTime = (date) => {
    const utcDate = new Date(date);
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const istDate = utcDate.toLocaleString("en-IN", options);
    return istDate;
  };

  const [popupVisible, setPopupVisible] = useState(false);
  const [userAnswers, setuserAnswers] = useState(null);

  const handleView = async (user) => {
    const userId = user._id;

    try {
      const response = await apiConnector(
        "GET",
        "answers/getAnswersforUser",
        {},
        {},
        { userId, surveyTitle, surveyType, surveyCategory }
      );

      // Combine user details with fetched answers
      const userWithAnswers = {
        ...user,
        answers: response?.data?.data || [], // Add answers to user object
      };

      // Update state with combined user data
      setuserAnswers(userWithAnswers);
      setPopupVisible(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching user answers "
      );
    }
  };

  const AnswerItem = ({ answerObj, index }) => {
    return (
      <div
        key={index}
        className="p-4 border border-gray-200 rounded-lg shadow-md bg-white mb-6 py-2"
      >
        <h4 className="text-lg font-semibold text-indigo-600 mb-2 p-2 mt-2 py-4">
          Q{index + 1} {capitalizeFirstLetter(answerObj.question)}
        </h4>
        <ul className="mt-2 space-y-2">
          {answerObj.options.map((option, optionIndex) => {
            const isSelected = answerObj.answer.includes(option);
            return (
              <li
                key={optionIndex}
                className={`flex items-center text-gray-800 p-2 rounded-lg ${
                  isSelected
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <span className="mr-2 text-sm font-medium">
                  {capitalizeFirstLetter(option)}
                </span>
                {isSelected && (
                  <span className="ml-auto text-green-500 font-bold text-lg">
                    ✔️
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const showActioncolumn = () => {
    if (title === "Users Who Have Responded to Survey") {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      );
    }
  };

  const showdateSubmittedcolumn = () => {
    if (title === "Users Who Have Responded to Survey") {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Survey Submitted on
        </th>
      );
    }
  };

  const showActionColumndetails = (user) => {
    if (title === "Users Who Have Responded to Survey") {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center ">
            <button
              onClick={() => handleView(user)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
              aria-label="View user details"
            >
              <FaEye className="w-5 h-5 text-center ml-4" />
            </button>
          </div>
        </td>
      );
    }
  };

  const showdateColumndetails = (user) => {
    if (title === "Users Who Have Responded to Survey") {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center ">
            <button
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
              aria-label="View user details"
            >
              {getIndiandateandTime(user.createdAt)}
            </button>
          </div>
        </td>
      );
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 p-6 mt-6">
      <div
        className="w-auto max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden m-6"
        ref={ref}
      >
        <div className="px-6 py-4 bg-indigo-600 text-white">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-700">
            No data found for {title}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {surveyType !== "anonymous" && (
                    <>
                      <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </td>
                      <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </td>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  {showdateSubmittedcolumn()}
                  {showActioncolumn()}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {surveyType !== "anonymous" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {user.email}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-black">
                      {user.respondentAddress || "Survey not yet answered"}
                    </td>
                    {showdateColumndetails(user)}
                    {showActionColumndetails(user)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sliding Popup */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-5/12 h-full bg-white shadow-lg transform ${
          popupVisible ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b">
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-red-700"
            aria-label="Close popup"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        {/* Scrollable Content */}
        <div className="p-6 bg-gray-50 overflow-y-auto h-[calc(100%-64px)]">
          {userAnswers && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">
                Details for {capitalizeFirstLetter(userAnswers.username)}
              </h3>
              <div className="space-y-6">
                {userAnswers.answers?.length > 0 ? (
                  userAnswers.answers.map((answerObj, index) => (
                    <AnswerItem
                      key={index}
                      answerObj={answerObj}
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center bg-gray-100 p-4 rounded-lg shadow-sm">
                    No answers available for this user.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsComponent;
