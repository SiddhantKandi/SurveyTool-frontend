import React, { useState, useEffect, useRef, useContext } from "react";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { TargetedSurveyContext } from "../../Context/TargetedSurveyContext.jsx";

const ImportSurveyRespondents = () => {
  const [file, setFile] = useState(null);

  const { users, setUsers, setShowImportPopup } = useContext(TargetedSurveyContext);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const showImport = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showImport.current && !showImport.current.contains(event.target)) {
        setShowImportPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // Get the first worksheet

        // Convert worksheet rows into JSON data
        const jsonData = [];
        worksheet.eachRow((row, rowNumber) => {
          // Skip the header row
          if (rowNumber === 1) return;
          const respondent = {
            username: row.getCell(1).value, // Assuming username is in the first column
            email: row.getCell(2).value, // Assuming email is in the second column
          };
          jsonData.push(respondent);
        });

        // Validate data
        const validRespondents = jsonData.filter(
          (respondent) => respondent.email
        );

        if (!validRespondents.length) {
          toast.error("No valid email addresses found.");
          return;
        }

        // Update the users array
        const updatedUsers = [...users, ...validRespondents];
        setUsers(updatedUsers);

        toast.success("Respondents imported successfully");
        setShowImportPopup(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error(error.message || "There was an issue processing the file.");
    }
  };

  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-white shadow-lg rounded-lg border border-indigo-400"
      ref={showImport}
    >
      <h2 className="text-xl font-semibold text-indigo-600 mb-4">
        Import Respondents
      </h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="block mb-4 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />
      <button
        onClick={handleImport}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 pr-7"
      >
        Import Respondents
      </button>
    </div>
  );
};

export default ImportSurveyRespondents;
