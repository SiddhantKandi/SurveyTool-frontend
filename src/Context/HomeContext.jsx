import { createContext, useState } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [individualSurveys, setIndividualSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null); // Holds the survey to delete
  const [industrySurveys, setIndustrySurveys] = useState([]);

  return (
    <HomeContext.Provider
      value={{
        individualSurveys,
        setIndividualSurveys,
        industrySurveys,
        setIndustrySurveys,
        loading,
        setLoading,
        isModalOpen,
        setIsModalOpen,
        surveyToDelete,
        setSurveyToDelete,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
