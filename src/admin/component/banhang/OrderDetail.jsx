import React, { useState, useEffect } from 'react';
import { Steps, Card, Descriptions, Button, message, Typography, Breadcrumb, Modal, notification } from 'antd';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    CarOutlined, 
    FileProtectOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderDetail = () => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nextStatus, setNextStatus] = useState(null);
    const { id } = useParams();

    const statusSteps = {
        'WAITING': 0,
        'ACCEPTED': 1,
        'SHIPPING': 2,
        'DONE': 3,
        'CANCELLED': 4
    };

    const statusConfig = {
        'WAITING': {
            title: 'Chờ xác nhận',
            nextAction: 'Xác nhận',
            nextStatus: 'ACCEPTED',
            showCancel: true,
            icon: <ClockCircleOutlined />
        },
        'ACCEPTED': {
            title: 'Đã xác nhận',
            nextAction: 'Giao hàng',
            nextStatus: 'SHIPPING',
            showCancel: true,
            icon: <FileProtectOutlined />
        },
        'SHIPPING': {
            title: 'Đang giao hàng',
            nextAction: 'Hoàn thành',
            nextStatus: 'DONE',
            showCancel: false,
            icon: <CarOutlined />
        },
        'DONE': {
            title: 'Hoàn thành',
            nextAction: null,
            nextStatus: null,
            showCancel: false,
            icon: <CheckCircleOutlined />
        },
        'CANCELLED': {
            title: 'Đã hủy',
            nextAction: null,
            nextStatus: null,
            showCancel: false,
            icon: <CloseCircleOutlined />
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/shop-on/detail-history-bill/${id}`);
            if (response.data.code === 1000) {
                setOrderData(response.data.data);
                const currentStatus = response.data.data.lichSuHoaDonResponses.length > 0
                    ? response.data.data.lichSuHoaDonResponses[response.data.data.lichSuHoaDonResponses.length - 1].trangThai
                    : response.data.data.hoaDonResponse.trangThai;
                setCurrentStatus(currentStatus);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error('Không thể tải thông tin đơn hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const showModal = (status) => {
        setNextStatus(status);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        try {
            const response = await axios.post('http://localhost:8080/api/v1/shop-on/update-status-bill', {
                idNhanvien: 1,
                idHoaDon: orderData.hoaDonResponse.id,
                status: nextStatus
            });
            if (response.data.code === 1000) {             
                notification.success({
                    message: "Success",
                    duration: 4,
                    pauseOnHover: false,
                    showProgress: true,
                    description: `Cập nhật trạng thái đơn hàng thành công!`,
                  });
                setCurrentStatus(nextStatus);
                fetchOrderDetail(); 
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error('Không thể cập nhật trạng thái đơn hàng: ' + error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading || !orderData) {
        return <div>Loading...</div>;
    }

    const { hoaDonResponse, lichSuHoaDonResponses } = orderData;
    const currentConfig = statusConfig[currentStatus];

    const items = Object.entries(statusSteps).map(([status, step]) => {
        const historyItem = lichSuHoaDonResponses.find(item => item.trangThai === status);
        return {
            title: statusConfig[status].title,
            icon: statusConfig[status].icon,
            description: historyItem ? (
                <Text type="secondary" className="text-xs">
                    {new Date(historyItem.createdAt).toLocaleString()}
                </Text>
            ) : null
        };
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Breadcrumb className="mb-6">
                <Breadcrumb.Item>
                    <Link to="/admin/order-management">Danh sách hóa đơn</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Hóa đơn {hoaDonResponse.maHoaDon}</Breadcrumb.Item>
            </Breadcrumb>

            <Card className="mb-6">
                <Steps
                    current={statusSteps[currentStatus]}
                    items={items}
                    status={currentStatus === 'CANCELLED' ? 'error' : 'process'}
                />
            </Card>

            <div className="flex justify-between mb-6">
                {currentConfig.showCancel && (
                    <Button danger onClick={() => showModal('CANCELLED')}>
                        Hủy
                    </Button>
                )}
                {currentConfig.nextAction && (
                    <Button type="primary" className="bg-blue-500" onClick={() => showModal(currentConfig.nextStatus)}>
                        {currentConfig.nextAction}
                    </Button>
                )}
            </div>

            <Card title="THÔNG TIN ĐƠN HÀNG" className="mb-6">
                <Descriptions column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Trạng thái">
                        <span className="text-red-600">{currentConfig.title}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã đơn hàng">
                        <span className="text-blue-600">{hoaDonResponse.maHoaDon}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại đơn hàng">{hoaDonResponse.loaiHoaDon}</Descriptions.Item>
                    <Descriptions.Item label="Phí vận chuyển">{hoaDonResponse.tienShip.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">{hoaDonResponse.tongTien.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Giảm giá">{hoaDonResponse.soTienGiam.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Phải thanh toán">
                        <span className="text-red-600 font-bold">{hoaDonResponse.tienSauGiam.toLocaleString()}đ</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Hình thức thanh toán">{hoaDonResponse.hinhThucThanhToan}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="THÔNG TIN KHÁCH HÀNG">
                <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Tên khách hàng">{hoaDonResponse.tenNguoiNhan}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{hoaDonResponse.sdt}</Descriptions.Item>
                    <Descriptions.Item label="Email">{hoaDonResponse.email}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{hoaDonResponse.diaChiNhan}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{hoaDonResponse.ghiChu}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal
                title="Xác nhận thay đổi trạng thái"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "{statusConfig[nextStatus]?.title}"?</p>
            </Modal>
        </div>
    );
};

export default OrderDetail;