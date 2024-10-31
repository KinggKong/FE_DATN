import React from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    Select,
    Table,
    Tabs,
    Pagination,
    Typography,
    Row,
    Col,
} from 'antd';
import { FaEdit } from 'react-icons/fa'; // Import biểu tượng chỉnh sửa
import { MdDelete } from 'react-icons/md'; // Import biểu tượng xóa

const { TabPane } = Tabs;
const { Text } = Typography;

const POS = () => {

   // Định nghĩa các cột cho bảng hóa đơn
    const invoiceColumns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
        },
        {
          title: 'Đơn giá',
          dataIndex: 'price',
      },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: () => <Input type="number" min="0" style={{ width: '80px' }} />,
        },
       
        {
            title: 'Thao tác',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <FaEdit style={{ fontSize: '20px' }} />
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        <MdDelete style={{ fontSize: '20px' }} />
                    </Button>
                </div>
            ),
        },
    ];

    // Định nghĩa các cột cho bảng sản phẩm
    const productColumns = [
        {
            title: 'Tên',
            dataIndex: 'productName',
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Button type="link" onClick={() => handleAddToCart(record)}>
                    <FaEdit style={{ fontSize: '20px' }} />
                </Button>
            ),
        },
    ];

    // Dữ liệu mẫu cho các bảng
    const dataSource = [
        {
            key: '1',
            productName: 'Sản phẩm 1',
            color: 'Đỏ',
            size: '44',
            quantity: '1000',
            price: '100,000',
        },
    ];

     // Hàm xử lý khi chỉnh sửa một bản ghi
    const handleEdit = (record) => {
        console.log("Edit record:", record);
    };

    // Hàm xử lý khi xóa một bản ghi
    const handleDelete = (record) => {
        console.log("Delete record:", record);
    };

     // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (record) => {
        console.log("Add to cart:", record);
    };

    // Màu cho tiêu đề
    const invoiceColor = 'blue'; // Màu tiêu đề của hóa đơn
    const productColor = 'green'; // Màu tiêu đề của sản phẩm
    const paymentColor = 'orange'; // Màu tiêu đề của thông tin thanh toán

    
    return (
        <div className="page-wrapper">
            <div className="body-wrapper">
                <div className="container-fluid">
                    <Row gutter={16}>
                        <Col span={18}>
                            <Card
                                title={<span style={{ color: invoiceColor }}>Hóa đơn</span>}
                                extra={<Button type="primary">Tạo hóa đơn</Button>}
                                style={{ borderColor: invoiceColor, borderWidth: 2, borderStyle: 'solid' }}
                            >
                                <Tabs type="card" defaultActiveKey="1">
                                    <TabPane  tab="Hóa đơn 1" key="1">
                                        <div>
                                            <Button type="primary" style={{ marginBottom: '16px' }}>Làm mới</Button>
                                            <Table
                                                columns={invoiceColumns}
                                                dataSource={dataSource}
                                                pagination={false}
                                                bordered
                                            />
                                            <Pagination style={{ marginTop: '16px' }} total={50} showSizeChanger />
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Hóa đơn 2" key="2">
                                        <Text>Chưa có sản phẩm nào</Text>
                                    </TabPane>
                                </Tabs>
                                <Text type="danger" style={{ marginTop: '24px', display: 'block', textAlign: 'center' }}>
                                    Chưa có hóa đơn nào! Hãy tạo hóa đơn.
                                </Text>
                            </Card>

                            <Card
                                title={<span style={{ color: productColor }}>Sản phẩm</span>}
                                style={{ marginTop: '16px', borderColor: productColor, borderWidth: 2, borderStyle: 'solid' }}
                            >
                                <Table
                                    columns={productColumns} // Các cột sản phẩm
                                    dataSource={dataSource} // Dữ liệu cho bảng sản phẩm
                                    pagination={false} // Không phân trang
                                    bordered
                                />
                                <Pagination style={{ marginTop: '16px' }} total={50} showSizeChanger />
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card
                                title={<span style={{ color: paymentColor }}>Thông tin thanh toán</span>}
                                style={{ borderColor: paymentColor, borderWidth: 2, borderStyle: 'solid' }}
                            >
                                <Form layout="vertical">
                                    <Form.Item label="Mã hóa đơn :">
                                    <Input value="Hóa đơn 1" readOnly style={{ fontWeight: 'bold' }} />
                                    </Form.Item>
                                    <Form.Item label="Khách hàng :">
                                        <Input placeholder="Nhập tên khách hàng" />
                                    </Form.Item>
                                    <Form.Item label="Voucher :">
                                        <Select defaultValue="Chọn voucher" style={{ width: '100%' }}>
                                            <Select.Option value="Voucher 1">Voucher 1</Select.Option>
                                            <Select.Option value="Voucher 2">Voucher 2</Select.Option>
                                            <Select.Option value="Voucher 3">Voucher 3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Phương thức thanh toán :">
                                        <Select defaultValue="Tiền mặt">
                                            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                                            <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Tổng tiền :">
                                    <Input value="1,000,000" readOnly style={{ fontWeight: 'bold' }} addonAfter="VNĐ"/>
                                    </Form.Item>
                                    <Form.Item label="Tiền khách đưa :">
                                        <Input placeholder="Nhập số tiền" style={{ fontWeight: 'bold' }} addonAfter="VNĐ" />
                                    </Form.Item>
                                    <Form.Item label="Tiền giảm :">
                                        <Input value="100,000" readOnly style={{ fontWeight: 'bold', color: 'blue' }}  />
                                    </Form.Item>
                                    <Form.Item label="Thành tiền :">
                                        <Input value="900,000" readOnly style={{ fontWeight: 'bold', color: 'red' }}  />
                                    </Form.Item>
                                    <Form.Item label="Tiền trả lại :">
                                        <Input value="100,000" readOnly style={{ fontWeight: 'bold', color: 'green' }}  />
                                    </Form.Item>
                                    <Form.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Button type="primary" style={{ width: '45%' }}>
                                                <i className="ti-wallet" /> Thanh toán
                                            </Button>
                                            <Button type="danger" style={{ width: '45%', backgroundColor: 'red', color: 'white' }}>
                                                <i className="ti-x" /> Hủy đơn
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default POS;