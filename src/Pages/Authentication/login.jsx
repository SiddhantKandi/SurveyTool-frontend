import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { toast } from "react-toastify"; // Import toast
import { apiConnector } from "../../utils/apiConnector.js";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmailandVerifyOTP = async () => {
    const toastId = showLoadingToast("Sending OTP...");

    try {
      const response = await apiConnector(
        "POST",
        "users/adminEmailOTP",
        {},
        {},
        {}
      );

      if (response?.data?.success) {
        // Update the toast to success
        updateToast(
          toastId,
          response?.data?.message || "OTP sent successfully",
          "success"
        );
        navigate("/verifyOTP");
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Failed to send OTP, try again.",
        "error"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required.");
      return;
    }

    // Display a loading toast
    const toastId = showLoadingToast("Logging in ...");

    try {
      const url = "users/login";
      const response = await apiConnector(
        "POST",
        url,
        { email: formData.email, password: formData.password },
        {},
        {}
      );

      if (response?.data?.success) {
        // Update the toast to success
        updateToast(toastId, "Welcome Admin!", "success");
        // Save user data and navigate
        localStorage.setItem("useremail", formData.email);
        localStorage.setItem("accessToken", JSON.stringify(response.data.data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(response.data.data.refreshToken));
        navigate("/");
      }
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Login failed, try again.",
        "error"
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-blue-100 to-blue-300">
        <div className="w-11/12 md:w-6/12 bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={Logo}
              alt="People Prudent Consulting and HR Solutions"
              className="mx-auto h-16 absolute top-2 left-3"
            />
            <h2 className="text-3xl font-bold mt-4 text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mt-2">
              Log in to continue to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={sendEmailandVerifyOTP}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
