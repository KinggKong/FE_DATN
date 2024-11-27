import axiosClient from "./axiosClient";

const getThongKeApi = (params) => {
    const url = "/api/v1/thongke";
    return axiosClient.get(url, { params });
    }
const getThongKeDoanhThu = (params) => {
    const url = "/api/v1/thongke/doanh-thu-ngay";
    return axiosClient.get(url, { params });
    }
const getThongKeDoanhThuSanPham = (params) => {
    const url = "/api/v1/thongke/doanh-thu-san-pham";
    return axiosClient.get(url, { params });
    }
export { getThongKeApi,
    getThongKeDoanhThu,
    getThongKeDoanhThuSanPham,
 };