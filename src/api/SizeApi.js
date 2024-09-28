import axiosClient from "./axiosClient";

// Lấy danh sách kích thước với các tham số
const getAllSizeApi = (params) => {
  const url = "/api/v1/size"; // Đường dẫn API cho kích thước
  return axiosClient.get(url, { params });
};

// Xóa một kích thước theo ID
const deleteSizeApi = (id) => {
  const url = `/api/v1/size/${id}`; // Đường dẫn API cho xóa kích thước
  return axiosClient.delete(url);
};

// Tạo mới một kích thước
const createSizeApi = (size) => {
  const url = `/api/v1/size`; // Đường dẫn API cho tạo mới kích thước
  return axiosClient.post(url, size);
};

// Cập nhật thông tin một kích thước theo ID
const updateSizeApi = (id, updateSize) => {
  const url = `/api/v1/size/${id}`; // Đường dẫn API cho cập nhật kích thước
  return axiosClient.put(url, updateSize);
};

// Xuất các hàm API để sử dụng trong ứng dụng
export { getAllSizeApi, deleteSizeApi, createSizeApi, updateSizeApi };
