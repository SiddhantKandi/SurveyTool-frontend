import React from "react";
import { CreateSurveyProvider } from "../Context/CreateSurveyContext.jsx";
import { DisplayQuestionProvider } from "../Context/DisplayQuestioncontext.jsx";
import { HomeProvider } from "../Context/HomeContext.jsx";
import { TargetedSurveyProvider } from "../Context/TargetedSurveyContext.jsx";
import { AnalysisProvider } from "../Context/AnalysisContext.jsx";

const ContextProvider = ({ children }) => {
  return (
    <HomeProvider>
      <CreateSurveyProvider>
        <DisplayQuestionProvider>
          <TargetedSurveyProvider>
            <AnalysisProvider>{children}</AnalysisProvider>
          </TargetedSurveyProvider>
        </DisplayQuestionProvider>
      </CreateSurveyProvider>
    </HomeProvider>
  );
};

export default ContextProvider;
