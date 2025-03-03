import React from "react";
import { TailSpin } from "react-loader-spinner";

const Spinner = ({ message = "Loading Please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-blue">
      {/* TailSpin Loader */}
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#4F46E5" // Softer blue for polished look
        ariaLabel="tail-spin-loading"
        radius="1"
      />

      {/* Loading text with pulse animation */}
      <div className="mt-4 font-semibold text-xl animate-smooth-pulse text-shadow">
        {message}
      </div>

      {/* Smooth bouncing dots */}
      <div className="flex space-x-2 mt-4">
        <div className="dot" style={{ animationDelay: "0.1s" }}></div>
        <div className="dot" style={{ animationDelay: "0.3s" }}></div>
        <div className="dot" style={{ animationDelay: "0.5s" }}></div>
      </div>
    </div>
  );
};

export default Spinner;
