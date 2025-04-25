import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
// import { FaUserCircle } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { apiConnector } from "../utils/apiConnector.js";

export default function Navbar() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  let logoutRef = useRef();

  // useEffect(() => {
  //   // Check auth status on mount and after login/logout
  //   checkAuthStatus();
  // }, []);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showLogout]);

  // const checkAuthStatus = async () => {
  //   try {
  //     const url = "users/admin";
  //     const response = await apiConnector("GET", url, {}, {}, {});
  //     if (response?.status === 200) {
  //       setIsLoggedIn(true);
  //     }
  //   } catch {
  //     setIsLoggedIn(false);
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     const url = "users/logout";
  //     const response = await apiConnector("POST", url, {}, {}, {});
  //     if (response.status === 200) {
  //       setIsLoggedIn(false);
  //       setShowLogout(false);
  //       // Clear the 'useremail' from localStorage on logout
  //       localStorage.removeItem("useremail");
  //       navigate("/");
  //       toast.success(response.data.message || "Logged out successfully");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Error logging out");
  //   }
  // };

  return (
    <div className="py-2">
      <nav className="flex items-center justify-between bg-white h-16 px-4">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            className="h-16 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
{/* 
        Navigation links in the center */}
        <ul className="flex space-x-8 mr-10">
          <li
          className="font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "text-orange-700" : "text-black"}`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="font-semibold">
            <NavLink
              to="/createSurvey"
              className={({ isActive }) =>
                `${isActive ? "text-orange-700" : "text-black"}`
              }
            >
            Create Surveys
            </NavLink>
          </li>
        </ul>

        {/* Login/Signup or Username with Dropdown */}
        {/* <div className="flex space-x-4">
          {!isLoggedIn ? (
            <NavLink
              to="/"
              className="text-black bg-yellow-500 hover:bg-blue-400 px-4 py-2 rounded-md"
            >
              Login
            </NavLink>
          ) : (
            <div className="relative">
              <button
                className="flex items-center text-white bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                onClick={() => setShowLogout(!showLogout)}
              >
                <FaUserCircle className="mr-2" size={24} /> Admin
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showLogout && (
                <div
                  className="absolute right-0 mt-2 bg-white border border-b-2 border-black rounded-lg shadow-lg z-10 duration-200 "
                  ref={logoutRef}
                >
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-left text-black hover:bg-gray-100 transition duration-300 hover:text-orange-400"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div> */}
      </nav>
    </div>
  );
}
