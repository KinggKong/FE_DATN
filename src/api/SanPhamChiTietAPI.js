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

const updateSanPhamChiTietApi = (id, updateSanPhamChiTiet) => {
    const url = `/api/v1/sanphamchitiets/${id}`;
    return axiosClient.put(url, updateSanPhamChiTiet);
}

const getSanPhamChiTietByIdApi = (id) => {
    const url = `/api/v1/sanphamchitiets/${id}`;
    return axiosClient.get(url);
}
const getSanPhamChiTietByProductIdApi = (id) => {
    const url = `/api/v1/sanphamchitiets/sanpham/${id}`;
    return axiosClient.get(url);
}
const getSanPhamChiTietByIdMauSacAndIdKichThuocApi = (params) => {
    const url = `/api/v1/sanphamchitiets/exits`;
    return axiosClient.get(url, { params });
}
const updateProductStautsApi = (id, params) => {
    const url = `/api/v1/sanphamchitiets/status/${id}`;
    return axiosClient.put(url, params);
};


const getAllSanPhamChiTietBySanPhamIdApi = (id) => {
    const url = `/api/v1/sanphamchitiets/get-all-by-sanpham/${id}`;
    return axiosClient.get(url);
}

const getMaxPriceApi = () => {
    const url = `/api/v1/sanphamchitiets/max-price`;
    return axiosClient.get(url);
}

const getSanPhamChiTietSoLuongApi = (params) => {
    const url = "/api/v1/sanphamchitiets/so-luong";
    return axiosClient.get(url, { params });
};
const getAllSanPhamChiTietBanApi = (params) => {
    const url = "/api/v1/sanphamchitiets/get-all-ban";
    return axiosClient.get(url, { params });
}

const fillData = (params) => {
    const url = "/api/v1/sanphamchitiets/fillData";
    return axiosClient.get(url, { params });
};

export {
    getAllSanPhamChiTietApi, deleteSanPhamChiTietApi,
    createSanPhamChiTietApi, updateSanPhamChiTietApi,
    getSanPhamChiTietByIdApi, updateProductStautsApi,
    getSanPhamChiTietByProductIdApi,

    getSanPhamChiTietByIdMauSacAndIdKichThuocApi,
    getAllSanPhamChiTietBySanPhamIdApi,
    getMaxPriceApi,
    getSanPhamChiTietSoLuongApi,
    fillData,
    getAllSanPhamChiTietBanApi

};