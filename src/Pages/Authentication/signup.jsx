import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    phonenumber: ""
  });

  const [errors, setErrors] = useState({}); // Object to track field-specific errors
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error message for the field being changed
  };

  const gotoLogin = () => {
    navigate("/");
  };

  const validateForm = () => {
    const newErrors = {};
    // Check if any field is empty
    if (!formData.username) {
      newErrors.username = "Username is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required.";
    }
    if (!formData.phonenumber) {
      newErrors.phonenumber = "Phone number is required.";
    }
    // Check if password and confirm password match
    if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Password and Confirm Password do not match.";
    }
    return newErrors; // Return the object containing errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set field-specific errors if validation fails
      return;
    }

    try {
      // Call your backend API to register the user
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(response.data.message || "Form submitted successfully");
        navigate('/'); // Navigate to the home page after successful signup
      } else {
        setErrors({ api: data.message || "Failed to register. Please try again." });
      }
    } catch {
      setErrors({ api: "An error occurred while submitting the form. Please try again." });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-screen-lg my-4">
        <div className="text-center mb-6">
          <img
            src={Logo}
            alt="People Prudent Consulting and HR Solutions"
            className="mx-0 h-16"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-md"
              required
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border-black border rounded-md"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border-black border rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmpassword" className="block text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border-black border rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.confirmpassword && <p className="text-red-500">{errors.confirmpassword}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border-black border rounded-md"
              required
            />
            {errors.phonenumber && <p className="text-red-500">{errors.phonenumber}</p>}
          </div>

          {errors.api && (
            <div className="text-red-500 mb-4">
              {errors.api}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-2 text-center">
          Already have an account?
          <button className="ml-2 text-blue-500" onClick={gotoLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;