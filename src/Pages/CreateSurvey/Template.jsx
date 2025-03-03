import React, { useState, useContext } from "react";
import { FiDownload, FiPlusCircle, FiTrash2, FiEdit2 } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { CreateSurveyContext } from "../../Context/CreateSurveyContext.jsx";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {downloadExcel} from '../../utils/downloadExcel.js'

const DynamicTable = () => {
  const { setTemplate, setRows, rows, heading, setHeading, setShowTemplate,template } =
    useContext(CreateSurveyContext);

  const [columns, setColumns] = useState([
    { id: 1, header: "Name" },
    { id: 2, header: "Age" },
    { id: 3, header: "Email" },
    { id: 4, header: "Phone Number" },
  ]);

  const addColumnToRows = () => {
    setRows(
      rows.map((row) => [
        ...row,
        `Row ${rows.indexOf(row) + 1} Col ${columns.length + 1}`,
      ])
    );
  };

  const storeTemplate = () => {
    setTemplate(columns);
    toast.success("Template added to the survey");

  };

  const removeTemplate = () => {
    setTemplate([]);
    toast.success("Template removed from the survey");
  };

  const addColumn = () => {
    const newColumnId = columns.length + 1;
    setColumns([
      ...columns,
      { id: newColumnId, header: `Column ${newColumnId}` },
    ]);
    addColumnToRows();
  };

  const [editingHeader, setEditingHeader] = useState(null);
  const removeColumn = (columnIndex) => {
    setColumns(columns.filter((_, index) => index !== columnIndex));
    setRows(rows.map((row) => row.filter((_, index) => index !== columnIndex)));
  };
  const [isEditingHeading, setIsEditingHeading] = useState(false);

  const startEditingHeader = (columnId) => {
    setEditingHeader(columnId);
  };

  const updateHeader = (columnIndex, newHeader) => {
    setColumns(
      columns.map((col, index) =>
        index === columnIndex ? { ...col, header: newHeader } : col
      )
    );
  };

  return (
    <>
      <div className="fixed inset-20 max-h-dvh z-50 bg-gray-300 p-5 bg-opacity-100 flex items-center justify-center border border-black rounded-lg">
        <div className="p-6 w-full h-full flex justify-center flex-col">
          <div className="mb-6 flex justify-between items-center">
            {/* Editable heading */}
            <div className="flex items-center">
              {isEditingHeading ? (
                <input
                  type="text"
                  className="text-2xl font-bold text-gray-800 mr-3 border rounded px-2 py-1"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  onBlur={() => setIsEditingHeading(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingHeading(false);
                  }}
                  autoFocus
                />
              ) : (
                <h1
                  className="text-2xl font-bold text-gray-800 mr-3 hover:cursor-pointer"
                  onClick={() => setIsEditingHeading(true)}
                >
                  {heading}
                </h1>
              )}
              <FiEdit2
                onClick={() => setIsEditingHeading(true)}
                className="hover:cursor-pointer"
              />
            </div>
            <div className="space-x-4 flex flex-row">
              <button
                onClick={addColumn}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
              >
                <FiPlusCircle className="mr-2" /> Add Column
              </button>
              <button
                onClick={() => {downloadExcel(columns)}}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
              >
                <FiDownload className="mr-2" /> Download as Excel
              </button>
              <IoMdCloseCircleOutline
                className="ml-2 text-3xl text-red-600 mt-1 hover:cursor-pointer"
                onClick={() => {
                  setShowTemplate(false);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((column, columnIndex) => (
                    <th
                      key={column.id}
                      className="border px-4 py-2 relative"
                      style={{ minWidth: `${column.header.length * 10}px` }}
                    >
                      <div className="flex items-center justify-between">
                        {editingHeader === column.id ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={column.header}
                            onChange={(e) =>
                              updateHeader(columnIndex, e.target.value)
                            }
                            onBlur={() => setEditingHeader(null)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && setEditingHeader(null)
                            }
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{column.header}</span>
                            <button
                              onClick={() => startEditingHeader(column.id)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label="Edit column header"
                            >
                              <FiEdit2 size={16} />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => removeColumn(columnIndex)}
                          className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
                          aria-label="Remove column"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border px-4 py-2">
                        {/* Here, the input fields are used to allow filling in the empty rows */}
                        <input
                          type="text"
                          className="w-full bg-transparent border-none focus:outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row mx-auto mt-3">
            <button
              className="bg-green-400 flex flex-row mr-4 items-center justify-center hover:bg-green-600 px-3 py-3 mt-5 max-w-40 mx-auto border border-gray-200 rounded-lg"
              onClick={storeTemplate}
            >
              <MdOutlineAddCircleOutline className="mr-2 text-lg" />
              Add Template
            </button>
            <button
              className="bg-red-400 flex flex-row items-center justify-center hover:bg-red-700 px-3 py-2 mt-5 max-w-60 mx-auto border border-gray-200 rounded-lg"
              onClick={removeTemplate}
            >
              <IoRemoveCircleOutline className="mr-2 text-lg" />
              Remove Template
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicTable;
