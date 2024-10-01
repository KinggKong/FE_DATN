import axiosClient from "./axiosClient";

const getAllMauSacApi = (params) => {
  const url = "/api/v1/mausacs";
  return axiosClient.get(url, { params });
};

const deleteMauSacApi = (id) => {
  const url = `/api/v1/mausacs/${id}`;
  return axiosClient.delete(url);
};

const createMauSacApi = (mausac) => {
  console.log(mausac);
  const url = `/api/v1/mausacs`;
  return axiosClient.post(url, mausac);
};

const updateMauSacApi = (id,updateMauSac) => {
  const url = `/api/v1/mausacs/${id}`;
  return axiosClient.put(url, updateMauSac);
};

const getMauSacByIdApi = (id) => {
  const url = `/api/v1/mausacs/${id}`;
  return axiosClient.get(url);
};
export { getAllMauSacApi, deleteMauSacApi, createMauSacApi, updateMauSacApi, getMauSacByIdApi };
