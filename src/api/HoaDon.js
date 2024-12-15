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

const updateSoLuongAndTongTienHoaDon = (id) => {
    const url = `/api/v1/hoaDon/updateSoLuongAndTongTien/${id}`;
    return axiosClient.put(url);
}

const confirmPayment = (id, method,diachi,ship) => {
    const url = `/api/v1/hoaDon/complete/${id}?method=${method}&&diaChi=${diachi}&&tienShip=${ship}`;
    return axiosClient.patch(url);
}

const processPayment = (payload) => {
    const url = "/api/v1/hoaDon/processPayment";
    return axiosClient.put(url, payload);
}

const addCustomerToInvoice = (idHoaDon, idKhachHang) => {
    const url = `/api/v1/hoaDon/invoices/${idHoaDon}/addCustomer/${idKhachHang}`;
    return axiosClient.put(url);
}

const changeTypeBill = (id) => {
    const url = `/api/v1/hoaDon/changeTypeBill/${id}`;
    return axiosClient.put(url);
}

export {getAllHoaDon, getHoaDonById, createHoaDon, deleteHoaDon, updateHoaDon, confirmPayment, processPayment, addCustomerToInvoice, updateSoLuongAndTongTienHoaDon, changeTypeBill};
