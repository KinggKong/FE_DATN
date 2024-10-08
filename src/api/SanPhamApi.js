import axiosClient from "./axiosClient";

const getAllSanPhamApi = (params) => {
  const url = "/api/v1/sanphams";
  return axiosClient.get(url, { params });
};

const createSanPhamApi = (params) => {
  const url = "/api/v1/sanphams";
  return axiosClient.post(url, params);
};

const deleteSanPhamApi = (id) => {
  const url = `/api/v1/sanphams/${id}`;
  return axiosClient.delete(url);
};

const updateSanPhamApi = (id, updateSanPham) => {
  const url = `/api/v1/sanphams/${id}`;
  return axiosClient.put(url, updateSanPham);
};

const updateProductStautsApi = (id, params) => {
  const url = `/api/v1/sanphams/status/${id}`;
  return axiosClient.put(url,params);
};

export {
  getAllSanPhamApi,
  deleteSanPhamApi,
  createSanPhamApi,
  updateSanPhamApi,
  updateProductStautsApi
};
