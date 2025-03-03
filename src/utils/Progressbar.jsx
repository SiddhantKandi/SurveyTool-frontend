import React from "react";

const ProgressBarUtil = ({ progress = 60 ,totalRespondents,totalResponses}) => {
  return (
    <div className="w-full mt-4 ml-5 mr-5 ">
      {/* Main content wrapper without vertical margins */}
      <div className="flex flex-col">
        {/* Progress bar container */}
        <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-6 shadow-lg p-1">
          {/* Inner progress bar with animation and gradient */}
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {/* Progress text with conditional rendering */}
            <span
              className={`text-sm font-semibold ${
                progress > 30 ? "text-white" : "text-gray-700"
              }`}
            >
              {`${progress}%`} ({`${totalResponses}`}/{`${totalRespondents}`})
            </span>
          </div>
        </div>
        {/* Status label with reduced bottom margin */}
        <div className="mt-2 text-md text-center font-bold text-black">
          Respondents Progress Status
        </div>
      </div>
    </div>
  );
};

export default ProgressBarUtil;
