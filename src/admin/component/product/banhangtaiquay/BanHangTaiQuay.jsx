import { useState } from "react";
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
} from "antd";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createHoaDon,
  getAllHoaDon,
  getHoaDonById,
} from "../../../../api/HoaDon";
import { toast } from "react-toastify";
import TableSanPhamChiTiet from "../spct/TableSanPhamChiTiet";

const { TabPane } = Tabs;
const { Text } = Typography;

const POS = () => {
  const [loading, setLoading] = useState(false);

  const [invoices, setInvoices] = useState([]);

  const [currentInvoice, setCurrentInvoice] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllHoaDon();
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setInvoices(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNewOrder = async () => {
    try {
      if (invoices.length >= 5) {
        toast.warning("Đã đạt giới hạn 5 hóa đơn! Không thể tạo hóa đơn mới.");
        return;
      }

      await createHoaDon();
      toast.success("Tạo hóa đơn mới thành công !");
      await fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Tạo hóa đơn thất bại !");
    }
  };
  const getOrderById = async (id) => {
    setLoading(true);
    try {
      const res = await getHoaDonById(id);
      if (res && res.data) {
        // Giả sử bạn muốn cập nhật thông tin hóa đơn vào state
        setCurrentInvoice(res.data); // Cập nhật state với thông tin hóa đơn
        console.log(res.data);
        toast.success("Lấy thông tin hóa đơn thành công !");
      } else {
        toast.error("Không tìm thấy hóa đơn.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Lỗi khi lấy thông tin hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa các cột cho bảng hóa đơn
  const invoiceColumns = [
    {
        title: "STT",
        dataIndex: "id"
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: () => <Input type="number" min="0" style={{ width: "80px" }} />,
    },
    {
        title: "Tổng tiền",
        dataIndex: "price",
      },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <MdDelete style={{ fontSize: "20px" }} />
          </Button>
        </div>
      ),
    },
  ];

  // Định nghĩa các cột cho bảng sản phẩm
  const productColumns = [
    {
      title: "STT",
    },
    {
      title: "Tên",
      dataIndex: "productName",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button type="link" onClick={() => handleAddToCart(record)}>
          <FaEdit style={{ fontSize: "20px" }} />
        </Button>
      ),
    },
  ];

  // Dữ liệu mẫu cho các bảng
  const dataSource = [
    {
      key: "1",
      productName: "Sản phẩm 1",
      color: "Đỏ",
      size: "44",
      quantity: "1000",
      price: "100,000",
    },
  ];


  // Hàm xử lý khi xóa một bản ghi
  const handleDelete = (record) => {
    console.log("Delete record:", record);
  };

  // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (record) => {
    console.log("Add to cart:", record);
  };

  // Màu cho tiêu đề
  const invoiceColor = "blue"; // Màu tiêu đề của hóa đơn
  const productColor = "green"; // Màu tiêu đề của sản phẩm
  const paymentColor = "orange"; // Màu tiêu đề của thông tin thanh toán

  return (
    <div className="page-wrapper">
      <div className="body-wrapper">
        <div className="container-fluid">
          <Row gutter={16}>
            <Col span={18}>
              <Card
                title={<span style={{ color: invoiceColor }}>Hóa đơn</span>}
                extra={
                  <Button type="primary" onClick={handleCreateNewOrder}>
                    Tạo hóa đơn
                  </Button>
                }
                style={{
                  borderColor: invoiceColor,
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              >
                <Tabs type="card" defaultActiveKey="1" onChange={getOrderById}>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <TabPane tab={`Hóa đơn ${invoice.key}`} key={invoice.key}>
                        <div>
                          <Button
                            type="primary"
                            style={{ marginBottom: "16px" }}
                          >
                            Làm mới
                          </Button>
                          <Table
                            columns={invoiceColumns}
                            dataSource={[invoice]}
                            pagination={false}
                            bordered
                            loading={loading}
                          />
                          <Pagination
                            style={{ marginTop: "16px" }}
                            total={50}
                            showSizeChanger
                          />
                        </div>
                      </TabPane>
                    ))
                  ) : (
                    <TabPane tab="Hóa đơn" key="1">
                      <Text
                        type="danger"
                        style={{
                          marginTop: "24px",
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        Chưa có hóa đơn nào! Hãy tạo hóa đơn.
                      </Text>
                    </TabPane>
                  )}
                </Tabs>
              </Card>

              <Card
                title={<span style={{ color: productColor }}>Sản phẩm</span>}
                style={{
                  marginTop: "16px",
                  borderColor: productColor,
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              >
                <TableSanPhamChiTiet/>
                {/* <Table
                  columns={productColumns} 
                  dataSource={dataSource} 
                  pagination={false}
                  bordered
                />
                <Pagination
                  style={{ marginTop: "16px" }}
                  total={50}
                  showSizeChanger
                /> */}
              </Card>
            </Col>

            {/* <Col span={6}>
              <Card
                title={
                  <span style={{ color: paymentColor }}>
                    Thông tin thanh toán
                  </span>
                }
                style={{
                  borderColor: paymentColor,
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              >
                <Form layout="vertical">
                  <Form.Item label="Mã hóa đơn :">
                    <Input
                      value="Hóa đơn 1"
                      readOnly
                      style={{ fontWeight: "bold" }}
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng :">
                    <Input placeholder="Nhập tên khách hàng" />
                  </Form.Item>
                  <Form.Item label="Voucher :">
                    <Select
                      defaultValue="Chọn voucher"
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="Voucher 1">Voucher 1</Select.Option>
                      <Select.Option value="Voucher 2">Voucher 2</Select.Option>
                      <Select.Option value="Voucher 3">Voucher 3</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Phương thức thanh toán :">
                    <Select defaultValue="Tiền mặt">
                      <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                      <Select.Option value="Chuyển khoản">
                        Chuyển khoản
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Tổng tiền :">
                    <Input
                      value="1,000,000"
                      readOnly
                      style={{ fontWeight: "bold" }}
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  <Form.Item label="Tiền khách đưa :">
                    <Input
                      placeholder="Nhập số tiền"
                      style={{ fontWeight: "bold" }}
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  <Form.Item label="Tiền giảm :">
                    <Input
                      value="100,000"
                      readOnly
                      style={{ fontWeight: "bold", color: "blue" }}
                    />
                  </Form.Item>
                  <Form.Item label="Thành tiền :">
                    <Input
                      value="900,000"
                      readOnly
                      style={{ fontWeight: "bold", color: "red" }}
                    />
                  </Form.Item>
                  <Form.Item label="Tiền trả lại :">
                    <Input
                      value="100,000"
                      readOnly
                      style={{ fontWeight: "bold", color: "green" }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button type="primary" style={{ width: "45%" }}>
                        <i className="ti-wallet" /> Thanh toán
                      </Button>
                      <Button
                        type="danger"
                        style={{
                          width: "45%",
                          backgroundColor: "red",
                          color: "white",
                        }}
                      >
                        <i className="ti-x" /> Hủy đơn
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Card>
            </Col> */}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default POS;
