import axiosClient from "./axiosClient";

const getSaleCTByPrDtApi = (id) => {
    const url = `/api/v1/salect/get-by-spct/${id}`;
    return axiosClient.get(url);
    };

 export { getSaleCTByPrDtApi };