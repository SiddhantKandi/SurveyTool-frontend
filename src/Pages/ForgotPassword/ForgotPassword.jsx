import { useState } from "react";
import { apiConnector } from "../../utils/apiConnector.js";
import { useNavigate } from "react-router-dom";
import { showLoadingToast, updateToast } from "../../utils/toastUtils.js";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setshowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "users/updatePassword";
    const toastId = showLoadingToast("Updating password...");
    try {
      const response = await apiConnector(
        "PUT",
        url,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }, // Corrected object
        {},
        {}
      );
      updateToast(
        toastId,
        response?.data?.message || "Password  Updated!",
        "success"
      );
      navigate("/");
    } catch (error) {
      updateToast(
        toastId,
        error?.response?.data?.message || "Failed to update password, try again.",
        "error"
      );
    } 
  };

  return (
    <>
      
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">
              Reset Password
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  New Password
                </label>
                <input
                  type="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New password"
                  required
                />
              </div>
              <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setshowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </button>
                  </div>
                </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
    </>
  );
}
