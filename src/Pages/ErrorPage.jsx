import { useEffect } from "react";
import PropTypes from 'prop-types';
import { BiError } from "react-icons/bi";

const ErrorPage = ({ 
    errorCode = "404",
    errorMessage = "Page Not Found",
    errorDescription = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
}) => {
    useEffect(() => {
        document.title = `Error ${errorCode} | ${errorMessage}`;
    }, [errorCode, errorMessage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mb-8 animate-pulse">
                    <BiError className="w-24 h-24 mx-auto text-red-500" aria-hidden="true" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Error {errorCode}
                </h1>

                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                    {errorMessage}
                </h2>

                <p className="text-gray-600 mb-8 text-lg">
                    {errorDescription}
                </p>
            </div>
        </div>
    );
};
ErrorPage.propTypes = {
    errorCode: PropTypes.string,
    errorMessage: PropTypes.string,
    errorDescription: PropTypes.string
};

export default ErrorPage;
