import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcelWithMultipleSheets = (data, fileName, salesType) => {
    const workbook = XLSX.utils.book_new();
  
    Object.keys(data).forEach((sheetName) => {
      const sheetData = data[sheetName];
  
      // Kiểm tra dữ liệu có phải là mảng
      if (!Array.isArray(sheetData)) {
        console.error(`Sheet "${sheetName}" không phải là mảng.`, sheetData);
        return;
      }
  
      // Thêm thông tin salesType vào đầu dữ liệu
      const modifiedSheetData = [
        { "Loại Bán Hàng": salesType || "Cả online và offline" }, // Thông tin loại bán hàng
        {}, // Dòng trống để cách biệt
        ...sheetData, // Dữ liệu gốc
      ];
  
      const worksheet = XLSX.utils.json_to_sheet(modifiedSheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    saveAs(blob, `${fileName}.xlsx`);
  };
  