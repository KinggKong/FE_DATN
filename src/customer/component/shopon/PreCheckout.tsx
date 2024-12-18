import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Input, Radio, Space, Spin, Image, message, notification, AutoComplete, Select, Tooltip } from 'antd';
import { CreditCard, Truck, Tag } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useCartStore from "../cart/useCartStore";
import debounce from 'lodash/debounce';
import { getKhachHangByIdApi } from '../../../api/KhachHangApi';
import { set } from '@ant-design/plots/es/core/utils';

const { TextArea } = Input;

const PreCheckout = () => {
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [form] = Form.useForm();
    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);
    const [ship, setShip] = useState(0);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const { fetchCart } = useCartStore();

    const [addressOptions, setAddressOptions] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null); // Added state for selected voucher ID

    const apiKey = 'DFt7PndsFeTuDNGggyzQyLr0dzqU9Sf0hb0mMZX5'; // Replace with your Goong API key
    const originLat = 21.038059779392608;
    const originLng = 105.74668196761013;
    const [address, setAddress] = useState(null);


    // const fetchAddressUser = useCallback(async (id) => {
    //     try {
    //         const response = await getKhachHangByIdApi(id);
    //         console.log('Address user:', response.data);
    //         if (response.data.code === 1000) {
    //             setAddress(response.data.data);

    //         } else {
    //             throw new Error('Failed to fetch address user');
    //         }
    //     } catch (err) {
    //         setError('An error occurred while fetching address user');
    //         console.error('Error:', err);
    //     }
    // }, [userInfo]);


    const fetchData = useCallback(async (userId) => {
        setLoading(true);
        try {
            console.log('Fetching data for userId:', userId);
            const response = await axios.get(`http://localhost:8080/api/v1/shop-on/confirm?idKhachHang=${userId}`);
            console.log('Checkout data:', response.data);
            if (response.data.code === 1000) {
                if (!response.data.data || !response.data.data.gioHangChiTietList || response.data.data.gioHangChiTietList.length === 0) {
                    navigate('/');
                    return;
                }
                setCheckoutData(response.data.data);
                if (response.data.data.gioHangChiTietList[0].gioHang.khachHang?.diaChi) {
                    try {
                        // Gọi API để tính phí vận chuyển
                        const response1 = await axios.get(
                            `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
                                response.data.data.gioHangChiTietList[0].gioHang.khachHang.diaChi
                            )}`
                        );

                        if (response1.data.predictions && response1.data.predictions.length > 0) {
                            const placeId = response1.data.predictions[0].place_id;

                            const detailResponse = await axios.get(
                                `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`
                            );

                            if (detailResponse.data.result && detailResponse.data.result.geometry) {
                                const { lat, lng } = detailResponse.data.result.geometry.location;
                                calculateShippingCost(lat, lng); // Gọi hàm tính phí ship
                                setAddress(response.data.data.gioHangChiTietList[0].gioHang.khachHang.diaChi);
                                fetchVouchers(response.data.data.totalPrice + ship);

                            }
                        }
                    } catch (error) {
                        console.error("Error calculating shipping cost:", error);
                        message.error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
                    }
                } else {
                    message.error("Vui lòng chọn địa chỉ khách hàng trước.");
                    setShip(0);

                }
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            console.log('Stored user info:', storedUserInfo);
            console.log('Parsed user info:', parsedUserInfo);

            fetchData(parsedUserInfo?.id);

        } else {
            console.log('No stored user info, using default userId: 1');
            fetchData(1);

        }
    }, [fetchData]);

    const calculateShippingCost = async (lat, lng) => {
        setShippingLoading(true);
        try {
            const distanceResponse = await axios.get(`https://rsapi.goong.io/DistanceMatrix?origins=${originLat},${originLng}&destinations=${lat},${lng}&api_key=${apiKey}`);

            if (distanceResponse.data.rows && distanceResponse.data.rows[0].elements && distanceResponse.data.rows[0].elements[0].distance) {
                const distanceKm = distanceResponse.data.rows[0].elements[0].distance.value / 1000;
                let shippingCost;

                if (distanceKm < 40) {
                    shippingCost = 30000;
                } else if (distanceKm < 100) {
                    shippingCost = 50000;
                } else if (distanceKm < 200) {
                    shippingCost = 60000;
                } else if (distanceKm < 400) {
                    shippingCost = 70000;
                } else {
                    shippingCost = 90000;
                }

                setShip(shippingCost);
                 let totalAmount =0
                if(checkoutData){
                 totalAmount = checkoutData.totalPrice + shippingCost;
                 fetchVouchers(totalAmount);
                }
                
            } else {
                throw new Error('Unable to calculate distance');
            }
        } catch (err) {
            console.error('Error calculating shipping cost:', err);
            message.error('Không thể tính phí vận chuyển. Vui lòng thử lại.');
        } finally {
            setShippingLoading(false);
        }
    };

    const handleAddressSearch = debounce(async (value) => {
        if (value.length > 2) {
            try {
                const response = await axios.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(value)}`);
                if (response.data.predictions) {
                    setAddressOptions(response.data.predictions.map(prediction => ({
                        value: prediction.description,
                        label: prediction.description,
                        place_id: prediction.place_id
                    })));
                }
            } catch (error) {
                console.error('Error fetching address suggestions:', error);
            }
        }
    }, 300);

    const handleAddressSelect = async (value, option) => {
        try {
            const detailResponse = await axios.get(`https://rsapi.goong.io/Place/Detail?place_id=${option.place_id}&api_key=${apiKey}`);
            if (detailResponse.data.result && detailResponse.data.result.geometry) {
                const { lat, lng } = detailResponse.data.result.geometry.location;
                calculateShippingCost(lat, lng);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const fetchVouchers = async (totalAmount) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/vouchers/can-use?tongTien=${totalAmount}`);
            if (response.data.code === 1000) {
                setVouchers(response.data.data);
                console.log("data vourcher",response.data.data)
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    const handleSubmit = async (values) => {
        setCheckoutLoading(true);
        try {
            const selectedVoucher = vouchers.find(v => v.id === values.idVoucher);
            let discountAmount = 0;
    
            if (selectedVoucher) {
                const totalBeforeDiscount = checkoutData.totalPrice + ship;
    
                if (selectedVoucher.hinhThucGiam === 'VNĐ') {
                    discountAmount = selectedVoucher.giaTriGiam;
                } else if (selectedVoucher.hinhThucGiam === '%') {
                    discountAmount = Math.min(
                        (totalBeforeDiscount * selectedVoucher.giaTriGiam) / 100,
                        selectedVoucher.giaTriGiamToiDa
                    );
                }
    
                // Ensure the discount doesn't exceed the total amount
                discountAmount = Math.min(discountAmount, totalBeforeDiscount);
            }
    
            const hoaDonRequest = {
                idGioHang: values.idGioHang,
                tenNguoiNhan: values.tenNguoiNhan,
                diaChiNhan: values.address,
                sdt: values.sdt,
                tongTien: checkoutData.totalPrice + ship,
                tienSauGiam: checkoutData.totalPrice + ship - discountAmount,
                tienShip: ship,
                ghiChu: values.ghiChu,
                email: values.email,
                idKhachHang: values.idKhachHang,
                idVoucher: values.idVoucher,
                hinhThucThanhToan: paymentMethod,
                soTienGiam: discountAmount
            };
    
            let response;
            if (paymentMethod === 'VNPAY') {
                response = await axios.post('http://localhost:8080/api/payment/submitOrder', hoaDonRequest);
                if (response.data.code === 1000) {
                    window.location.href = response.data.data;
                } else {
                    throw new Error(response.data.message || 'VNPay payment initiation failed');
                }
            } else {
                response = await axios.post('http://localhost:8080/api/v1/shop-on/checkout', hoaDonRequest);
                if (response.data.code === 1000) {
                    const maHoaDon = response.data.data.maHoaDon;
                    notification.success({
                        message: "Success",
                        duration: 4,
                        pauseOnHover: false,
                        showProgress: true,
                        description: `Thanh toán thành công đơn hàng!`,
                    });
                    navigate(`/infor-order?maHoaDon=${maHoaDon}`);
                    fetchCart();
                } else {
                    throw new Error(response.data.message || 'Checkout failed');
                }
            }
        } catch (err) {
            // Lấy thông tin lỗi từ API
            const errorMessage =
                err.response?.data?.message || // Thông báo lỗi từ server
                err.message || // Thông báo lỗi từ client
                'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.'; // Thông báo mặc định nếu không có thông tin lỗi
            message.error(errorMessage);
            console.log('Error details:', err);
        } finally {
            setCheckoutLoading(false);
        }
    };
    

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const { gioHangChiTietList, totalPrice } = checkoutData;

    return (
        <Spin spinning={checkoutLoading} tip="Loading...">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">THÔNG TIN THANH TOÁN</h2>
                        <Form
                            form={form}
                            layout="vertical"
                            className="space-y-4"
                            initialValues={{
                                tenNguoiNhan: checkoutData.gioHangChiTietList[0].gioHang.khachHang.ten,
                                sdt: checkoutData.gioHangChiTietList[0].gioHang.khachHang.sdt,
                                idKhachHang: checkoutData.gioHangChiTietList[0].gioHang.khachHang.id,
                                email: checkoutData.gioHangChiTietList[0].gioHang.khachHang.email,
                                idGioHang: checkoutData.idGioHang,
                                address: address,
                            }}
                            onFinish={handleSubmit}
                        >
                            <Form.Item name="idGioHang" hidden>
                                <Input type="hidden" />
                            </Form.Item>
                            <Form.Item name="idKhachHang" hidden>
                                <Input type="hidden" />
                            </Form.Item>
                            <Form.Item
                                label="Tên"
                                name="tenNguoiNhan"
                                required
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="sdt"
                                required
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    {
                                        pattern: /^(0|\+84)[3-9][0-9]{8}$/,
                                        message: 'Số điện thoại không đúng định dạng!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                required
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <AutoComplete
                                    
                                    options={addressOptions}
                                    onSearch={handleAddressSearch}
                                    onSelect={handleAddressSelect}
                                    placeholder="Nhập địa chỉ"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ email"
                                name="email"
                                required
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ email' },
                                    {
                                        type: 'email',
                                        message: 'Địa chỉ email không đúng định dạng!'
                                    },
                                ]}
                            >
                                <Input size="large" placeholder="Nhập địa chỉ email" />
                            </Form.Item>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">THÔNG TIN BỔ SUNG</h3>
                                <Form.Item
                                    label="Ghi chú đơn hàng (tùy chọn)"
                                    name="ghiChu"
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item name="idVoucher" label="Chọn voucher">
                                <Select
                                    placeholder="Chọn voucher"
                                    options={[
                                        { value: null, label: 'Không sử dụng voucher' },
                                        ...vouchers.map(v => ({
                                            value: v.id,
                                            label: (
                                                <Tooltip title={`${v.tenVoucher} - Giảm ${v.giaTriGiam}${v.hinhThucGiam === 'VNĐ' ? 'đ' : '%'} - Đơn tối thiểu ${v.giaTriDonHangToiThieu.toLocaleString()}đ`}>
                                                    <span>
                                                        {v.tenVoucher} - Giảm {v.giaTriGiam}{v.hinhThucGiam === 'VNĐ' ? 'đ' : '%'}
                                                        {v.hinhThucGiam === '%' ? ` (tối đa ${v.giaTriGiamToiDa.toLocaleString()}đ)` : ''}
                                                    </span>
                                                </Tooltip>
                                            )
                                        }))]}
                                    onChange={(value) => setSelectedVoucherId(value)}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h2 className="text-2xl font-semibold">ĐƠN HÀNG CỦA BẠN</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between pb-4 border-b">
                                <span className="font-medium">SẢN PHẨM</span>
                                <span className="font-medium">TẠM TÍNH</span>
                            </div>

                            {gioHangChiTietList.map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 py-4 border-b">
                                    <Image
                                        src={item.sanPhamChiTietResponse.hinhAnhList[0].url}
                                        alt={item.sanPhamChiTietResponse.tenSanPham}
                                        width={80}
                                        height={80}
                                        className="object-cover rounded"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{item.sanPhamChiTietResponse.tenSanPham}</h3>
                                        <p className="text-sm text-gray-600">
                                            Màu: {item.sanPhamChiTietResponse.tenMauSac},
                                            Kích cỡ: {item.sanPhamChiTietResponse.tenKichThuoc}
                                        </p>
                                        <p className="text-sm">Số lượng: {item.soLuong}</p>
                                    </div>
                                    <span className="font-semibold">
                                        {(item.giaTien * item.soLuong).toLocaleString()}₫
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center py-4 border-b">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    <span>Phí vận chuyển</span>
                                </div>
                                <span>{ship.toLocaleString()}₫</span>
                            </div>

                            <div className="flex justify-between items-center py-4 border-b">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    <span>Giảm giá</span>
                                </div>
                                <span className="text-red-500">
                                    {(() => {
                                        const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId); // Use selectedVoucherId
                                        if (!selectedVoucher) return '0₫';

                                        let discountAmount = 0;
                                        const totalBeforeDiscount = totalPrice + ship;

                                        if (selectedVoucher.hinhThucGiam === 'VNĐ') {
                                            discountAmount = selectedVoucher.giaTriGiam;
                                        } else if (selectedVoucher.hinhThucGiam === '%') {
                                            discountAmount = Math.min(
                                                (totalBeforeDiscount * selectedVoucher.giaTriGiam) / 100,
                                                selectedVoucher.giaTriGiamToiDa
                                            );
                                        }

                                        discountAmount = Math.min(discountAmount, totalBeforeDiscount);
                                        return `${discountAmount.toLocaleString()}₫`;
                                    })()}
                                </span>
                            </div>

                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng</span>
                                <span>
                                    {(() => {
                                        const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId); // Use selectedVoucherId
                                        let discountAmount = 0;
                                        const totalBeforeDiscount = totalPrice + ship;

                                        if (selectedVoucher) {
                                            if (selectedVoucher.hinhThucGiam === 'VNĐ') {
                                                discountAmount = selectedVoucher.giaTriGiam;
                                            } else if (selectedVoucher.hinhThucGiam === '%') {
                                                discountAmount = Math.min(
                                                    (totalBeforeDiscount * selectedVoucher.giaTriGiam) / 100,
                                                    selectedVoucher.giaTriGiamToiDa
                                                );
                                            }
                                            discountAmount = Math.min(discountAmount, totalBeforeDiscount);
                                        }

                                        const finalTotal = totalBeforeDiscount - discountAmount;
                                        return `${finalTotal.toLocaleString()}₫`;
                                    })()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Phương thức thanh toán</h3>
                                <Radio.Group
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    className="space-y-4"
                                >
                                    <Space direction="vertical">
                                        <Radio value="COD">
                                            Trả tiền mặt khi nhận hàng
                                        </Radio>
                                        <Radio value="VNPAY">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5" />
                                                Thanh toán VNPay
                                            </div>
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </div>

                            <button
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => form.submit()}
                                disabled={checkoutLoading}
                            >
                                ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default PreCheckout;

