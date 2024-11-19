import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Input,
  Table,
  Tabs,
  Pagination,
  Typography,
  Row,
  Col,
  Modal,
  InputNumber,
} from "antd";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createHoaDon,
  getAllHoaDon,
  getHoaDonById,
} from "../../../../api/HoaDon";
import {
  getAllHdctByIdHoaDon,
  deleteHdctById,
  createHoaDonChiTiet,
} from "../../../../api/HoaDonChiTiet";
import { toast } from "react-toastify";
import { getAllSanPhamChiTietApi } from "../../../../api/SanPhamChiTietAPI";

const { TabPane } = Tabs;
const { Text } = Typography;

const POS = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await addSpctToHoaDon();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnhList",
      render: (hinhAnhList) => {
        if (hinhAnhList && hinhAnhList.length > 0) {
          return (
            <img
              src={hinhAnhList[0].url}
              alt="Hình ảnh sản phẩm"
              style={{ height: "100px", width: "auto" }}
            />
          );
        }
        return <span>Không có hình ảnh</span>;
      },
    },
    {
      title: "Tên màu",
      dataIndex: "tenMauSac",
    },
    {
      title: "Tên kích thước",
      dataIndex: "tenKichThuoc",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      sorter: {
        compare: (a, b) => a.soLuong - b.soLuong,
        multiple: 3,
      },
    },
    {
      title: "Giá ",
      dataIndex: "giaBan",
      sorter: {
        compare: (a, b) => a.giaBan - b.giaBan,
        multiple: 2,
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div>
          <Button type="link" danger onClick={showModal}>
            <FaEdit style={{ fontSize: "20px" }} />
          </Button>
        </div>
      ),
    },
  ];

  const fetchDataSpct = useCallback(async () => {
    const params = { pageNumber: currentPage - 1, pageSize };
    try {
      const res = await getAllSanPhamChiTietApi(params);
      if (res?.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setSanPhamChiTiet(dataWithKey);
        setTotalItems(res.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchDataSpct();
  }, [fetchDataSpct]);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

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

  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await getHoaDonById(id);
      if (res && res.data) {
        setCurrentInvoice(res.data);
        const details = await getAllHdctByIdHoaDon(id);
        if (details && details.data) {
          setInvoiceDetails(details.data); // Đảm bảo truy cập đúng đường dẫn
          console.log(details.data);
        } else {
          toast.error("Không tìm thấy chi tiết hóa đơn.");
        }
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
  }, []);

  // Định nghĩa các cột cho bảng hóa đơn
  const invoiceColumns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1, // Sử dụng chỉ số của hàng + 1 để tính STT
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPhamChiTiet",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      render: (text) => (
        <Input type="number" min="0" value={text} style={{ width: "80px" }} />
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            <MdDelete style={{ fontSize: "20px" }} />
          </Button>
        </div>
      ),
    },
  ];

  // Hàm xử lý khi xóa một bản ghi
  const handleDelete = async (id) => {
    console.log("Delete record:", id);
    await deleteHdctById(id);
    setInvoiceDetails((prevDetails) =>
      prevDetails.filter((record) => record.id !== id)
    );
    await fetchDataSpct();
  };

  //demo

  const [selectedSpct, setSelectedSpct] = useState(null);

  // Set selectedSpct when a user selects a product
  const handleProductSelect = (product) => {
    setSelectedSpct(product);
  };

  const addSpctToHoaDon = async () => {
    if (!currentInvoice) {
      toast.warning("Vui lòng chọn hóa đơn !");
      return;
    }
    if (!selectedSpct) {
      toast.warning("Vui lòng chọn sản phẩm !");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        idHoaDon: currentInvoice.id,
        idSanPhamChiTiet: selectedSpct.id,
        soLuong: quantity,
      };
      await createHoaDonChiTiet(payload);
      await fetchDataSpct();
      await getOrderById(currentInvoice.id)
      toast.success("Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm sản phẩm vào hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Màu cho tiêu đề
  const invoiceColor = "blue"; // Màu tiêu đề của hóa đơn
  const productColor = "green"; // Màu tiêu đề của sản phẩm
  //   const paymentColor = "orange"; // Màu tiêu đề của thông tin thanh toán

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
                            dataSource={invoiceDetails}
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
                <Table
                  columns={columns}
                  dataSource={sanPhamChiTiet}
                  onChange={onChange}
                  pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalItems,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    onChange: handlePageChange,
                  }}
                  onRow={(record) => ({
                    onClick: () => handleProductSelect(record),
                  })}
                />
              </Card>
            </Col>
            <Modal
              title="Số lượng sản phẩm"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <InputNumber
                min={1}
                defaultValue={1}
                onChange={(value) => setQuantity(value)}
              />
            </Modal>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default POS;
