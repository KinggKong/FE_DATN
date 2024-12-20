import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, Tabs, Badge, Button, Dropdown, Space, Menu, message, Modal, notification } from 'antd';
import { SearchOutlined, CalendarOutlined, MoreOutlined, FileTextOutlined, TruckOutlined,PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

export default function OrderManagement() {
    const [selectedTab, setSelectedTab] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [keywordSearch, setKeywordSearch] = useState('');

     useEffect(() => {
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
                console.log('Stored user info:', storedUserInfo);
                console.log('Parsed user info:', parsedUserInfo);
               
            } else {
                console.log('No stored user info, using default userId: 1');
             
            }
        }, []);

    const handleGenerateInvoice = async (orderCode) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/invoice/generate?maHoaDon=${orderCode}`, {
                responseType: 'blob',
            });
            
          
            const file = new Blob([response.data], { type: 'application/pdf' });
            
            
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `invoice-${orderCode}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            notification.success({
                message: "Thành công",
                description: `Đã tạo hóa đơn cho đơn hàng ${orderCode}`,
                duration: 4,
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error generating invoice:', error);
            notification.error({
                message: "Lỗi",
                description: `Không thể tạo hóa đơn: ${error.message}`,
                duration: 4,
                placement: 'topRight',
            });
        }
    };

    const statusMap = {
        'all': '',
        'waiting': 'WAITING',
        'accepted': 'ACCEPTED',
        'shipping': 'SHIPPING',
        'completed': 'DONE',
        'cancelled': 'CANCELLED'
    };

    const statusConfig = {
        'WAITING': {
            title: 'Chờ xác nhận',
            nextAction: 'Xác nhận',
            nextStatus: 'ACCEPTED'
        },
        'ACCEPTED': {
            title: 'Đã xác nhận',
            nextAction: 'Giao hàng',
            nextStatus: 'SHIPPING'
        },
        'SHIPPING': {
            title: 'Đang giao hàng',
            nextAction: 'Hoàn thành',
            nextStatus: 'DONE'
        },
        'DONE': {
            title: 'Hoàn thành',
            nextAction: null,
            nextStatus: null
        },
        'CANCELLED': {
            title: 'Đã hủy',
            nextAction: null,
            nextStatus: null
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedTab, searchText, dateRange, pagination.current, pagination.pageSize,keywordSearch]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const status = statusMap[selectedTab];
            let url = `http://localhost:8080/api/v1/shop-on/order-management?trangThai=${status}`;
            if (searchText) {
                url += `&search=${searchText}`;
            }
            if (dateRange) {
                url += `&startDate=${dateRange[0].format('YYYY-MM-DD')}&endDate=${dateRange[1].format('YYYY-MM-DD')}`;
            }
            if (keywordSearch) { 
                url += `&keySearch=${keywordSearch}`; 
            }
            url += `&page=${pagination.current - 1}&size=${pagination.pageSize}`;

            const response = await axios.get(url);
            if (response.data.code === 1000) {
                const formattedOrders = response.data.data.map((order, index) => ({
                    key: order.id.toString(),
                    orderCode: order.maHoaDon,
                    customer: order.tenNguoiNhan,
                    phone: order.sdt,
                    total: order.tienSauGiam==0?order.tongTien:order.tienSauGiam,
                    type: order.loaiHoaDon,
                    createdAt: new Date(order.createdAt).toLocaleString(),
                    status: order.trangThai
                }));
                setOrders(formattedOrders);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.totalElements || formattedOrders.length
                }));
            } else {
                throw new Error(response.data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            notification.error({
                message: "Success",
                duration: 4,
                pauseOnHover: false,
                showProgress: true,
                description:'Không thể tải danh sách đơn hàng: ' + error.message,
              });
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        { key: 'all', label: 'Tất cả' },
        { key: 'waiting', label: <Badge count={orders.filter(o => o.status === 'WAITING').length}>Chờ xác nhận</Badge> },
        { key: 'accepted', label: <Badge count={orders.filter(o => o.status === 'ACCEPTED').length}>Đã xác nhận</Badge> },
        { key: 'shipping', label: <Badge count={orders.filter(o => o.status === 'SHIPPING').length}>Đang giao</Badge> },
        { key: 'completed', label: <Badge count={orders.filter(o => o.status === 'DONE').length}>Hoàn thành</Badge> },
        { key: 'cancelled', label: <Badge count={orders.filter(o => o.status === 'CANCELLED').length}>Đã hủy</Badge> }
    ];

    const showModal = (record) => {
        setSelectedOrder(record);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        try {
            const nextStatus = statusConfig[selectedOrder.status].nextStatus;
            const response = await axios.post('http://localhost:8080/api/v1/shop-on/update-status-bill', {
                idNhanvien: userInfo?.id, 
                idHoaDon: selectedOrder.key,
                status: nextStatus
            });
    
            if (response.data.code === 1000) {
                notification.success({
                    message: "Success",
                    duration: 4,
                    pauseOnHover: false,
                    showProgress: true,
                    description: `Cập nhật trạng thái đơn hàng thành công`,
                });
                fetchOrders(); 
            } else {
                // Nếu API trả về lỗi nhưng không ném exception
                const errorMessage = response.data.message || 'Lỗi không xác định từ server';
                throw new Error(errorMessage);
            }
        } catch (error) {
            // Lấy thông báo lỗi từ API hoặc mặc định
            const errorMessage =
                error.response?.data?.message || // Thông báo từ server
                error.message || // Thông báo lỗi từ client
                'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.'; // Thông báo mặc định
    
            // Hiển thị thông báo lỗi
            message.error(`Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`);
            console.error('Error details:', error); // Log lỗi chi tiết để debug
        }
    };
    

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const actionMenu = (record) => (
        <Menu>
            <Menu.Item key="view" icon={<FileTextOutlined />} onClick={() => navigate(`/admin/order-detail/${record.key}`)}>
                Xem chi tiết
            </Menu.Item>
            {/* <Menu.Item key="update" icon={<TruckOutlined />} onClick={() => showModal(record)}>
                Cập nhật trạng thái
            </Menu.Item>         */}
              {record.status !== 'DONE' && record.status !== 'CANCELLED' && (
                <Menu.Item key="update" icon={<TruckOutlined />} onClick={() => showModal(record)}>
                    Cập nhật trạng thái
                </Menu.Item>
            )}
        </Menu>
    );

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 70
        },
        {
            title: 'Mã',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text) => <span className="text-blue-600 font-medium">{text}</span>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer'
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (amount) => <span className="text-red-600">{amount.toLocaleString()} đ</span>
        },
        {
            title: 'Loại đơn hàng',
            dataIndex: 'type',
            key: 'type',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={`font-medium ${status === 'CANCELLED' ? 'text-red-600' : status === 'DONE' ? 'text-green-600' : 'text-blue-600'}`}>
                    {statusConfig[status].title}
                </span>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Dropdown overlay={actionMenu(record)} trigger={['click']}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                    {/* <Button icon={<FileTextOutlined />} className="text-blue-600" onClick={() => navigate(`/admin/order-detail/${record.key}`)} /> */}

                    {record.status === 'DONE' && (
                        <Button 
                            icon={<PrinterOutlined />} 
                            className="text-green-600" 
                            onClick={() => handleGenerateInvoice(record.orderCode)}
                        >
                            Xuất hóa đơn
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleTabChange = (key) => {
        setSelectedTab(key);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Danh sách hóa đơn</h1>
            
            <div className="mb-6 flex flex-col lg:flex-row gap-4">
                <Input
                    placeholder="Tìm kiếm theo mã hóa đơn, tên khách hàng, số điện thoại..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    className="flex-grow"
                />
                <RangePicker
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onChange={handleDateRangeChange}
                    suffixIcon={<CalendarOutlined />}
                    className="w-full lg:w-auto"
                />
            </div>

            <Tabs
                items={tabItems}
                activeKey={selectedTab}
                onChange={handleTabChange}
                className="mb-6"
            />

            <Table
                columns={columns}
                dataSource={orders}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn hàng`
                }}
                onChange={handleTableChange}
                loading={loading}
                className="bg-white rounded-lg shadow"
            />

            <Modal
                title="Cập nhật trạng thái đơn hàng"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {selectedOrder && (
                    <p>Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng {selectedOrder.orderCode} thành "{statusConfig[selectedOrder.status].nextAction}"?</p>
                )}
            </Modal>
        </div>
    );
}