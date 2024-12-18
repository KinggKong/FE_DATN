import axiosClient from "./axiosClient";

// Lấy danh sách nhân viên với phân trang và tìm kiếm theo tên
const getAllNhanVienApi = (params) => {
  const url = "/api/v1/nhanviens";
  return axiosClient.get(url, { params });
};

// Tạo mới nhân viên
const createNhanVienApi = (params) => {
  const url = "/api/v1/nhanviens";
  return axiosClient.post(url, params);
};

// Xóa nhân viên theo ID
const deleteNhanVienApi = (id) => {
  const url = `/api/v1/nhanviens/${id}`;
  return axiosClient.delete(url);
};

// Cập nhật thông tin nhân viên theo ID
const updateNhanVienApi = (id, updateNhanVien) => {
  const url = `/api/v1/nhanviens/${id}`;
  return axiosClient.put(url, updateNhanVien);
};

// Lấy thông tin chi tiết nhân viên theo ID
const getNhanVienByIdApi = (id) => {
  const url = `/api/v1/nhanviens/${id}`;
  return axiosClient.get(url);
};

// Tìm kiếm nhân viên theo tên
const getAllNhanVienByTenApi = (params) => {
  const url = "/api/v1/nhanviens";
  return axiosClient.get(url, { params });
};

//get tai khoan by id owner
const getTaiKhoanByIdOwner = (params) => {

  const url = `/api/v1/taikhoans/getIDOwner`;
  return axiosClient.get(url,{params});
}

export {
  getAllNhanVienApi,
  deleteNhanVienApi,
  createNhanVienApi,
  updateNhanVienApi,
  getNhanVienByIdApi,
  getAllNhanVienByTenApi,
  getTaiKhoanByIdOwner
};
