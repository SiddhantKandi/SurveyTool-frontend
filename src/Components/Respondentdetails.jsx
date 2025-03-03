import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sendOTP from "../Components/sendOTP.js";
import { showLoadingToast, updateToast } from "../utils/toastUtils.js";

export default function Respondentdetails() {
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const navigate = useNavigate();
  const { surveyTitle, surveyType,surveyCategory } = useParams();

  // Handle user details form submission
  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();

    const toastId = showLoadingToast("Sending OTP...");
    try {
      const response = await sendOTP(userDetails.email, userDetails.username);
        updateToast(
          toastId,
          response?.data?.message || "OTP sent successfully",
          "success"
        );
        navigate(`/verifyEmail/${userDetails.username}/${userDetails.email}`, {
          state: { surveyTitle, surveyType,surveyCategory },
        });
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Failed to send OTP, try again.",
        "error"
      );
    }
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-2">
            Verify Your Details
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Please provide your details to continue.
          </p>
          <form onSubmit={handleUserDetailsSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleUserDetailsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleUserDetailsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
