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
  const [showTemplate, setShowTemplate] = useState(false);
  const [surveyCategory, setSurveyCategory] = useState("");
  const formRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsDivRef = useRef(null);
  const [template, setTemplate] = useState([]);

  
  const [rows, setRows] = useState([
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3", "Row 1 Col 4"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3", "Row 2 Col 4"],
    ["Row 3 Col 1", "Row 4 Col 2", "Row 3 Col 3", "Row 3 Col 4"],
    ["Row 4 Col 1", "Row 4 Col 2", "Row 4 Col 3", "Row 4 Col 4"],
    ["Row 5 Col 1", "Row 5 Col 2", "Row 5 Col 3", "Row 5 Col 4"],
  ]);
  const [heading, setHeading] = useState("Template");

  

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
        showTemplate,
        setShowTemplate,
        formRef,
        dropdownRef,
        optionsDivRef,
        surveyCategory,
        setSurveyCategory,
        template,
        setTemplate,
        rows,
        setRows,
        heading,
        setHeading,
      }}
    >
      {children}
    </CreateSurveyContext.Provider>
  );
};
