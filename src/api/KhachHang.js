import axios from "./axiosClient";

const getAllKhachHang = () => {
    const url = "/api/v1/khachHang";
    return axios.get(url);
}

export {getAllKhachHang};