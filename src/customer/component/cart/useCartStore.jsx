import { create } from "zustand";
import axios from "axios";
import { message } from "antd";
import { useEffect } from "react";


const useCartStore = create((set) => ({


    cart: [],

    // Hàm thêm sản phẩm vào giỏ hàng và lưu vào DB
    addToCart: async (product) => {
        // Lấy thông tin người dùng từ localStorage
        const storedUserInfo = localStorage.getItem("userInfo");
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
        // Kiểm tra xem sản phẩm có khuyến mãi hay không
        const currentTime = new Date().getTime();
        const isDiscountActive =
            product.thoiGianGiamGia && currentTime < new Date(product.thoiGianGiamGia).getTime();

        // Tạo đối tượng sản phẩm với giá
        const productWithPrice = {
            ...product,
            soLuong: product.quantity || 1, // Khởi tạo số lượng mặc định là 1
            giaTien: isDiscountActive ? product.discountPrice : product.giaTien,
        };

        set((state) => {
            const existingProduct = state.cart.find(
                (item) => item.sanPhamChiTietResponse.id === product.sanPhamChiTietResponse.id
            );

            // if (existingProduct) {
            //     return {
            //         cart: state.cart.map((item) =>
            //             item.sanPhamChiTietResponse.id === product.sanPhamChiTietResponse.id
            //                 ? { ...item, soLuong: item.soLuong + product.soLuong }
            //                 : item
            //         ),
            //     };
            const soLuongHienTai = existingProduct ? existingProduct.soLuong : 0;
            const soLuongConLai = product.sanPhamChiTietResponse.soLuong; // Số lượng còn lại của sản phẩm từ API
            const soLuongMuonThem = product.soLuong || 1;

            if (soLuongHienTai + soLuongMuonThem > soLuongConLai) {
                message.error(
                    `Không thể thêm sản phẩm. Số lượng yêu cầu (${soLuongHienTai + soLuongMuonThem}) vượt quá số lượng còn lại (${soLuongConLai}).`
                );
                return { cart: state.cart }; // Giữ nguyên giỏ hàng nếu không hợp lệ
            }

            if (existingProduct) {
                message.success("Đã thêm sản phẩm vào giỏ hàng!");
                return {
                    cart: state.cart.map((item) =>
                        item.sanPhamChiTietResponse.id === product.sanPhamChiTietResponse.id
                            ? { ...item, soLuong: item.soLuong + soLuongMuonThem }
                            : item
                    ),

                };
            } else {
                message.success("Đã thêm sản phẩm vào giỏ hàng!");

                return {
                    cart: [
                        ...state.cart,
                        {
                            ...product,
                            productDetailID: product.productDetailID, // Đảm bảo thêm productDetailID
                        },
                    ],
                };
            }
        });


        // Gửi dữ liệu giỏ hàng chi tiết vào DB thông qua API
        if (userInfo) {
            try {

                if (product.sanPhamChiTietResponse.soLuong < product.soLuong) {
                    message.error("Số lượng sản phẩm trong kho không đủ!");
                    return;
                }


                const response = await axios.post("http://localhost:8080/api/v1/gio-hang-ct", {
                    idGioHang: userInfo.idGioHang, // ID giỏ hàng, thay bằng ID của người dùng hiện tại
                    idSanPhamChiTiet: product.id,
                    soLuong: product.quantity || 1,
                    giaTien: productWithPrice.giaTien,
                    thoiGianGiamGia: product.thoiGianGiamGia
                        ? new Date(product.thoiGianGiamGia).toISOString()
                        : null,
                    id_khachHang: userInfo.id, // ID khách hàng, thay bằng ID của người dùng hiện tại
                    trangThai: 1, // Giả sử trạng thái là 1
                });

                console.log("Sản phẩm đã được thêm vào DB:", response.data);
            } catch (error) {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            }
        } else {
            // message.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            try {

                if (product.sanPhamChiTietResponse.soLuong < product.soLuong) {
                    message.error("Số lượng sản phẩm trong kho không đủ!");
                    return;
                }


                const response = await axios.post("http://localhost:8080/api/v1/gio-hang-ct", {
                    idGioHang: 1, // ID giỏ hàng, thay bằng ID của người dùng hiện tại
                    idSanPhamChiTiet: product.id,
                    soLuong: product.quantity || 1,
                    giaTien: productWithPrice.giaTien,
                    thoiGianGiamGia: product.thoiGianGiamGia
                        ? new Date(product.thoiGianGiamGia).toISOString()
                        : null,
                    id_khachHang: 1, // ID khách hàng, thay bằng ID của người dùng hiện tại
                    trangThai: 1, // Giả sử trạng thái là 1
                });

                console.log("Sản phẩm đã được thêm vào DB:", response.data);
            } catch (error) {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            }
        }
    },

    // Cập nhật lại cart từ API
    fetchCart: async () => {
        const storedUserInfo = localStorage.getItem("userInfo");
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
        if (userInfo) {
            try {
                // Lấy thông tin người dùng từ localStorage

                const response = await axios.get(`http://localhost:8080/api/v1/gio-hang-ct/all?idGioHang=${userInfo.idGioHang}`);
                if (response.data && response.data.data) {
                    set({ cart: response.data.data });
                }
                console.log("Cart data fetched:", response.data.data);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        }
        else {
            try {
                // Lấy thông tin người dùng từ localStorage

                const response = await axios.get(`http://localhost:8080/api/v1/gio-hang-ct/all?idGioHang=1`);
                if (response.data && response.data.data) {
                    set({ cart: response.data.data });
                }
                console.log("Cart data fetched:", response.data.data);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        }
    },

    updateQuantity: async (idSanPhamChiTiet, delta) => {
        const storedUserInfo = localStorage.getItem("userInfo");
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

        if (userInfo) {
            try {

                // Gửi yêu cầu cập nhật số lượng qua API

                const response = await axios.put(
                    `http://localhost:8080/api/v1/gio-hang-ct/update?idSanPhamChiTiet=${idSanPhamChiTiet}&idGioHang=${userInfo.idGioHang}&soLuong=${delta}`
                );

                console.log("Giỏ hàng đã được cập nhật:", response.data);

                // Cập nhật lại trạng thái giỏ hàng trong UI sau khi API phản hồi
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.sanPhamChiTietResponse.id === idSanPhamChiTiet
                            ? { ...item, soLuong: Math.max(item.soLuong + delta, 1) }
                            : item
                    ),
                }));
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
            }
        } else {
            try {

                // Gửi yêu cầu cập nhật số lượng qua API

                const response = await axios.put(
                    `http://localhost:8080/api/v1/gio-hang-ct/update?idSanPhamChiTiet=${idSanPhamChiTiet}&idGioHang=${1}&soLuong=${delta}`
                );

                console.log("Giỏ hàng đã được cập nhật:", response.data);

                // Cập nhật lại trạng thái giỏ hàng trong UI sau khi API phản hồi
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.sanPhamChiTietResponse.id === idSanPhamChiTiet
                            ? { ...item, soLuong: Math.max(item.soLuong + delta, 1) }
                            : item
                    ),
                }));
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
            }
        }
    },

    updateCartPrices: () =>
        set((state) => {
            const currentTime = new Date().getTime();

            return {
                cart: state.cart.map((item) => {
                    const isDiscountActive =
                        item.discountEnd && currentTime < new Date(item.discountEnd).getTime();

                    return {
                        ...item,
                        finalPrice: isDiscountActive ? item.discountPrice : item.price,
                    };
                }),
            };
        }),


    removeFromCart: async (id) => {
        const storedUserInfo = localStorage.getItem("userInfo");
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
        if (userInfo) {

            try {


                // Gọi API để xóa sản phẩm trong database
                await axios.delete(`http://localhost:8080/api/v1/gio-hang-ct/san-pham-chi-tiet/${id}?idGioHang=${userInfo.idGioHang}`); // URL endpoint backend

                // Cập nhật lại state sau khi xóa thành công
                set((state) => ({
                    cart: state.cart.filter((item) => item.sanPhamChiTietResponse.id !== id),
                }));
            } catch (error) {
                console.error("Xóa sản phẩm khỏi giỏ hàng thất bại:", error);
            }
        } else {
            try {


                // Gọi API để xóa sản phẩm trong database
                await axios.delete(`http://localhost:8080/api/v1/gio-hang-ct/san-pham-chi-tiet/${id}?idGioHang=1`); // URL endpoint backend

                // Cập nhật lại state sau khi xóa thành công
                set((state) => ({
                    cart: state.cart.filter((item) => item.sanPhamChiTietResponse.id !== id),
                }));
            } catch (error) {
                console.error("Xóa sản phẩm khỏi giỏ hàng thất bại:", error);
            }
        }
    },

    clearCart: () => set({ cart: [] }),
    getCartTotal: () =>
        state.cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0),
    getCartCount: () => {
        return useCartStore.getState().cart.length;
    },
    // Hàm xóa giỏ hàng của khách vãng lai khi reload trang
    clearGuestCart: () => {
        if (localStorage.getItem('userInfo') === null) {
            // Kiểm tra và xóa giỏ hàng của khách hàng vãng lai (ID = 1)
            axios.delete("http://localhost:8080/api/v1/gio-hang-ct/delete-all?idGioHang=1", {
                
            })
                .then(response => {
                    console.log("Giỏ hàng vãng lai đã được xóa:", response.data);
                })
                .catch(error => {
                    console.error("Lỗi khi xóa giỏ hàng vãng lai:", error);
                });
        }
    },




}));

export default useCartStore;
