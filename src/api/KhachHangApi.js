import axiosClient from "./axiosClient";

// Lấy danh sách khách hàng với các tham số
const getAllKhachHangApi = (params) => {
  const url = "/api/v1/khachhangs"; // Đường dẫn API cho khách hàng
  return axiosClient.get(url, { params });
};

// Xóa một khách hàng theo ID
const deleteKhachHangApi = (id) => {
  const url = `/api/v1/khachhangs/${id}`; // Đường dẫn API cho xóa khách hàng
  return axiosClient.delete(url);
};

// Tạo mới một khách hàng
const createKhachHangApi = (khachHang) => {
  const url = `/api/v1/khachhangs`; // Đường dẫn API cho tạo mới khách hàng
  return axiosClient.post(url, khachHang);
};

// Cập nhật thông tin một khách hàng theo ID
const updateKhachHangApi = (id, updateKhachHang) => {
  const url = `/api/v1/khachhangs/${id}`; // Đường dẫn API cho cập nhật khách hàng
  return axiosClient.put(url, updateKhachHang);
};

const getKhachHangByIdApi = (id) => {
  const url = `/api/v1/khachhangs/${id}`;
  return axiosClient.get(url);
};

// Xuất các hàm API để sử dụng trong ứng dụng
export { getAllKhachHangApi, deleteKhachHangApi, createKhachHangApi, updateKhachHangApi, getKhachHangByIdApi };
