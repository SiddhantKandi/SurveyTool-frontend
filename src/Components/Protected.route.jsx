import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../utils/Spinner.jsx";
import { apiConnector } from "../utils/apiConnector.js";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasAuth = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasAuth.current) return; // Prevent duplicate execution
      try {
        setIsLoading(true);
        const url = "users/admin";
        const response = await apiConnector("GET", url, {}, {}, {});

        if (response?.status === 200) {
          setIsAuthenticated(true);
        } else {
          toast.error("Authentication failed");
        }
      } catch (error) {
        setIsAuthenticated(false);

        if (error.response && error.response.status === 401) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Authentication error. Please login again.");
        }
        navigate("/");
      } finally {
        setIsLoading(false);
        hasAuth.current = true; // Mark as fetched
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Add a global axios interceptor to handle 401 responses
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? element : null;
};
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
