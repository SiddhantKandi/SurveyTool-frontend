import { createContext, useState,useRef } from "react";


export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState([]);
  const [viewAsPercentage, setViewAsPercentage] = useState(true); // State for toggling between percentage and value view
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const today = new Date();
  const [surveyStartdate, setSurveyStartdate] = useState(null); // Added state for survey start date
  const [responseRate, setResponseRate] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [AnsweredUserDetails, setAnsweredUserDetails] = useState([]);
  const [notAnsweredUserDetails, setnotAnsweredUserDetails] = useState([]);
  const [showUserDetailspopup, setshowUserDetailspopup] = useState(false);
  const hasFetched = useRef(false);
  const ref = useRef(null);


  return (
    <AnalysisContext.Provider
      value={{
        surveyData,
        setSurveyData,
        viewAsPercentage,
        setViewAsPercentage,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loading,
        setLoading,
        showPopup,
        setShowPopup,
        today,
        surveyStartdate,
        setSurveyStartdate,
        responseRate,
        setResponseRate,
        totalResponses,
        setTotalResponses,
        totalRespondents,
        setTotalRespondents,
        AnsweredUserDetails,
        setAnsweredUserDetails,
        notAnsweredUserDetails,
        setnotAnsweredUserDetails,
        showUserDetailspopup,
        setshowUserDetailspopup,
        hasFetched,
        ref
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};
