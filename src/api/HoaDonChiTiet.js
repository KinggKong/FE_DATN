import axios from "./axiosClient"

const getAllHdctByIdHoaDon = (id) => {
    const url = `/api/v1/hdct/${id}`;
    return axios.get(url);
}

const deleteHdctById = (id) => {
    const url = `/api/v1/hdct/${id}`;
    return axios.delete(url);
}

const createHoaDonChiTiet = (payload) => {
    const url = "/api/v1/hdct/create";
    return axios.post(url, payload)
}

const updateSoLuongHDCT = (payload, id) => {
    const url = `/api/v1/hdct/updateSoLuong/${id}`;
    return axios.put(url, payload);
}

const detailHDCT = (id) => {
    const url = `/api/v1/hdct/detail/${id}`;
    return axios.get(url);
}



export {getAllHdctByIdHoaDon, deleteHdctById, createHoaDonChiTiet, updateSoLuongHDCT, detailHDCT};