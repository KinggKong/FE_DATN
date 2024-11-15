import axiosClient from "./axiosClient";

const getThongKeApi = (params) => {
    const url = "/api/v1/thongke";
    return axiosClient.get(url, { params });
    }
export { getThongKeApi };