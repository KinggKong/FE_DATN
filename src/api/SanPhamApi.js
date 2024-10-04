import axiosClient from "./axiosClient";

const getAllSanPhamApi = (params) => {
  const url = "/api/v1/sanphams";
  return axiosClient.get(url, { params });
};

const deleteSanPhamApi = (id) => {
    const url = `/api/v1/sanphams/${id}`;
    return axiosClient.delete(url)
}

export { getAllSanPhamApi,deleteSanPhamApi };
