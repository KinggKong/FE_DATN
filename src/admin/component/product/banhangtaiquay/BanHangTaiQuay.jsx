import React, { useState, useEffect } from 'react';

import { Tabs, Button, Table, Typography, Modal, Input, Select, Space, Card, Pagination } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, PlusCircleOutlined, PayCircleOutlined } from '@ant-design/icons';
import { getAllSanPhamChiTietApi } from '../../../../api/SanPhamChiTietAPI'; // Import API
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';


const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const POS = () => {
    // State quản lý tab đang hoạt động và danh sách đơn hàng
    const [activeTab, setActiveTab] = useState('1');
    const [orders, setOrders] = useState([
        {
            id: 'HD10',
            customer: '',
            voucher: '',
            paymentMethod: 'cash',
            amountPaid: 0,
            change: 0,
            products: [
                { name: 'Sản phẩm A', quantity: 1, price: 100000, total: 100000, color: 'Đỏ', size: '45', image: '' },
            ]
        },
        {
            id: 'HD11',
            customer: '',
            voucher: '',
            paymentMethod: 'cash',
            amountPaid: 0,
            change: 0,
            products: [
                { name: 'Sản phẩm B', quantity: 2, price: 200000, total: 400000, color: 'Xanh', size: '41', image: '' }
            ]
        },
        {
            id: 'HD12',
            customer: '',
            voucher: '',
            paymentMethod: 'cash',
            amountPaid: 0,
            change: 0,
            products: [
                { name: 'Sản phẩm C', quantity: 3, price: 150000, total: 150000, color: 'Vàng', size: '39', image: '' }
            ]
        },
    ]);

    // Cột của bảng sản phẩm trong hóa đơn (có thêm cột hình ảnh và tổng tiền)
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image, record) => (
                <div className="d-flex justify-content-center">
                    <img
                        src={record.image || "https://megafashion.vn/data/product/fmq1695868840.jpg"} // Hình ảnh mặc định nếu không có trong record

                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                        alt={record.name}
                    />
                </div>
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="d-flex" style={{ width: '100%' }}>
                    {/* Thông tin sản phẩm (Tên, Màu sắc, Kích cỡ, Giá tiền) */}
                    <div >
                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Tên: {record.name}</p>
                        <p className="mb-0" style={{ fontWeight: 'bold', color: 'red', marginBottom: '8px' }}>Giá: {record.price.toLocaleString()} VNĐ </p>
                        <p className="mb-0" style={{ fontWeight: '' }}>Màu sắc: {record.color}</p>
                        <p className="mb-0" style={{ color: 'gray' }}>Kích cỡ: {record.size}</p>
                        <p className="mb-0" style={{ color: 'gray' }}>x {record.quantity}</p>

                    </div>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <p className="mb-0" style={{ fontWeight: 'bold' }}>{quantity}</p>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (total) => <p className="mb-0" style={{ fontWeight: 'bold', color: 'red' }}>{total.toLocaleString()} VNĐ</p>,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        primary
                        onClick={() => handleUpdateProduct(record.key)}
                    >
                        <FaEdit className="size-5" />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteProduct(record.key)}
                    >
                        <MdDelete className="size-5" />
                    </Button>
                </Space>
            ),
        },
    ];



    // Hàm tính sản phẩm x số lượng 
    useEffect(() => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => ({
                ...order,
                products: order.products.map((product) => ({
                    ...product,
                    total: product.price * product.quantity,
                })),
            }))
        );
    }, []);


    // State cho modal và thông tin sản phẩm đã chọn
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Cập nhật từ khóa tìm kiếm khi người dùng nhập
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm gọi API để lấy danh sách sản phẩm
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllSanPhamChiTietApi({ pageNumber: 0, pageSize: 20 }); // Ví dụ, lấy trang 0, 20 sản phẩm mỗi trang
            if (res && res.data) {
                setAvailableProducts(res.data.content); // Giả sử API trả về `data.content` chứa sản phẩm
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount lần đầu
    useEffect(() => {
        fetchProducts();
    }, []);

    const productColumns = [
        { title: 'Hình ảnh', dataIndex: 'hinhAnhList', render: (hinhAnhList) => <img src={hinhAnhList && hinhAnhList.length > 0 ? hinhAnhList[0].url : ''} alt="product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} /> },
        { title: 'Tên sản phẩm', dataIndex: 'tenSanPham' },
        { title: 'Màu sắc', dataIndex: 'tenMauSac' },
        { title: 'Kích thước', dataIndex: 'tenKichThuoc' },
        {
            title: 'Đơn giá', dataIndex: 'giaBan', sorter: {
                compare: (a, b) => a.giaBan - b.giaBan,
                multiple: 2,
            },
        },
        {
            title: 'Số lượng', dataIndex: 'soLuong', sorter: {
                compare: (a, b) => a.soLuong - b.soLuong,
                multiple: 3,
            },
        },
        {
            title: 'Thao tác',
            render: (_, product) => (
                <Button type="primary" onClick={() => handleProductSelection(product)}>
                    <ShoppingCartOutlined />
                </Button>
            ),
        },
    ];

    // Hàm thay đổi tab đang chọn
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    // Hàm xóa đơn hàng
    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

    // Hàm mở modal để thêm sản phẩm vào đơn hàng
    const handleAddProduct = () => {
        setModalVisible(true);
    };

    // Hàm đóng modal khi không cần thêm sản phẩm
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // Hàm chọn sản phẩm từ danh sách có sẵn
    const handleProductSelection = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Đặt lại số lượng sản phẩm về mặc định là 1
    };

    // Hàm thay đổi số lượng sản phẩm khi người dùng nhập vào
    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    // Hàm xóa sản phẩm khỏi hóa đơn
    const handleDeleteProduct = (productName) => {

    };

    // Hàm update sản phẩm trong hóa đơn
    const handleUpdateProduct = (product) => {

    };

    // Hàm tạo hóa đơn mới
    const handleCreateInvoice = () => {
        const newOrder = {
            id: `HD${orders.length + 1}`,
            customer: '',
            voucher: '',
            paymentMethod: 'cash',
            amountPaid: 0,
            change: 0,
            products: []
        };
        setOrders([...orders, newOrder]);
        setActiveTab(newOrder.id); // Chuyển sang tab của đơn hàng mới
    };

    // Hàm tính tổng tiền của đơn hàng theo ID
    const calculateTotalAmount = (orderId) => {
        const order = orders.find(order => order.id === orderId);
        return order ? order.products.reduce((total, product) => total + product.total, 0) : 0;
    };

    // Hàm tính tiền thừa trả lại khách hàng
    const calculateChange = (orderId, amountPaid) => {
        const totalAmount = calculateTotalAmount(orderId);
        return amountPaid - totalAmount;
    };

    // Hàm cập nhật thông tin các trường như tên khách hàng, voucher, phương thức thanh toán
    const handleFieldChange = (field, value) => {
        const updatedOrders = [...orders];
        const orderIndex = updatedOrders.findIndex(order => order.id === activeTab);
        if (orderIndex !== -1) {
            updatedOrders[orderIndex][field] = value;
            setOrders(updatedOrders);
        }
    };

    // Hàm thanh toán cho đơn hàng
    const handlePayment = () => {
        const totalAmount = calculateTotalAmount(activeTab);
        const change = calculateChange(activeTab, amountPaid);
        console.log(`Thanh toán thành công với phương thức: ${paymentMethod}`);
        console.log(`Tổng tiền: ${totalAmount} VND`);
        console.log(`Tiền khách đưa: ${amountPaid}`);
        console.log(`Tiền thừa: ${change}`);
    };



    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Tiêu đề và nút tạo hóa đơn */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>Bán hàng tại quầy</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInvoice}>
                    Tạo hóa đơn
                </Button>
            </div>

            {/* Tabs hiển thị danh sách đơn hàng */}
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
                {orders.map((order, index) => (
                    <TabPane
                        tab={(
                            <span>
                                Đơn hàng {index + 1} - {order.id} <ShoppingCartOutlined />
                                {/* Nút xóa đơn hàng */}
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteOrder(order.id)}
                                    style={{ marginLeft: '10px', color: 'red' }}
                                />
                            </span>
                        )}
                        key={order.id}
                    >
                        {/* Phần hiển thị sản phẩm và thông tin thanh toán trong đơn hàng */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* Phần sản phẩm trong hóa đơn */}
                            <Card
                                title="Hóa Đơn Bán Hàng"
                                style={{
                                    marginBottom: '20px',
                                    padding: '20px',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    flex: 3,
                                    marginRight: '20px',
                                }}
                            >
                                <Button icon={<PlusOutlined />} onClick={handleAddProduct}>
                                    THÊM SẢN PHẨM
                                </Button>
                                <Title level={4} style={{ marginTop: '20px' }}>
                                    <ShoppingCartOutlined /> Sản phẩm trong hóa đơn
                                </Title>

                                {/* Kiểm tra nếu đơn hàng không có sản phẩm */}
                                {order.products.length === 0 ? (
                                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                                        <Text strong>Không có sản phẩm nào</Text>
                                    </div>
                                ) : (
                                    <Table
                                        columns={columns}
                                        dataSource={order.products}
                                        style={{ marginTop: '20px' }}
                                        pagination={{
                                            pageSize: 5,
                                            showSizeChanger: true,
                                            total: order.products.length,
                                        }}
                                    />
                                )}
                            </Card>

                            {/* Thông tin thanh toán */}
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                        <span>Thông tin thanh toán: <span style={{ color: 'red' }}>{order.id}</span> </span>
                                    </div>
                                }
                                style={{
                                    padding: '20px',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    flex: 1,
                                }}
                            >
                                {/* Các trường nhập liệu thông tin thanh toán */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Tên khách hàng: </label>
                                    <Input
                                        value={order.customer}
                                        onChange={(e) => handleFieldChange('customer', e.target.value)}
                                        placeholder="Nhập tên khách hàng"
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Mã voucher: </label>
                                    <Input
                                        value={order.voucher}
                                        onChange={(e) => handleFieldChange('voucher', e.target.value)}
                                        placeholder="Nhập mã voucher"
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Hình thức thanh toán: </label>
                                    <Select
                                        value={order.paymentMethod}
                                        onChange={(value) => handleFieldChange('paymentMethod', value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="cash">Tiền mặt</Option>
                                        <Option value="card">Thẻ</Option>
                                        <Option value="online">Thanh toán online</Option>
                                    </Select>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Tiền khách đưa: </label>
                                    <Input
                                        type="number"
                                        value={order.amountPaid}
                                        onChange={(e) => handleFieldChange('amountPaid', Number(e.target.value))}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Tiền thừa: </label>
                                    <Input
                                        value={order.change}
                                        disabled
                                    />
                                </div>
                                <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                                    <label>Tổng tiền: </label>
                                    <Input
                                        value={calculateTotalAmount(order.id)}
                                        disabled
                                    />
                                </div>

                                {/* Nút thanh toán */}
                                <Button
                                    type="primary"
                                    icon={<PayCircleOutlined />}
                                    style={{ marginTop: '25px' }}
                                    onClick={handlePayment}
                                >
                                    Xác Nhận Thanh Toán
                                </Button>
                            </Card>
                        </div>
                    </TabPane>
                ))}
            </Tabs>

            {/* Modal chọn sản phẩm */}
            <Modal
                title="Chọn sản phẩm"
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Input
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px' }}
                />

                <Table
                    columns={productColumns}
                    dataSource={availableProducts.filter(product =>
                        product.tenSanPham.toLowerCase().includes(searchTerm)
                    )}
                    rowKey="id" // Giả sử mỗi sản phẩm có id
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: true,
                        total: availableProducts.length,
                    }}
                    loading={loading}
                    style={{ marginTop: '20px' }}
                />
            </Modal>
        </div>
    );
};

export default POS;
