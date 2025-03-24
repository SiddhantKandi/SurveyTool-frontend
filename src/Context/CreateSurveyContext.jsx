import { createContext, useState, useRef } from "react";

export const CreateSurveyContext = createContext();

export const CreateSurveyProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [optionsType, setOptionsType] = useState("multiple select");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showOptionsInput, setShowOptionsInput] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [optionValues, setOptionValues] = useState(["", "", "", ""]);
  const [showImportForm, setShowImportForm] = useState(false);
  const [questioncategory, setquestionCategory] = useState("");
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  const [surveyCategory, setSurveyCategory] = useState("");
  const formRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsDivRef = useRef(null);


  


  

  return (
    <CreateSurveyContext.Provider
      value={{
        title,
        setTitle,
        question,
        setQuestion,
        optionsType,
        setOptionsType,
        dropdownVisible,
        setDropdownVisible,
        showOptionsInput,
        setShowOptionsInput,
        questionsList,
        setQuestionsList,
        optionValues,
        setOptionValues,
        showImportForm,
        setShowImportForm,
        questioncategory,
        setquestionCategory,
        showQuestionBank,
        setShowQuestionBank, 
        formRef,
        dropdownRef,
        optionsDivRef,
        surveyCategory,
        setSurveyCategory,
      }}
    >
      {children}
    </CreateSurveyContext.Provider>
  );
};
