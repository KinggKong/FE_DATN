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
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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

  const [selectedMethod, setSelectedMethod] = useState("cash");

  const [confirmPayments, setConfirmPaymets] = useState(false);

  const confirmPaymentShow = () => {
    setConfirmPaymets(true);
  };

  const confirmPaymentHide = () => {
    setConfirmPaymets(false);
  };

  const [openThanhToan, setOpenThanhToan] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleThanhToanOk = async () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenThanhToan(false);
      setConfirmLoading(false);
    }, 2000);
    await createLSTT();
  };
  const handleThanhToanCancel = () => {
    console.log("Clicked cancel button");
    setOpenThanhToan(false);
  };

  const handleButtonClick = async (method) => {
    setOpenThanhToan(true);
    setSelectedMethod(method);
  };

  useEffect(() => {
    if (currentInvoice && currentInvoice.tongTien) {
      setModalPaymentAmount(currentInvoice.tongTien);
    }
  }, [currentInvoice]);

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
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch sử thanh toán:", error);
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
      console.log(res);

      // Kiểm tra dữ liệu trả về
      if (res?.data && Array.isArray(res.data)) {
        const dataWithKey = res.data.map((item) => ({
          ...item,
          key: item.id,
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

  const [activeTab, setActiveTab] = useState(
    invoices.length > 0 ? invoices[0].id : "noInvoice"
  );

  useEffect(() => {
    if (activeTab !== "noInvoice") {
      getOrderById(activeTab); // Tải dữ liệu hóa đơn đầu tiên khi component mount
    }
  }, [activeTab]);

  const handleXacNhanThanhToan = async (id) => {
    setLoading(true);
    try {
      if (!currentInvoice) {
        setConfirmPaymets(false);
        toast.warning("Vui lòng chọn hóa đơn");
        return; // Dừng lại nếu không có hóa đơn
      }

      if (partialPayment !== currentInvoice.tongTien) {
        setConfirmPaymets(false);
        toast.warning("Vui lòng thanh toán đơn hàng!");
        return;
      }

      const res = await confirmPayment(id);
      console.log(res);

      if (res?.code === 200) {
        setInvoices((prevInvoices) => {
          const newInvoices = prevInvoices.filter(
            (invoice) => invoice.id !== id
          );
          if (newInvoices.length > 0 && newInvoices[0]?.id) {
            setActiveTab(newInvoices[0]?.id);
          } else {
            setActiveTab("noInvoice");
          }
          return newInvoices;
        });
        toast.success("Thanh toán hóa đơn thành công!");
        setConfirmPaymets(false);
        setPartialPayment(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi thanh toán");
    } finally {
      setLoading(false);
    }
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
      dataIndex: "hinhAnhList",
      key: "image",
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
  const handleScanSuccess = async (decodedText) => {
    console.log("QR Code scanned:", decodedText);
    const data = JSON.parse(decodedText);

    if (!currentInvoice) {
      toast.warning("Vui lòng chọn hóa đơn!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        idHoaDon: currentInvoice?.id,
        idSanPhamChiTiet: data?.id,
        soLuong: 1,
      };
      console.log(payload);

      await createHoaDonChiTiet(payload);
      await fetchDataSpct();
      await getOrderById(currentInvoice.id);

      toast.success("Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      toast.error("Số lượng vượt quá trong kho.");
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  // Đóng Modal khi hủy
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelModalAddSPCT = () => {
    setQuantity(1);
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
    // setLoading(true);
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
        // add 9:27 pm test
        // getLSTTByOrderId(id);
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
    } finally {
      setLoading(false);
    }
  }, []);

  // const getLSTTByOrderId = async (orderId) => {
  //   setLoading(true);
  //   try {
  //     if(!currentInvoice) {
  //       toast.warning("Vui lòng chọn hóa đơn !");
  //       return;
  //     }
  //     const res = await getLSTTByIDHD(orderId);
  //     if (res?.data) {
  //       setLichSuThanhToan(res.data)
  //     }

  //   } catch (error) {
  //     console.error("Error fetching order:", error);
  //   }finally{
  //     setLoading(false)
  //   }
  // }

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

  const invoiceColumns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Hình ảnh",
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
        return <span>Không có hình ảnh</span>; // Hiển thị nếu không có hình ảnh
      },
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
            style={{ width: 60, margin: "0 10px" }}
            onChange={(value) => handleQuantityChange(value, record)}
            onBlur={(e) => handleBlur(e, record)}
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
        return (
          <span>{(record.soLuong * record.giaBan).toLocaleString()} VND</span>
        );
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
          : [];

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

  const [errorShown, setErrorShown] = useState(false); // Trạng thái kiểm soát thông báo lỗi

  const handleQuantityChange = async (value, record) => {
    if (value <= 0 || value === "" || value == null) {
      return;
    }
    if (value === record.soLuong) {
      return;
    }

    try {
      const payload = {
        idSanPhamChiTiet: record?.idSanPhamChiTiet,
        idHoaDon: currentInvoice?.id,
        method: value > record.soLuong ? "plus" : "minus",
        soLuong: Math.abs(value - record.soLuong),
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
          : [];

        setHoaDonChiTiet(updatedData);
        await getOrderById(currentInvoice?.id);
        await fetchDataSpct();
        // toast.success("Cập nhật số lượng thành công!");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      if (!errorShown) {
        // Hiển thị lỗi chỉ một lần
        toast.error("Số lượng vượt quá trong kho !");
        setErrorShown(true); // Đặt cờ lỗi đã hiển thị
      }
      console.error("Error updating quantity:", error);
    } finally {
      setTimeout(() => setErrorShown(false), 3000); // Đặt lại trạng thái sau 3 giây
    }
  };

  const handleBlur = async (e, record) => {
    const value = e.target.value;
    if (value === "" || value <= 0) {
      toast.error("Giá trị số lượng không hợp lệ");
      e.target.value = record.soLuong;
    } else {
      await handleQuantityChange(Number(value), record);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Delete record:", id);
      await deleteHdctById(id);

      setInvoiceDetails((prevDetails) =>
        prevDetails.filter((record) => record.id !== id)
      );
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

  const [selectedSpct, setSelectedSpct] = useState(null);

  const handleProductSelect = (product) => {
    console.log(product);

    setSelectedSpct(product);
  };

  const addSpctToHoaDon = async () => {
    if (!currentInvoice) {
      toast.warning("Vui lòng chọn hóa đơn!");
      return;
    }
    if (!selectedSpct) {
      toast.warning("Vui lòng chọn sản phẩm!");
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
      toast.error("Số lượng vượt quá trong kho.");
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* <div style={{ marginBottom: 20, textAlign: "right", margin: '20px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewOrder}
        >
          Tạo hóa đơn
        </Button>
         <Button type="primary" onClick={showQrScanner}>
            <IoQrCodeSharp />
            QR Code
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm sản phẩm
          </Button>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
          padding: "10px 20px",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewOrder}
        >
          Tạo hóa đơn
        </Button>
        <Button
          type="primary"
          onClick={showQrScanner}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <IoQrCodeSharp />
          QR Code
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm sản phẩm
        </Button>
      </div>

      <Tabs
        type="card"
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          getOrderById(key);
        }}
      >
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <TabPane tab={`Hóa đơn ${invoice.id}`} key={invoice.id}>
              <div>
                <Button type="primary" style={{ marginBottom: "10px" }}>
                  Danh sách
                </Button>
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
          <TabPane tab="Hóa đơn" key="noInvoice">
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

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* <Space>
          <Button type="primary" onClick={showQrScanner}>
            <IoQrCodeSharp />
            QR Code
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm sản phẩm
          </Button>
        </Space> */}
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
        <Modal
          title={`Xác nhận thanh toán hóa đơn ${currentInvoice?.id}`}
          visible={confirmPayments}
          onCancel={confirmPaymentHide}
          onClick={confirmPaymentShow}
          onOk={() => {
            handleXacNhanThanhToan(currentInvoice?.id);
          }}
        ></Modal>
      </div>
      <p style={{ fontSize: "20px", fontWeight: "bolder", marginTop: "" }}>
        Tài khoản
      </p>
      <Divider />
      {currentInvoice?.tenKhachHang &&
      currentInvoice.tenKhachHang !== "Khách lẻ" ? (
        <div>
          <div>
            <span>Tên khách hàng</span>: {currentInvoice.tenKhachHang}
          </div>
          {currentInvoice?.sdt && (
            <div>
              <span>Số điện thoại</span>: {currentInvoice.sdt}
            </div>
          )}
          {currentInvoice?.email && (
            <div>
              <span>Email</span>: {currentInvoice.email}
            </div>
          )}
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
      {/* <Modal
        title="Thêm sản phẩm"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancelAddSPCT}
        width={1000} 
        bodyStyle={{ padding: "20px" }} 
      >
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
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["5","10", "20", "50", "100"],
            onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
            },
        }}
          onRow={(record) => ({
            onClick: () => handleProductSelect(record),
          })}
        />
      </Modal> */}

      <Modal
        title="Thêm sản phẩm"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancelAddSPCT}
        width={1000}
        bodyStyle={{
          padding: "20px",
          height: "55vh", // Cố định chiều cao Modal
          overflow: "hidden", // Đảm bảo Modal không mở rộng
          display: "flex", // Sử dụng flex để kiểm soát bố cục nội dung
          flexDirection: "column",
        }}
      >
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
          />
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

        <div
          style={{
            flex: 1, // Chiếm không gian còn lại của Modal
            overflowY: "auto", // Kích hoạt cuộn dọc cho vùng bảng
          }}
        >
          <Table
            columns={columnsSPCT}
            dataSource={sanPhamChiTiet}
            rowKey="key"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            onRow={(record) => ({
              onClick: () => handleProductSelect(record),
            })}
          />
        </div>

        {/* CSS để ẩn thanh cuộn */}
        <style>
          {`
      div[style*="overflow-y: auto"]::-webkit-scrollbar {
        display: none; /* Ẩn thanh cuộn trên Chrome, Safari */
      }
    `}
        </style>
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
          <Modal
            title="Xác nhận thanh toán !"
            open={openThanhToan}
            onOk={handleThanhToanOk}
            confirmLoading={confirmLoading}
            onCancel={handleThanhToanCancel}
          ></Modal>

          <Form.Item label="Số tiền khách thanh toán">
            <Input
              type="text"
              value={
                currentInvoice?.tongTien && !isNaN(currentInvoice.tongTien)
                  ? currentInvoice.tongTien.toLocaleString() + " VND"
                  : "0.0 VND"
              }
              onChange={() => setModalPaymentAmount(currentInvoice?.tongTien)}
              placeholder="Nhập số tiền thanh toán"
            />
          </Form.Item>
          <Divider />
          {/*<Text strong style={{ color: 'red' }}>Tiền thiếu: {remainingAmount.toLocaleString()} VND</Text>*/}
          <Table
            columns={paymentHistory}
            dataSource={lichSuThanhToan}
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
              onClick={confirmPaymentShow}
            >
              Xác nhận thanh toán
            </Button>
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
            onOk={() => {
              if (quantity < 1) {
                toast.error("Số lượng phải lớn hơn hoặc bằng 1 !");
                setIsModalOpen(false);
                setQuantity(1);
                return;
              } else if (quantity > sanPhamChiTiet?.soLuong) {
                toast.error("Số lượng vượt quá trong kho !");
                setIsModalOpen(false);
                setQuantity(1);
              }
              handleOkAddSPCT();
            }}
            onCancel={handleCancelModalAddSPCT}
          >
            <InputNumber
              // min={1}
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
