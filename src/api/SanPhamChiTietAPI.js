import axiosClient from "./axiosClient";

const getAllSanPhamChiTietApi = (params) => {
    const url = "/api/v1/sanphamchitiets";
    return axiosClient.get(url, { params });
    };

const deleteSanPhamChiTietApi = (id) => {
    const url = `/api/v1/sanphamchitiets/${id}`;
    return axiosClient.delete(url);
    }

const createSanPhamChiTietApi = (sanphamchitiet) => {
    const url = `/api/v1/sanphamchitiets`;
    return axiosClient.post(url, sanphamchitiet);
    }

const updateSanPhamChiTietApi = (id,updateSanPhamChiTiet) => {
    const url = `/api/v1/sanphamchitiets/${id}`;
    return axiosClient.put(url, updateSanPhamChiTiet);
    }

const getSanPhamChiTietByIdApi = (id) => {
    const url = `/api/v1/sanphamchitiets/${id}`;
    return axiosClient.get(url);
    }
export { getAllSanPhamChiTietApi, deleteSanPhamChiTietApi, createSanPhamChiTietApi, updateSanPhamChiTietApi, getSanPhamChiTietByIdApi };