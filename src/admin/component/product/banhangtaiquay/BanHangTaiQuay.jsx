import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IoQrCodeSharp } from "react-icons/io5";
import { Option } from "antd/es/mentions";
// import Title from "antd/es/skeleton/Title";//
import { FaBagShopping } from "react-icons/fa6";
import { MdDelete, MdOutlinePayment } from "react-icons/md";
import axios from "axios";
import {
  createHoaDon,
  getAllHoaDon,
  getHoaDonById,
  confirmPayment,
  addCustomerToInvoice,
} from "../../../../api/HoaDon";
import {
  getAllHdctByIdHoaDon,
  deleteHdctById,
  createHoaDonChiTiet,
} from "../../../../api/HoaDonChiTiet";
import { toast } from "react-toastify";
import { getAllSanPhamChiTietApi } from "../../../../api/SanPhamChiTietAPI";
import TabPane from "antd/es/tabs/TabPane";
import { getAllKhachHang } from "../../../../api/KhachHang";
import axiosClient from "../../../../api/axiosClient";

const ShoppingCart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleQR, setIsModalVisibleQR] = useState(false);
  const { Title, Text } = Typography;
  const [isShow, setIsShow] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const [form] = Form.useForm();
  const API_HOST = "https://provinces.open-api.vn/api/";
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isShowModalKhachHang, setIsShowModalKhachHang] = useState(false);
  const [hoaDonChiTiet, setHoaDonChiTiet] = useState(null);
  const [lichSuThanhToan, setLichSuThanhToan] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState(null);
  // const [modalPaymentAmount, setModalPaymentAmount] = useState(0);

  const handleButtonClick = async (method) => {
    setSelectedMethod(method);
    // await createLSTT();
  };

  const createLSTT = async () => {
    const payload = {
      maGiaoDich: null,
      soTien: currentInvoice?.tongTien,
      phuongThucThanhToan: selectedMethod,
      hoaDonId: currentInvoice?.id,
    };

    try {
      const response = await axiosClient.post(
        "/api/v1/lichSuThanhToan",
        payload
      );
      if (response.data) {
        console.log(
          "Lịch sử thanh toán đã được tạo thành công:",
          response.data
        );
        // Xử lý kết quả ở đây (có thể hiển thị thông báo thành công hoặc cập nhật state)
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch sử thanh toán:", error);
      // Xử lý lỗi (có thể hiển thị thông báo lỗi cho người dùng)
    }
  };

  // Xử lý thay đổi số tiền thanh toán
  const handlePaymentAmountChange = (e) => {
    setModalPaymentAmount(Number(e.target.value));
  };

  const selectCustomer = (payload) => {
    setCurrentCustomer(payload);
  };

  const showModalKhachHang = () => {
    setIsShowModalKhachHang(true);
  };

  const cancelModalKhachHang = () => {
    setIsShowModalKhachHang(false);
  };

  const handleOkKhachHang = async () => {
    // await addKhachHangToInvoice(currentInvoice.id, currentCustomer?.id);
    // setIsShowModalKhachHang(false);
    if (currentInvoice && currentCustomer) {
      await addKhachHangToInvoice(currentInvoice.id, currentCustomer.id);
      setIsShowModalKhachHang(false);
    }
  };

  const addKhachHangToInvoice = async (idHoaDon, idKhachHang) => {
    await addCustomerToInvoice(idHoaDon, idKhachHang);
    await getOrderById(idHoaDon);
  };

  const fetchDataKhachHang = async () => {
    setLoading(true);
    try {
      const res = await getAllKhachHang();
      console.log(res); // Kiểm tra kết quả trả về từ API

      // Kiểm tra dữ liệu trả về
      if (res?.data && Array.isArray(res.data)) {
        const dataWithKey = res.data.map((item) => ({
          ...item,
          key: item.id, // Thêm 'key' cho mỗi item để React có thể nhận diện các hàng
        }));
        setCustomer(dataWithKey);
      } else {
        console.error(
          "Dữ liệu không đúng định dạng hoặc không có content:",
          res
        );
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataKhachHang();
  }, []);

  const showModalAddSPCT = () => {
    setIsModalOpen(true);
  };

  const handleOkAddSPCT = async () => {
    await addSpctToHoaDon();
    setIsModalOpen(false);
  };

  // const handleButtonClick = (method) => {
  //   setSelectedMethod(method);
  // };
  useEffect(() => {
    axios.get(`${API_HOST}?depth=1`).then((response) => {
      setProvinces(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`${API_HOST}p/${selectedProvince}?depth=2`).then((response) => {
        setDistricts(response.data.districts);
      });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`${API_HOST}d/${selectedDistrict}?depth=2`).then((response) => {
        setWards(response.data.wards);
      });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
  };

  const handleWardChange = (value) => {
    setSelectedWard(value);
  };

  const showModal = () => {
    setIsShow(true);
  };

  const handleOk = () => {
    setIsShow(false);
  };

  const handleCancelAddSPCT = () => {
    setIsShow(false);
  };

  const handleXacNhanThanhToan = async (id) => {
   
    if (currentInvoice.tongTien === null) {
      toast.warning("Thanh toán thất bại vui lòng chọn sản phẩm !");
      return Promise.reject("Tổng tiền bằng 0");
    }
    

    try {
      if(modalPaymentAmount < currentInvoice?.tongTien){
        toast.warning("Vui lòng thành toán đơn hàng !");
      }else{
      await confirmPayment(id);
      await fetchData();
      toast.success("Thanh toán thành công !");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
      return Promise.reject(error); // Trả về lỗi nếu có
    }
  };

  const confirm = () => {
    modal.confirm({
      title: "Xác nhận thanh toán",
      icon: <ExclamationCircleOutlined />,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        return handleXacNhanThanhToan(currentInvoice.id); // Trả về Promise từ hàm xử lý
      },
    });
  };

  const [shipping, setShipping] = useState(false);
  const [partialPayment, setPartialPayment] = useState(0);
  const [modalPaymentAmount, setModalPaymentAmount] = useState(0);
  const showModalThanhToan = () => setIsModalVisible(true);
  const handleCancelThanhToan = () => setIsModalVisible(false);
  const handleOkThanhToan = () => {
    setPartialPayment(currentInvoice?.tongTien);
    console.log(modalPaymentAmount);

    setIsModalVisible(false);
  };

  const columnsSPCT = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="Product" style={{ width: 50 }} />,
    },
    { title: "Tên Sản Phẩm", dataIndex: "tenSanPham", key: "name" },
    {
      title: "Giá Bán",
      dataIndex: "giaBan",
      key: "price",
      render: (price) => `${price} VND`,
    },
    { title: "Số Lượng", dataIndex: "soLuong", key: "quantity" },
    { title: "Kích Thước", dataIndex: "tenKichThuoc", key: "size" },
    {
      title: "Màu Sắc",
      dataIndex: "tenMauSac",
      key: "color",
      render: (color) => <Tag color="red">{color}</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button type="primary" onClick={showModalAddSPCT}>
          Chọn
        </Button>
      ),
    },
  ];

  const columnsKhachHang = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 80, // Chiều rộng của cột STT
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="Product" style={{ width: 50 }} />
      ),
      width: 120, // Chiều rộng của cột ảnh
    },
    {
      title: "Tên khách hàng",
      dataIndex: "ten",
      key: "ten",
      width: 200, // Chiều rộng của cột Tên khách hàng
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250, // Chiều rộng của cột Email
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
      render: (sdt) => sdt,
      width: 180, // Chiều rộng của cột Số điện thoại
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button type="primary" onClick={handleOkKhachHang}>
          Chọn
        </Button>
      ),

      width: 150, // Chiều rộng của cột Hành động
    },
  ];

  // Hàm hiển thị Modal quét QR
  const showQrScanner = () => {
    setIsModalVisibleQR(true);
    setTimeout(() => {
      const qrCodeScanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });
      qrCodeScanner.render(
        (decodedText) => {
          handleScanSuccess(decodedText);
          qrCodeScanner.clear(); // Dừng quét khi đã quét xong
          setIsModalVisibleQR(false); // Đóng Modal
        },
        (errorMessage) => {
          console.log("QR Code no match", errorMessage);
        }
      );
    }, 500);
  };

  // Xử lý kết quả khi quét thành công
  const handleScanSuccess = (decodedText) => {
    console.log("QR Code scanned:", decodedText);
    // Xử lý thêm sản phẩm vào giỏ hàng bằng `decodedText` nếu cần
  };

  // Đóng Modal khi hủy
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelModalAddSPCT = () => {
    setIsModalOpen(false);
  };
  const handleCancelQR = () => {
    setIsModalVisibleQR(false);
  };
  const renderOptions = (data) => {
    return data.map((item) => (
      <option key={item.code} value={item.code}>
        {item.name}
      </option>
    ));
  };

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
      if (res?.data) {
        setCurrentInvoice(res.data);
        console.log(res.data);

        const details = await getAllHdctByIdHoaDon(id);
        if (details && details.data) {
          setInvoiceDetails(details.data);
          console.log(details.data);
        } else {
          toast.error("Không tìm thấy chi tiết hóa đơn.");
        }
        console.log("Success");
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

  const paymentHistory = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã giao dịch",
      dataIndex: "maGiaoDich",
    },
    {
      title: "Số tiền",
      dataIndex: "soTien",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "phuongThucThanhToan",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button type="link" danger onClick={() => console.log(record?.id)}>
          <MdDelete style={{ fontSize: "20px" }} />
        </Button>
      ),
    },
  ];

  // const invoiceColumns = [
  //   {
  //     title: "STT",
  //     render: (_, __, index) => index + 1,
  //   },
  //   {
  //     title: "Tên sản phẩm",
  //     dataIndex: "tenSanPhamChiTiet",
  //     render: (text, record) => (
  //       // <div style={{ display: "flex", alignItems: "center" }}>
  //       //   <img
  //       //     src={record.hinhAnh} // Thêm ảnh nếu có
  //       //     alt={record.tenSanPhamChiTiet}
  //       //     style={{ width: 50, marginRight: 10 }}
  //       //   />
  //       <div>
  //         <div>{record.tenSanPhamChiTiet}</div>
  //       </div>
  //       // </div>
  //     ),
  //   },
  //   {
  //     title: "Số lượng",
  //     dataIndex: "soLuong",
  //     render: (text, record) => (
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <Button
  //           icon={<MinusOutlined />}
  //           onClick={() => updateQuantity("minus", record)}
  //           disabled={record.soLuong <= 1}
  //         />
  //         <InputNumber
  //           min={1}
  //           value={record.soLuong}
  //           onChange={(value) => updateQuantity({ ...record, soLuong: value })}
  //           style={{ width: 60, margin: "0 10px" }}
  //         />
  //         <Button
  //           icon={<PlusOutlined />}
  //           onClick={() => updateQuantity("plus", record)}
  //         />
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Tổng tiền",
  //     dataIndex: "tongTien",
  //     render: (text, record) => {
  //       <span>{record.tongTien}</span>
  //     },
  //   },
  //   {
  //     title: "Thao tác",
  //     render: (_, record) => (
  //       <Button type="link" danger onClick={() => handleDelete(record.id)}>
  //         <MdDelete style={{ fontSize: "20px" }} />
  //       </Button>
  //     ),
  //   },
  // ];

  const invoiceColumns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPhamChiTiet",
      render: (text, record) => (
        <div>
          <div>{record.tenSanPhamChiTiet}</div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<MinusOutlined />}
            onClick={() => updateQuantity("minus", record)}
            disabled={record.soLuong <= 1}
          />
          <InputNumber
            min={1}
            value={record.soLuong}
            onChange={(value) => updateQuantity({ ...record, soLuong: value })}
            style={{ width: 60, margin: "0 10px" }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => updateQuantity("plus", record)}
          />
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      render: (text, record) => {
        // Trả về giá trị tongTien hoặc giá trị mặc định nếu không có
        return <span>{(record.soLuong * record.giaBan).toLocaleString()} VND</span>;
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          <MdDelete style={{ fontSize: "20px" }} />
        </Button>
      ),
    },
  ];

  const updateQuantity = async (method, record) => {
    try {
      const payload = {
        idSanPhamChiTiet: record?.idSanPhamChiTiet,
        idHoaDon: currentInvoice?.id,
        method: method,
        soLuong: 1,
      };
      console.log(payload);

      const response = await axiosClient.put(
        `/api/v1/hdct/update-soLuong/${record.id}`,
        payload
      );

      if (response?.data) {
        const updatedData = Array.isArray(hoaDonChiTiet)
          ? hoaDonChiTiet.map((item) =>
              item.id === record.id ? { ...item, ...response.data } : item
            )
          : []; // Giữ nguyên hoặc khởi tạo mảng rỗng nếu không hợp lệ

        setHoaDonChiTiet(updatedData);
        await getOrderById(currentInvoice?.id);
        await fetchDataSpct();
        toast.success("Cập nhật số lượng thành công!");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng.");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Delete record:", id);

      // Gọi API xóa
      await deleteHdctById(id);

      // Xóa khỏi danh sách hiển thị
      setInvoiceDetails((prevDetails) =>
        prevDetails.filter((record) => record.id !== id)
      );

      // Cập nhật thông tin tổng hóa đơn
      const updatedInvoice = getHoaDonById(currentInvoice?.id);
      setCurrentInvoice(updatedInvoice);
      getOrderById(currentInvoice?.id);
      await fetchDataSpct();

      toast.success("Xóa hóa đơn chi tiết thành công!");
    } catch (error) {
      console.error("Error deleting invoice detail:", error);
      toast.error("Có lỗi xảy ra khi xóa hóa đơn chi tiết.");
    }
  };

  //demo

  const [selectedSpct, setSelectedSpct] = useState(null);

  // Set selectedSpct when a user selects a product
  const handleProductSelect = (product) => {
    console.log(product);

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
      await getOrderById(currentInvoice.id);
      toast.success("Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm sản phẩm vào hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewOrder}
        >
          Tạo hóa đơn
        </Button>
      </div>
      <Tabs type="card" defaultActiveKey="1" onChange={getOrderById}>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <TabPane tab={`Hóa đơn ${invoice.key}`} key={invoice.key}>
              <div>
                <Button type="primary">Danh sách</Button>
                <Table
                  columns={invoiceColumns}
                  dataSource={invoiceDetails}
                  pagination={false}
                  bordered
                  loading={loading}
                />
              </div>
            </TabPane>
          ))
        ) : (
          <TabPane tab="Hóa đơn" key={currentInvoice?.id}>
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
      {/* Nút hành động khác */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Button type="primary" onClick={showQrScanner}>
            <IoQrCodeSharp />
            QR Code
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm sản phẩm
          </Button>
        </Space>
      </div>
      {/* Tổng tiền */}
      <div style={{ textAlign: "right", marginTop: 20 }}>
        {/* <strong>Tổng tiền: {currentInvoice?.tongTien.toLocaleString()} VND</strong> */}
        <strong>
          Tổng tiền:{" "}
          {currentInvoice?.tongTien && !isNaN(currentInvoice.tongTien)
            ? currentInvoice.tongTien.toLocaleString() + " VND"
            : "0.0 VND"}
        </strong>
      </div>
      {/* Tài khoản */}
      <div style={{ marginTop: 20, marginLeft: 1050 }}>
        <Button type="primary" onClick={showModalKhachHang}>
          Chọn tài khoản
        </Button>
      </div>
      <p style={{ fontSize: "20px", fontWeight: "bolder", marginTop: "" }}>
        Tài khoản
      </p>
      <Divider />
      {currentInvoice?.tenKhachHang ? (
        <div>
          <div>
            <span>Tên khách hàng</span>: {currentInvoice.tenKhachHang}
          </div>
          <div>
            <span>Số điện thoại</span>: {currentInvoice.sdt}
          </div>
          <div>
            <span>Email</span>: {currentInvoice.email}
          </div>
        </div>
      ) : (
        <div>
          <span style={{ marginRight: "10px" }}>Tên khách hàng</span>
          <Tag color="magenta" style={{ width: "100px", textAlign: "center" }}>
            Khách lẻ
          </Tag>
        </div>
      )}

      {/* Modal QR Code Scanner */}
      <Modal
        title="QR Code Scanner"
        visible={isModalVisibleQR}
        onCancel={handleCancelQR}
        footer={null}
      >
        <div id="reader" style={{ width: "100%" }}></div>
      </Modal>
      <Modal
        title="Thêm sản phẩm"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancelAddSPCT}
        width={1000} // Tăng độ rộng của modal
        bodyStyle={{ padding: "20px" }} // Thêm padding để nội dung có không gian
      >
        {/* Filter and Table Content */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Nhập tên sản phẩm"
            prefix={<SearchOutlined />}
            style={{ width: "730px" }}
          />{" "}
          <Button type="primary">Tìm kiếm</Button>
          <Button>Reset</Button>
          <Select placeholder="Chất Liệu" style={{ width: "150px" }}>
            <Option value="All">Tất cả</Option>
            <Option value="Leather">Da</Option>
            <Option value="Synthetic">Nhân tạo</Option>
          </Select>
          <Select placeholder="Thương Hiệu" style={{ width: "150px" }}>
            <Option value="All">Tất cả</Option>
            <Option value="Kappa">Kappa</Option>
            <Option value="Nike">Nike</Option>
          </Select>
          <Select placeholder="Giới Tính" style={{ width: "150px" }}>
            <Option value="All">Tất cả</Option>
            <Option value="Male">Nam</Option>
            <Option value="Female">Nữ</Option>
          </Select>
          <Select placeholder="Kích cỡ" style={{ width: "150px" }}>
            <Option value="All">Tất cả</Option>
            <Option value="36">36</Option>
            <Option value="37">37</Option>
          </Select>
          <Select placeholder="Màu Sắc" style={{ width: "150px" }}>
            <Option value="All">Tất cả</Option>
            <Option value="Maroon">Maroon</Option>
            <Option value="Red">Red</Option>
          </Select>
          <div style={{ width: "300px" }}>
            <span>Khoảng giá:</span>
            <Slider range min={0} max={10000000} step={500000} />
          </div>
        </div>

        <Table
          columns={columnsSPCT}
          dataSource={sanPhamChiTiet}
          rowKey="key"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleProductSelect(record),
          })}
        />
      </Modal>
      <Modal
        title="Thanh toán"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancelThanhToan}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleOkThanhToan}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {/* Chọn phương thức thanh toán */}
          <Form.Item label="Phương thức thanh toán">
            <Button.Group style={{ display: "flex", width: "100%" }}>
              <Button
                style={{
                  flex: 1,
                  borderRadius: "20px 0 0 20px",
                  backgroundColor:
                    selectedMethod === "cash" ? "#3498db" : "#d9d9d9",
                  color: selectedMethod === "cash" ? "#fff" : "#000",
                  fontWeight: selectedMethod === "cash" ? "bold" : "normal",
                  border: "none",
                }}
                onClick={() => handleButtonClick("cash")}
              >
                Tiền mặt
              </Button>
              <Button
                style={{
                  flex: 1,
                  borderRadius: "0 20px 20px 0",
                  backgroundColor:
                    selectedMethod === "transfer" ? "#3498db" : "#d9d9d9",
                  color: selectedMethod === "transfer" ? "#fff" : "#000",
                  fontWeight: selectedMethod === "transfer" ? "bold" : "normal",
                  border: "none",
                }}
                onClick={() => handleButtonClick("transfer")}
              >
                Chuyển khoản
              </Button>
            </Button.Group>
          </Form.Item>

          <Form.Item label="Số tiền khách thanh toán">
            <Input
              type="text"
              value={
                currentInvoice?.tongTien && !isNaN(currentInvoice.tongTien)
                  ? currentInvoice.tongTien.toLocaleString() + " VND"
                  : "0.0 VND"
              }
              onChange={(e) => setModalPaymentAmount(Number(e.target.value))}
              placeholder="Nhập số tiền thanh toán"
            />
          </Form.Item>
          <Divider />
          {/*<Text strong style={{ color: 'red' }}>Tiền thiếu: {remainingAmount.toLocaleString()} VND</Text>*/}
          <Table
            // columns={paymentHistory}
            // dataSource={sanPhamChiTiet}
            pagination={false}
            locale={{ emptyText: "No data" }}
            style={{ marginTop: 16 }}
          />
          <Divider />
          <Text strong>
            Khách thanh toán: {partialPayment.toLocaleString()} VND
          </Text>
          <br />
          <Text strong style={{ color: "red" }}>
            {/* Tiền thiếu: {remainingAmount.toLocaleString()} VND */}
          </Text>
        </Form>
      </Modal>
      {/*</div>*/}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          width: "100%",
        }}
      >
        {shipping && (
          <div style={{ width: "48%" }}>
            <Title level={3}>Thông tin giao hàng</Title>
            <Divider />
            <Form
              style={{ width: "100%" }}
              form={form}
              layout="vertical"
              onFinish={(values) => console.log("Form values:", values)}
            >
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>

              {/* Wrap these items in a flex container */}
              <div style={{ display: "flex", gap: "8px" }}>
                <Form.Item
                  name="city"
                  label="Tỉnh/Thành phố"
                  rules={[
                    { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    <Option value="">Chọn thành phố</Option>
                    {renderOptions(provinces)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                  >
                    <Option value="">Chọn huyện/Xã</Option>
                    {renderOptions(districts)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    value={selectedWard}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict}
                  >
                    <Option value="">Chọn xã</Option>
                    {renderOptions(wards)}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea
                  placeholder="Ghi chú thêm (không bắt buộc)"
                  rows={3}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {/* Form Thông tin thanh toán - Luôn hiển thị */}
        <div style={{ width: "48%", marginLeft: "auto" }}>
          <Title level={3}>
            <FaBagShopping style={{ marginRight: 20 }} />
            Thông tin thanh toán
          </Title>
          <Form layout="vertical">
            <Divider />
            <Form.Item label="Khách thanh toán">
              <Row align="middle">
                <Col flex="auto">
                  <Button
                    icon={<MdOutlinePayment />}
                    onClick={showModalThanhToan}
                    style={{ cursor: "pointer" }}
                  />
                </Col>
                <Col style={{ paddingLeft: "8px" }}>
                  <Text strong>{partialPayment.toLocaleString()} VND</Text>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Mã giảm giá">
              <Row gutter={8}>
                <Col span={16}>
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={currentInvoice?.maVoucher}
                  />
                </Col>
                <Col span={8}>
                  <Button type="primary">Chọn mã</Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Giao Hàng">
              <Switch
                checked={shipping}
                onChange={() => setShipping(!shipping)}
              />
            </Form.Item>
            <Form.Item label="Tiền hàng">
              <Text>
                <strong>
                  {currentInvoice?.tongTien && !isNaN(currentInvoice.tongTien)
                    ? currentInvoice.tongTien.toLocaleString() + " VND"
                    : "0.0 VND"}
                </strong>
              </Text>
            </Form.Item>
            <Form.Item label="Giảm giá">
              {/* <Text>{discount.toLocaleString()} VND</Text> */}
            </Form.Item>
            <Form.Item label="Tổng tiền">
              <Title level={4} style={{ color: "red" }}>
                {currentInvoice?.tongTien && !isNaN(currentInvoice.tongTien)
                  ? currentInvoice.tongTien.toLocaleString() + " VND"
                  : "0.0 VND"}
              </Title>
            </Form.Item>
            <Button
              type="primary"
              block
              style={{
                width: "150px",
                background: "black",
                color: "white",
                marginLeft: "400px",
              }}
              onClick={confirm}
            >
              Xác nhận thanh toán
            </Button>
            {contextHolder}
          </Form>
          <Modal
            title="Khách hàng"
            open={isShowModalKhachHang}
            onCancel={cancelModalKhachHang}
            width={1000}
          >
            <Table
              rowKey="key"
              columns={columnsKhachHang}
              dataSource={customer}
              loading={loading}
              onRow={(record) => ({
                onClick: () => selectCustomer(record),
              })}
            />
          </Modal>
          <Modal
            title="Số lượng sản phẩm"
            open={isModalOpen}
            onOk={handleOkAddSPCT}
            onCancel={handleCancelModalAddSPCT}
          >
            <InputNumber
              min={1}
              defaultValue={1}
              onChange={(value) => setQuantity(value)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
