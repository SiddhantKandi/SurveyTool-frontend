import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";

export const downloadExcel = async (columns) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Add headers
    worksheet.addRow(columns.map((col) => col.header));

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Survey_Template.xlsx");
  };