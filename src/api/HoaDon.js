import axiosClient from "./axiosClient";

const getAllHoaDon = () => {
    const url = "/api/v1/hoaDon";
    return axiosClient.get(url);
}

const getHoaDonById = (id) => {
    const url = `/api/v1/hoaDon/${id}`;
    return axiosClient.get(url);
}

const createHoaDon = () => {
    const url ="/api/v1/hoaDon";
    return axiosClient.post(url);
}

const deleteHoaDon = (id) => {
    const url = `/api/v1/hoaDon/${id}`;
    return axiosClient.delete(url); 
}

const updateHoaDon = (id, data) => {
    const url = `/api/v1/hoaDon/${id}`;
    return axiosClient.put(url, data);
}

export {getAllHoaDon, getHoaDonById, createHoaDon, deleteHoaDon, updateHoaDon}
