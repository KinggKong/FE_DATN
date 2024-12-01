import axiosClient from "./axiosClient";

const createLSTT = (data) => {
    const url = 'api/v1/lichSuThanhToan';
    return axiosClient.post(url, data);
}

const getLSTTByIDHD = (id) => {
    const url = `api/v1/lichSuThanhToan/getLichSuHoaDonByHoaDonId/${id}`;
    return axiosClient.get(url);
}

export {createLSTT, getLSTTByIDHD}
