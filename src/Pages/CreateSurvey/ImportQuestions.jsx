import React, { useState } from "react";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";

const ImportQuestions = ({ onImportQuestions }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(event.target.result);

        // Get the first sheet
        const worksheet = workbook.worksheets[0];

        // Convert sheet data to JSON
        const jsonData = [];
        worksheet.eachRow((row, rowNumber) => {
          // Skip the header row (assume it's the first row)
          if (rowNumber === 1) return;

          // Map the row values based on headers
          const question = row.values[1]; // Assuming first column is Question
          const type = row.values[2]; // Assuming second column is Type
          const category = row.values[3]; // Assuming third column is Category

          // Extract options starting from column 4
          const allOptions = row.values.slice(4);

          // Filter out empty, null, or "NA" options
          const validOptions = allOptions.filter(
            (option) => option && option.toString().toLowerCase() !== "na"
          );

          // Construct the question object
          jsonData.push({
            question: question || "Untitled Question", // Fallback if question is missing
            options: validOptions,
            questiontype:
              type?.toString().trim().toLowerCase() || "multiple select",
            questioncategory:
              category?.toString().trim().toLowerCase() || "general",
          });
        });

        if (!jsonData.length) {
          toast.error("No valid data found in the file.");
          return;
        }

        // Pass the processed questions to the parent component
        onImportQuestions(jsonData);
        toast.success("Questions imported successfully");
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was an issue processing the file."
      );
    }
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-white shadow-lg rounded-lg border border-indigo-400">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4">
        Import Questions
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
        Import Questions
      </button>
    </div>
  );
};

export default ImportQuestions;
