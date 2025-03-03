import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ExcelJS from "exceljs";
import { FaFileExcel, FaDownload, FaTrash, FaSpinner } from "react-icons/fa";
import {toast} from 'react-toastify';
import {downloadExcel} from '../../utils/downloadExcel.js';

const ExcelFileImport = ({surveyTemplate}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);


  const onDrop = useCallback((acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    if (currentFile) {
      if (currentFile.size > 10 * 1024 * 1024) {
        setError("File size should not exceed 10MB");
        return;
      }

      const fileExtension = currentFile.name.split(".").pop().toLowerCase();
      if (!["xlsx", "xls"].includes(fileExtension)) {
        setError("Please upload only Excel files (.xlsx or .xls)");
        
        return;
      }

      setFile(currentFile);
      setError("");
      handleFilePreview(currentFile);
      toast.success("File imported successfully")
    }
  }, []);

  const handleFilePreview = async (file) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);
        const worksheet = workbook.worksheets[0];
        const jsonData = [];
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          jsonData.push(row.values);
        });
        setPreview(jsonData.slice(1, 6)); // Skip the first row (header)
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError("Error reading file");
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto mt-10 mb-10 border border-black">
        <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          To upload the excel file click on the dotted container
        </h2>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-blue-400 hover:border-blue-700"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload Excel file" />
            <FaFileExcel className="mx-auto text-4xl text-green-500 mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive
                ? "Drop the Excel file here"
                : "Drag & drop an Excel file here, or click to select"}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: .xlsx, .xls (Max size: 10MB)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* File Preview */}
          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaFileExcel className="text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove file"
                >
                  <FaTrash />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : (
                preview && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody>
                        {preview.map((row, idx) => (
                          <tr key={idx}>
                            {row.map((cell, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}

          {/* Template Download Button */}
          <button
            onClick={() => downloadExcel(surveyTemplate)}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Download Excel template"
          >
            <FaDownload className="mr-2" />
            Download Excel Template
          </button>
        </div>
      </div>
    </>
  );
};

export default ExcelFileImport;
