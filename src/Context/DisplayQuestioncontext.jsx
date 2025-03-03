import { createContext, useState } from "react";

export const DisplayQuestionContext = createContext();

export const DisplayQuestionProvider = ({ children }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedOptions, setEditedOptions] = useState([]);
  return (
    <DisplayQuestionContext.Provider
      value={{
        editingIndex,
        setEditingIndex,
        editedQuestion,
        setEditedQuestion,
        editedOptions,
        setEditedOptions,
      }}
    >
      {children}
    </DisplayQuestionContext.Provider>
  );
};
