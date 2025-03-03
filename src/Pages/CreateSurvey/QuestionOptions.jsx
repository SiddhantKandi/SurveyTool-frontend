import React, { useContext } from "react";
import QuestionType from "../../Components/QuestionType.jsx";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";

const QuestionOptions = () => {
  const { showOptionsInput } = useContext(CreateSurveyContext);
  if (!showOptionsInput) return null;

  return <QuestionType />;
};

export default QuestionOptions;
