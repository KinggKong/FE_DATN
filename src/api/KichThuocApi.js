import axiosClient from "./axiosClient";

// Lấy danh sách kích thước với các tham số
const getAllKichThuocApi = (params) => {
  const url = "/api/v1/kichthuocs"; // Đường dẫn API cho kích thước
  return axiosClient.get(url, { params });
};

// Xóa một kích thước theo ID
const deleteKichThuocApi = (id) => {
  const url = `/api/v1/kichthuocs/${id}`; // Đường dẫn API cho xóa kích thước
  return axiosClient.delete(url);
};

// Tạo mới một kích thước
const createKichThuocApi = (kichThuoc) => {
  const url = `/api/v1/kichthuocs`; // Đường dẫn API cho tạo mới kích thước
  return axiosClient.post(url, kichThuoc);
};

// Cập nhật thông tin một kích thước theo ID
const updateKichThuocApi = (id, updateKichThuoc) => {
  const url = `/api/v1/kichthuocs/${id}`; // Đường dẫn API cho cập nhật kích thước
  return axiosClient.put(url, updateKichThuoc);
};

const getKichThuocByIdApi = (id) => {
  const url = `/api/v1/kichthuocs/${id}`;
  return axiosClient.get(url);
};

// Xuất các hàm API để sử dụng trong ứng dụng
export { getAllKichThuocApi, deleteKichThuocApi, createKichThuocApi, updateKichThuocApi, getKichThuocByIdApi };
