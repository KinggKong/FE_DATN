import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, Descriptions, Image, Typography, Row, Col, Divider, Spin } from 'antd';
import { CheckCircleFilled, ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OrderConfirmation() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const maHoaDon = new URLSearchParams(location.search).get('maHoaDon');
                if (!maHoaDon) {
                    throw new Error('Mã hóa đơn không tồn tại');
                }

                const response = await axios.get(`http://localhost:8080/api/v1/shop-on/info-order?maHoaDon=${maHoaDon}`);
                if (response.data.code === 1000) {
                    setOrderData(response.data.data);
                } else {
                    throw new Error('Không thể lấy thông tin đơn hàng');
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [location]);

    if (loading) {
        return <Spin size="large" />;
    }

    if (!orderData) {
        return <div>Không tìm thấy thông tin đơn hàng.</div>;
    }

    const { hoaDonResponse, hoaDonChiTietResponse } = orderData;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8 bg-green-50 p-6 rounded-lg shadow-sm">
                <CheckCircleFilled className="text-green-500 text-5xl mb-4" />
                <Title level={2} className="text-green-600 mb-2">Đặt hàng thành công!</Title>
                <Text className="text-gray-600">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.</Text>
            </div>

            <Card className="mb-8 shadow-sm">
                <Descriptions title={<Title level={4}>Thông tin đơn hàng</Title>} bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="Mã đơn hàng" span={3}>
                        <Text strong className="text-blue-600">{hoaDonResponse.maHoaDon}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt hàng">{new Date(hoaDonResponse.createdAt).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Tạm tính">{(hoaDonResponse.tongTien - hoaDonResponse.tienShip).toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Giảm giá">{hoaDonResponse.soTienGiam.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Phí ship">{hoaDonResponse.tienShip.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Tổng thanh toán" span={3}>
                        <Text strong className="text-red-600 text-lg">{hoaDonResponse.tienSauGiam.toLocaleString()}đ</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Row gutter={16}>
                <Col xs={24} lg={16}>
                    <Card 
                        title={<Title level={4}>Danh sách sản phẩm</Title>} 
                        className="mb-8 shadow-sm"
                    >
                        {hoaDonChiTietResponse.map((item) => (
                            <div key={item.id} className="flex items-start space-x-4 py-4">
                                <Image
                                    src={item.sanPhamChiTietResponse.hinhAnhList[0].url}
                                    alt={item.sanPhamChiTietResponse.tenSanPham}
                                    width={100}
                                    height={100}
                                    className="object-cover rounded"
                                />
                                <div className="flex-grow">
                                    <Title level={5} className="mb-2">{item.sanPhamChiTietResponse.tenSanPham}</Title>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <Text>Màu sắc: {item.sanPhamChiTietResponse.tenMauSac}</Text>
                                        <Text>Số lượng: {item.soLuong}</Text>
                                        <Text>Kích thước: {item.sanPhamChiTietResponse.tenKichThuoc}</Text>
                                    </div>
                                    <Text strong className="mt-2 block">Thành tiền: {(item.giaTien * item.soLuong).toLocaleString()}đ</Text>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title={<Title level={4}>Thông tin người nhận</Title>} 
                        className="mb-8 shadow-sm"
                    >
                        <Descriptions column={1} colon={false} layout="vertical">
                            <Descriptions.Item label={<Text strong>Tên khách hàng</Text>}>
                                {hoaDonResponse.tenNguoiNhan}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Text strong>Số điện thoại</Text>}>
                                {hoaDonResponse.sdt}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Text strong>Email</Text>}>
                                {hoaDonResponse.email}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Text strong>Địa chỉ</Text>}>
                                {hoaDonResponse.diaChiNhan}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <div className="text-center">
                <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                    onClick={() => navigate('/')}
                >
                    <ShoppingOutlined className="mr-2" />
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
}