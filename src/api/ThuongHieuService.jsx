import axiosClient from "./axiosClient";

const getAllThuongHieuApi = (params) => {
  const url = "/api/v1/thuongHieu";
  return axiosClient.get(url, { params });
};

const deleteThuongHieuApi = (id) => {
  const url = `/api/v1/thuongHieu/${id}`;
  return axiosClient.delete(url);
};

const createThuongHieuApi = (thuongHieu) => {
  console.log(thuongHieu);
  const url = `/api/v1/thuongHieu`;
  return axiosClient.post(url, thuongHieu);
};

const updateThuongHieuApi = (id,updatethuongHieu) => {
  const url = `/api/v1/thuongHieu/${id}`;
  return axiosClient.put(url, updatethuongHieu);
};

export { getAllThuongHieuApi, deleteThuongHieuApi, createThuongHieuApi, updateThuongHieuApi };
