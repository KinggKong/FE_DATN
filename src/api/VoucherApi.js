import axiosClient from "./axiosClient";

// Lấy danh sách voucher với các tham số
const getAllVoucherApi = (params) => {
  const url = "/api/v1/vouchers"; // Đường dẫn API cho voucher
  return axiosClient.get(url, { params });
};

// Xóa một voucher theo ID
const deleteVoucherApi = (id) => {
  const url = `/api/v1/vouchers/${id}`; // Đường dẫn API cho xóa voucher
  return axiosClient.delete(url);
};

// Tạo mới một voucher
const createVoucherApi = (voucher) => {
  const url = `/api/v1/vouchers`; // Đường dẫn API cho tạo mới voucher
  return axiosClient.post(url, voucher);
};

// Cập nhật thông tin một voucher theo ID
const updateVoucherApi = (id, updateVoucher) => {
  const url = `/api/v1/vouchers/${id}`; // Đường dẫn API cho cập nhật voucher
  return axiosClient.put(url, updateVoucher);
};

// Lấy thông tin một voucher theo ID
const getVoucherByIdApi = (id) => {
  const url = `/api/v1/vouchers/${id}`;
  return axiosClient.get(url);
};

// Xuất các hàm API để sử dụng trong ứng dụng
export { getAllVoucherApi, deleteVoucherApi, createVoucherApi, updateVoucherApi, getVoucherByIdApi };
