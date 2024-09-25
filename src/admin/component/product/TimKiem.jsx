import React from "react";
import { CgAdd } from "react-icons/cg";
const TimKiem = ({ title, placeholder, onSearchChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Danh sách {title}</h2>
      <h3 className="text-sm  mb-2 ">Tìm kiếm</h3>
      <div className="flex justify-between">
        <input
          className="border rounded h-10 w-full mr-2 px-3"
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          
          className="w-40 flex items-center justify-center
         px-3 py-2 text-slate-700 rounded-lg hover:bg-yellow-400 hover:text-slate-900 bg-green-600 text-white"
        >
          <CgAdd className="mr-2" /> <span>Thêm mới</span>
        </button>
      </div>
    </div>
  );
};

export default TimKiem;
