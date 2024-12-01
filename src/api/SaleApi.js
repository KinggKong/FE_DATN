import axiosClient from "./axiosClient";

const getAllSaleApi = (params) => {
  const url = "/api/v1/sale";
  return axiosClient.get(url, { params });
};
const createSaleApi = (params) => {
  const url = "/api/v1/sale";
  return axiosClient.post(url, params);
};
const getAllTenChienDichApi = () => {
  const url = "/api/v1/sale/getAllTenChienDich";
  return axiosClient.get(url);
};
const getSaleByIdApi = (id) => {
  const url = `/api/v1/sale/${id}`;
  return axiosClient.get(url);
};
const updateSaleApi = (id, params) => {
  const url = `/api/v1/sale/${id}`;
  return axiosClient.put(url, params);
};
const updateStatusSaleApi = (id) => {
  const url = `/api/v1/sale/status/${id}`;
  return axiosClient.put(url);
};
export { getAllSaleApi,createSaleApi ,getAllTenChienDichApi, getSaleByIdApi, updateSaleApi, updateStatusSaleApi };