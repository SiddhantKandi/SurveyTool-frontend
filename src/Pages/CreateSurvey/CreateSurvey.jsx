import React, { useContext, useEffect } from "react";
import SurveyTitle from "./SurveyTitle.jsx";
import QuestionInput from "./QuestionInput.jsx";
import QuestionOptions from "./QuestionOptions.jsx";
import NavigationButtons from "./NavigationButtons.jsx";
import QuestionList from "../../Components/DisplayQuestionList.jsx";
import ImportQuestions from "./ImportQuestions.jsx";
import QuestionBank from "./Questionbank.jsx";
import { toast } from "react-toastify";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";

const CreateSurvey = () => {
  const {
    question,
    setQuestion,
    optionsType,
    dropdownVisible,
    setDropdownVisible,
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
    formRef,
    dropdownRef,
    optionsDivRef,
  } = useContext(CreateSurveyContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowImportForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    if (
      (optionsType === "multiple select" || optionsType === "single choice") &&
      optionValues.every((opt) => opt.trim() === "")
    ) {
      toast.error("Please enter at least one option.");
      return;
    }

    // Check if the question already exists in the questionsList
    const questionExists = questionsList.some(
      (q) => q.question.toLowerCase() === question.trim().toLowerCase()
    );

    if (questionExists) {
      toast.error(
        "This question already exists in the database. Please enter a new question."
      );
      return;
    }

    const newQuestion = {
      question,
      options: optionValues.filter((opt) => opt.trim() !== ""),
      questiontype: optionsType,
      questioncategory: questioncategory,
      surveyType: "anonymous",
    };

    setQuestionsList((prev) => [...prev, newQuestion]);
    setQuestion(""); // Clear question input
    setOptionValues(["", "", "", ""]); // Reset options
    setquestionCategory("");
    setShowOptionsInput(false);
  };

  const handleImportQuestions = (importedQuestions) => {
    const categorizedQuestions = importedQuestions.map((q) => ({
      question: q.question, // Default to "Untitled Question" if the question is missing
      options: q.options, // Default to an empty array if options are missing
      questiontype: q.questiontype || "multiple select", // Default type to "Multiple select" if missing
      questioncategory: q.questioncategory || "general", //General for default
      surveyType: "anonymous", // Use the selected category or a default one
    }));

    // Filter out any duplicate questions that already exist in the questions list
    const uniqueImportedQuestions = categorizedQuestions.filter(
      (importedQuestion) =>
        !questionsList.some(
          (existingQuestion) =>
            existingQuestion.question.toLowerCase() ===
            importedQuestion.question.toLowerCase()
        )
    );

    // If no new questions to import, alert the user
    if (uniqueImportedQuestions.length === 0) {
      toast.error(
        "No new questions to import. All questions already exist in the survey."
      );
      setShowImportForm(false);
      return;
    }

    // Append the unique questions to the existing list
    setQuestionsList((prevQuestions) => {
      const updatedList = [...prevQuestions, ...uniqueImportedQuestions];
      return updatedList;
    });

    setShowImportForm(false); // Close the import form
  };

  return (
    <div
      className="flex h-full mr-3 p-0 ml-3"
      style={{ width: "calc(100vw - 20px)" }}
    >
      <div className="flex flex-col m-0 p-4 w-full h-full bg-white">
        <SurveyTitle />

        {showImportForm && (
          <div ref={formRef}>
            <ImportQuestions onImportQuestions={handleImportQuestions} />
          </div>
        )}

        {showQuestionBank && <QuestionBank />}

        {questionsList.length > 0 && <QuestionList />}

        <div ref={dropdownRef}>
          <QuestionInput />
        </div>

        <div ref={optionsDivRef}>
          <QuestionOptions />
        </div>

        <NavigationButtons onAddQuestion={handleSubmit} />

      </div>
    </div>
  );
};

export default CreateSurvey;
