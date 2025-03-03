import { createContext, useState } from "react";

export const TargetedSurveyContext = createContext();

export const TargetedSurveyProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [showAudienceSelector, setShowAudienceSelector] = useState(false); // State to control popup for Showdatabaseusers
  const [showImportPopup, setShowImportPopup] = useState(false); // State to control popup for ImportRespondents
  const [databaseUsers, setDatabaseUsers] = useState([]);
  const [preview, setPreview] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  return (
    <TargetedSurveyContext.Provider
      value={{
        email,
        setEmail,
        username,
        setUsername,
        users,
        setUsers,
        showAudienceSelector,
        setShowAudienceSelector,
        showImportPopup,
        setShowImportPopup,
        databaseUsers,
        setDatabaseUsers,
        preview,
        setPreview,
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </TargetedSurveyContext.Provider>
  );
};
