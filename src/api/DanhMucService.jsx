import axiosClient from "./axiosClient";

const getAllDanhMucApi = (params) => {
  const url = "/api/v1/danhMuc";
  return axiosClient.get(url, { params });
};

const deleteDanhMucApi = (id) => {
  const url = `/api/v1/danhMuc/${id}`;
  return axiosClient.delete(url);
};

const createDanhMucApi = (DanhMuc) => {
  console.log(DanhMuc);
  const url = `/api/v1/danhMuc`;
  return axiosClient.post(url, DanhMuc);
};

const updateDanhMucApi = (id,updateDanhMuc) => {
  const url = `/api/v1/danhMuc/${id}`;
  return axiosClient.put(url, updateDanhMuc);
};

export { getAllDanhMucApi, deleteDanhMucApi, createDanhMucApi, updateDanhMucApi };
