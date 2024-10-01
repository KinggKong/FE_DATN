import axiosClient from "./axiosClient";

// Lấy danh sách chất liệu vải với các tham số
const getAllChatLieuVaiApi = (params) => {
  const url = "/api/v1/chatlieuvais"; // Đường dẫn API cho chất liệu vải
  return axiosClient.get(url, { params });
};

// Xóa một chất liệu vải theo ID
const deleteChatLieuVaiApi = (id) => {
  const url = `/api/v1/chatlieuvais/${id}`; // Đường dẫn API cho xóa chất liệu vải
  return axiosClient.delete(url);
};

// Tạo mới một chất liệu vải
const createChatLieuVaiApi = (chatLieuVai) => {
  const url = `/api/v1/chatlieuvais`; // Đường dẫn API cho tạo mới chất liệu vải
  return axiosClient.post(url, chatLieuVai);
};

// Cập nhật thông tin một chất liệu vải theo ID
const updateChatLieuVaiApi = (id, updateChatLieuVai) => {
  const url = `/api/v1/chatlieuvais/${id}`; // Đường dẫn API cho cập nhật chất liệu vải
  return axiosClient.put(url, updateChatLieuVai);
};

// Xuất các hàm API để sử dụng trong ứng dụng
export { getAllChatLieuVaiApi, deleteChatLieuVaiApi, createChatLieuVaiApi, updateChatLieuVaiApi };
