import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Radio, Space, Spin, Image, message, notification, Select } from 'antd';
import { CreditCard, Truck, Tag } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useCartStore from "../cart/useCartStore";

const { TextArea } = Input;
const { Option } = Select;

export default function PreCheckout() {
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [form] = Form.useForm();
    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);
    const [ship, setShip] = useState(0);
    const navigate = useNavigate();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);


    const [loading, setLoading] = useState(true);
    const [provincesLoading, setProvincesLoading] = useState(false);
    const [districtsLoading, setDistrictsLoading] = useState(false);
    const [wardsLoading, setWardsLoading] = useState(false);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const {fetchCart } = useCartStore();


    
    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          console.log('Stored user info:', storedUserInfo);
          console.log('Parsed user info:', parsedUserInfo);
        }
      }, []);


    useEffect(() => {
        const fetchData = async () => {
            const userId = userInfo && userInfo.id ? userInfo.id : 1;
            // if (!userInfo || !userInfo.id) {
            //     console.log('User info not available yet');
            //     return;
            //   }
            setLoading(true)
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/shop-on/confirm?idKhachHang=${userId}`);
                if (response.data.code === 1000) {
                    if (!response.data.data || !response.data.data.gioHangChiTietList || response.data.data.gioHangChiTietList.length === 0) {                    
                        navigate('/');
                        return;
                    }

                    setCheckoutData(response.data.data);                  
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchProvinces();
    }, [userInfo]);

    const fetchProvinces = async () => {
        setProvincesLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/locations/provinces');
            if (response.data.code === 1000) {
                setProvinces(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching provinces:', err);
        }finally{
            setProvincesLoading(false);
        }
    };

    const fetchDistricts = async (provinceCode) => {
        setDistrictsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/locations/districts?provinceCode=${provinceCode}`);
            if (response.data.code === 1000) {
                setDistricts(response.data.data);
                setWards([]);
                form.setFieldsValue({ district: undefined, ward: undefined });
            }
        } catch (err) {
            console.error('Error fetching districts:', err);
        }finally{
            setDistrictsLoading(false);
        }
    };

    const fetchWards = async (districtCode) => {
        setWardsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/locations/wards?districtCode=${districtCode}`);
            if (response.data.code === 1000) {
                setWards(response.data.data);
                form.setFieldsValue({ ward: undefined });
            }
        } catch (err) {
            console.error('Error fetching wards:', err);
        }finally{
            setWardsLoading(false);
        }
    };

    const calculateShippingCost = async (latitude, longitude) => {
        setShippingLoading(true);
        const locations = [
            [ 105.74680306431928,21.037955318097737],
            [longitude, latitude],
        ];
        const requestData = {
            locations: locations,
            metrics: ["distance"],
            units: "km",
        };

        try {
            const response = await axios.post(
                "https://api.openrouteservice.org/v2/matrix/driving-car",
                requestData,
                {
                    headers: {
                        Authorization: "5b3ce3597851110001cf62485b5a6259f66d4725bd2c5d24e7cdc7e1",
                        "Content-Type": "application/json",
                    },
                }
            );

            const distanceKm = response.data.distances[0][1];
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
        } catch (err) {
            console.error('Error calculating shipping cost:', err);
            message.error('Không thể tính phí vận chuyển. Vui lòng thử lại.');
        }finally {
            setShippingLoading(false);
        }
    };

    const handleProvinceChange = (value) => {
        const selectedProvince = provinces.find(province => province.code === value);
        if (selectedProvince) {
            calculateShippingCost(selectedProvince.latitude, selectedProvince.longitude);
        }
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        fetchWards(value);
    };

    const handleSubmit = async (values) => {
        setCheckoutLoading(true);
        try {
            const selectedProvince = provinces.find(province => province.code === values.province);
            const selectedDistrict = districts.find(district => district.code === values.district);
            const selectedWard = wards.find(ward => ward.code === values.ward);

            const hoaDonRequest = {
                idGioHang: values.idGioHang,
                tenNguoiNhan: values.tenNguoiNhan,
                diaChiNhan: `${values.address}, ${selectedWard ? selectedWard.fullName : ''}, ${selectedDistrict ? selectedDistrict.fullName : ''}, ${selectedProvince ? selectedProvince.fullName : ''}`,
                sdt: values.sdt,
                tongTien: checkoutData.totalPrice + ship,
                tienSauGiam: checkoutData.totalPrice + ship, 
                tienShip: ship,
                ghiChu: values.ghiChu,
                email: values.email,
                idKhachHang: values.idKhachHang,
                idVoucher: null, 
                hinhThucThanhToan: paymentMethod,
                soTienGiam: 0
            };

            let response;
            if (paymentMethod === 'VNPAY') {
                response = await axios.post('http://localhost:8080/api/payment/submitOrder', hoaDonRequest);
                if (response.data.code === 1000) {                
                    window.location.href = response.data.data;
                } else {
                    throw new Error('VNPay payment initiation failed');
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
                    throw new Error('Checkout failed');
                }
            }
        } catch (err) {
            message.error('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
            console.log(err);
        }finally {
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
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Tỉnh/Thành phố"
                            name="province"
                            required
                            rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}
                        >
                            <Select size="large" onChange={handleProvinceChange}>
                                {provinces.map(province => (
                                    <Option key={province.code} value={province.code}>{province.fullName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Quận/Huyện"
                            name="district"
                            required
                            rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}
                        >
                            <Select size="large" onChange={handleDistrictChange}>
                                {districts.map(district => (
                                    <Option key={district.code} value={district.code}>{district.fullName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Phường/Xã"
                            name="ward"
                            required
                            rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}
                        >
                            <Select size="large">
                                {wards.map(ward => (
                                    <Option key={ward.code} value={ward.code}>{ward.fullName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ chi tiết"
                            name="address"
                            required
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ email (tùy chọn)"
                            name="email"
                        >
                            <Input size="large" />
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
                            <span className="text-red-500">0₫</span>
                        </div>

                        <div className="flex justify-between font-bold text-lg">
                            <span>Tổng</span>
                            <span>{(totalPrice + ship).toLocaleString()}₫</span>
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
}