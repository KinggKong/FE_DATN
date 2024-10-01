import axiosClient from "./axiosClient";

const getAllChatLieuDeApi =(params) =>{
    const url = "/api/v1/chatlieudes";
    return axiosClient.get(url,{params});
}

const createChatLieuDeApi = (chatlieude) => {
    const url = `/api/v1/chatlieudes`;
    return axiosClient.post(url, chatlieude);
}
const updateChatLieuDeApi = (id,updateChatLieuDe) => {
    const url = `/api/v1/chatlieudes/${id}`;
    return axiosClient.put(url, updateChatLieuDe);
}
const deleteChatLieuDeApi = (id) => {
    const url = `/api/v1/chatlieudes/${id}`;
    return axiosClient.delete(url);
}

export { getAllChatLieuDeApi, createChatLieuDeApi, updateChatLieuDeApi, deleteChatLieuDeApi };