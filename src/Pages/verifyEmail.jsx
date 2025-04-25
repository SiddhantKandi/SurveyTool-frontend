import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import { apiConnector } from "../utils/apiConnector.js";
import { showLoadingToast, updateToast } from "../utils/toastUtils.js";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); // Time remaining for resend button
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email } = useParams();
  const { surveyTitle, surveyType,surveyCategory } = location.state || {};

  // Handle OTP verification
  const handleVerify = async (e) => {
    const toastId = showLoadingToast("Sending OTP...");
    e.preventDefault();
    if (otp.length === 6) {
      try {
        const url = "users/verifyOTP";
        const response = await apiConnector(
          "POST",
          url,
          { username, email, otp },
          {},
          {}
        );
        updateToast(
          toastId,
          response?.data?.message || "OTP verified successfully",
          "success"
        );
        navigate(`/SurveyPage/${surveyTitle}/${surveyType}/${surveyCategory}`, {
          state: { username, email },
        });
      } catch (error) {
        updateToast(
          toastId,
          error?.response?.data?.message || "OTP does not match",
          "error"
        );
      }
    } else {
      toast.error("Please enter a valid OTP.");
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    const toastId = showLoadingToast("Sending OTP...");
    try {
      const url = "users/sendOTP";
      const response = await apiConnector(
        "POST",
        url,
        { email, username },
        {},
        {}
      );
      updateToast(
        toastId,
        response?.data?.message || "OTP sent successfully",
        "success"
      );

      // Disable the resend button and start the timer
      setIsResendDisabled(true);
      setTimeLeft(120); // 2 minutes in seconds
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Failed to send OTP, try again.",
        "error"
      );
    }
  };

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if (isResendDisabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Decrease time every second
    } else if (timeLeft === 0) {
      setIsResendDisabled(false); // Re-enable resend button when timer reaches 0
    }

    return () => clearInterval(timer); // Cleanup the timer when component unmounts
  }, [isResendDisabled, timeLeft]);

  return (
    <>
      <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center bg-gray-50">
        <div className="max-w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-indigo-700">
            Verify Email
          </h2>
          <p className="text-lg text-gray-600 my-4">
            A verification code has been sent to your email. Enter the code
            below to verify.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="min-w-8 border border-gray-300 rounded-md text-center text-lg focus:ring-2 focus:ring-indigo-500"
                />
              )}
              containerStyle="flex justify-between gap-2"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center">
            {/* Conditional Rendering for Time Remaining */}
            {timeLeft > 0 && (
              <h1 className="text-lg font-medium text-gray-700">
                Time Remaining:{" "}
                <span className="text-indigo-600">{timeLeft}s</span>
              </h1>
            )}

            {/* Resend OTP Button */}
            <button
              className={`flex items-center justify-center gap-2 ${
                isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-orange-400 hover:underline"
              }`}
              onClick={handleResendOtp}
              disabled={isResendDisabled}
            >
              <RxCountdownTimer className="w-5 h-5" />
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
