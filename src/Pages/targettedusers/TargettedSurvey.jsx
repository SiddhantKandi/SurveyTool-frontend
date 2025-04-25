import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaDatabase, FaPaperPlane, FaBell } from "react-icons/fa";
import Showdatabaseusers from "./showdatabaseusers.jsx";
import { toast } from "react-toastify";
import ImportRespondents from "./importTargettedRespondents.jsx"; // Make sure this component is correctly imported
import { apiConnector } from "../../utils/apiConnector.js";
import Logo from "../../assets/Logo.png";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import { TargetedSurveyContext } from "../../Context/TargetedSurveyContext.jsx";

const SurveyAudienceSelector = () => {

  const {
    email,
    setEmail,
    username,
    setUsername,
    users,
    setUsers,
    showAudienceSelector,
    setShowAudienceSelector,
    showImportPopup,
    setShowImportPopup,
  } = useContext(TargetedSurveyContext); //Use Context to store global variables
  const { surveyTitle, surveyType } = useParams(); // Capture surveyTitle and surveyType from the route

  const showusers = () => {
    setShowAudienceSelector(!showAudienceSelector); // Open popup for database users
  };

  const navigate = useNavigate();

  const ImportPopup = () => {
    setShowImportPopup(!showImportPopup); // Open popup for importing respondents
  };

  //delete using email
  const deleteUser = (emailToDelete) => {
    const updatedUsers = users.filter((user) => user.email !== emailToDelete);
    setUsers(updatedUsers);
  };

  const sendSurvey = async () => {
    const toastId = showLoadingToast("Sending Survey...");
    try {
      const url = `targetted/sendemailtorespondets/${surveyTitle}/${surveyType}`;
      const response = await apiConnector("POST", url, { users }, {}, {});
      if (response.status === 200) {
        updateToast(
          toastId,
          response?.data?.message || "Survey sent successfully.",
          "success"
        );
      } else {
        updateToast(
          toastId,
          "Failed to send survey, please try again",
          "error"
        );
      }
      setUsers([]);
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message ||
          "Failed to send survey, please try again",
        "error"
      );
    }
  };

  const sendReminder = async () => {
    const toastId = showLoadingToast("Sending Survey reminder...");
    try {
      const url = `targetted/sendremindertorespondents/${surveyTitle}/${surveyType}`;
      const response = await apiConnector("POST", url, {}, {}, {});
      if (response.status === 200) {
        updateToast(
          toastId,
          response?.data?.message || "Survey reminder sent successfully.",
          "success"
        );
      } else {
        updateToast(
          toastId,
          "Failed to send survey reminder, please try again",
          "error"
        );
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message ||
          "Failed to send survey reminder, please try again",
        "error"
      );
    }
  };

  // Save users to the backend
  const saveUsers = async () => {
    const toastId = showLoadingToast("Saving users...");
    try {
      const url = `targetted/targetteduser`;
      const response = await apiConnector("POST", url, { users }, {}, {});
      if (response.data.success) {
        updateToast(
          toastId,
          response?.data?.message || "Users saved successfully.",
          "success"
        );
      } else {
        updateToast(toastId, "Error occurred while saving users", "error");
      }
      setUsers([]);
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message ||
          "Failed to save users, please try again",
        "error"
      );
    }
  };

  const addUser = () => {
    if (!email || !username) {
      toast.error("Please fill in both email and username fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      toast.error("User already exists in the list.");
      return;
    }

    setUsers([...users, { email, username }]);
    setEmail("");
    setUsername("");
  };

  return (
    <>
      {/* Logo on the left */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 pl-3 pt-3">
        <img
          src={Logo}
          alt="Logo"
          className="h-16 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 min-h-screen w-screen pt-8">
        <div className="flex flex-col md:flex-row w-11/12 mx-auto">
          {/* Left Panel */}
          <div className="w-full md:w-4/6 bg-white rounded-lg shadow-lg p-8 mb-6 md:mb-0 md:mr-6 h-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              Add Targeted Respondents
            </h2>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter username"
              />
            </div>
            <button
              onClick={addUser}
              className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
            >
              <FaPlus className="mr-2" /> Add User
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-2/6 bg-white rounded-lg shadow-lg p-8 h-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              Navigation buttons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Select from Database */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
                onClick={showusers}
              >
                <FaDatabase className="text-base" /> Select users from Database
              </button>

              {/* Save Targeted Users */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300"
                onClick={saveUsers}
              >
                <FaPlus className="text-base" /> Save Users
              </button>

              {/* Send Survey */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300"
                onClick={sendSurvey}
              >
                <FaPaperPlane className="text-base" /> Send Survey
              </button>

              {/* Send Reminder */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300"
                onClick={sendReminder}
              >
                <FaBell className="text-base" /> Send Reminder
              </button>

              {/* Import Respondents */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-300"
                onClick={ImportPopup} // Open the ImportRespondents popup
              >
                <FaDatabase className="text-base" /> Import Respondents
              </button>
            </div>
          </div>
        </div>

        {/* Bottom div for showing added audience */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4 mx-auto w-11/12 pb-10">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">
            Added Respondents:
          </h3>
          <ul>
            {users.map((user, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg mb-2 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 flex flex-row">
                    Username : {user.username}
                  </span>
                  <span className="text-sm text-gray-500 flex flex-row">
                    Email : {user.email}
                  </span>
                </div>
                <MdDelete
                  className="text-red-500 cursor-pointer hover:text-red-700 transition duration-150"
                  onClick={() => deleteUser(user.email)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Showdatabaseusers Popup */}
        {showAudienceSelector && <Showdatabaseusers />}

        {/* ImportRespondents Popup */}
        {showImportPopup && <ImportRespondents />}
      </div>
    </>
  );
};

export default SurveyAudienceSelector;
