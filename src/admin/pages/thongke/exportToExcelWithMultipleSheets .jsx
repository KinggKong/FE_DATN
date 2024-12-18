

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcelWithMultipleSheets = (data, fileName, salesType) => {
  const workbook = XLSX.utils.book_new();

  const columnWidths = {
    "Doanh Thu": [
      { wch: 20 }, // Cột 1
      { wch: 15 }, // Cột 2
      { wch: 20 }, // Cột 3
      { wch: 30 }, // Cột 4
      { wch: 20 }, // Cột 5
    ],
    "Sản Phẩm Bán Chạy": [
      { wch: 20 }, // Cột 1
      { wch: 30 }, // Cột 2
      { wch: 18 }, // Cột 3
      { wch: 20 }, // Cột 4
      { wch: 10 },
      { wch: 20 },
    ],
    "Sản Phẩm Hết Hàng": [
      { wch: 20 }, // Cột 1
      { wch: 10 }, // Cột 2
      { wch: 10 }, // Cột 3
      { wch: 10 }, // Cột 4
      { wch: 20 }, // Cột 1
      { wch: 25 }, // Cột 2
      { wch: 10 }, // Cột 3
      { wch: 10 }, // Cột 4
    ],
  };

  Object.keys(data).forEach((sheetName) => {
    const sheetData = data[sheetName];

    if (!Array.isArray(sheetData)) {
      console.error(`Sheet "${sheetName}" không phải là mảng.`, sheetData);
      return;
    }

    // Thêm thông tin loại bán hàng vào đầu sheet
    const modifiedSheetData = [
      { "Loại Bán Hàng": salesType || "Cả online và offline" },
      {}, // Dòng trống
      ...sheetData,
    ];

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(modifiedSheetData);

    // Áp dụng độ rộng cột cố định cho từng tab
    worksheet["!cols"] = columnWidths[sheetName] || [];

    // Định dạng dòng tiêu đề: In đậm và Border
    const titleRowIndex = 1; // Dòng tiêu đề là dòng 1 (đã chỉnh sửa trước đó để bắt đầu từ dòng 2)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Lặp qua tất cả các ô trong phạm vi và áp dụng định dạng
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });

        if (!worksheet[cellRef]) worksheet[cellRef] = {}; // Đảm bảo có ô

        // Thêm border cho tất cả các ô
        worksheet[cellRef].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };

        // In đậm dòng tiêu đề
        if (row === titleRowIndex) {
          worksheet[cellRef].s.font = { bold: true }; // Đặt font in đậm cho dòng tiêu đề
        }
      }
    }

    // Thêm dữ liệu vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Xuất file Excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Tải file về
  saveAs(blob, `${fileName}.xlsx`);
};
