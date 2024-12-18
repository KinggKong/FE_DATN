import { useCallback, useEffect, useState } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IoQrCodeSharp } from "react-icons/io5";
import { MdDelete, MdOutlinePayment } from "react-icons/md";
import axios from "axios";
import debounce from "lodash/debounce";
import {
  createHoaDon,
  getAllHoaDon,
  getHoaDonById,
  confirmPayment,
  addCustomerToInvoice,
  changeTypeBill,
  updateCustomer,
} from "../../../../api/HoaDon";
import {
  getAllHdctByIdHoaDon,
  deleteHdctById,
  createHoaDonChiTiet,
} from "../../../../api/HoaDonChiTiet";
import { toast } from "react-toastify";
import { getAllSanPhamChiTietBanApi } from "../../../../api/SanPhamChiTietAPI";
import TabPane from "antd/es/tabs/TabPane";
import { getAllKhachHang } from "../../../../api/KhachHang";
import axiosClient from "../../../../api/axiosClient";
import ModalThemMoiKhachHang from "../khachhang/ModalThemMoiKhachHang";
import { createKhachHangApi } from "../../../../api/KhachHangApi";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import image from "../../../../util/cart-empty-img.8b677cb3.png";
import { getAllSanPhamApi } from "../../../../api/SanPhamApi";
import { getAllDanhMucApi } from "../../../../api/DanhMucService";
import { getAllThuongHieuApi } from "../../../../api/ThuongHieuService";
import { getAllChatLieuDeApi } from "../../../../api/ChatLieuDeApi";
import { getAllChatLieuVaiApi } from "../../../../api/ChatLieuVaiApi";

const ShoppingCart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleQR, setIsModalVisibleQR] = useState(false);
  const { Title, Text } = Typography;
  const [isShow, setIsShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isShowModalKhachHang, setIsShowModalKhachHang] = useState(false);
  const [hoaDonChiTiet, setHoaDonChiTiet] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("Tiền mặt");

  const [confirmPayments, setConfirmPaymets] = useState(false);

  const [addressOptions, setAddressOptions] = useState([]);

  const [paymentAmount, setPaymentAmount] = useState(
    localStorage.getItem(currentInvoice?.id) || "0.0"
  );

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "0.0 VND"; // Trả về 0.0 VND nếu giá trị không hợp lệ
    return number.toLocaleString("vi-VN") + " VND"; // Định dạng tiền theo kiểu Việt Nam
  };

  const handlePaymentChange = (value) => {
    // Loại bỏ ký tự không phải là số và cập nhật lại giá trị
    const formattedValue = value.replace(/[^\d]/g, "");
    setPaymentAmount(formattedValue);
    localStorage.setItem(currentInvoice?.id, formattedValue);
  };

  useEffect(() => {
    // Cập nhật giá trị từ localStorage khi currentInvoice thay đổi
    if (currentInvoice?.id && localStorage.getItem(currentInvoice?.id)) {
      setPaymentAmount(localStorage.getItem(currentInvoice?.id));
    }
  }, [currentInvoice]);

  // useEffect(() => {
  //   setPaymentAmount(currentInvoice?.tienSauGiam);
  // }, [currentInvoice]);

  const notificationMessage = (type, message) => {
    toast.dismiss();
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warn(message);
        break;
      default:
        toast(message);
        break;
    }
  };

  const apiKey = "DFt7PndsFeTuDNGggyzQyLr0dzqU9Sf0hb0mMZX5"; // Replace with your Goong API key
  const originLat = 21.038059779392608;
  const originLng = 105.74668196761013;
  const [isShipping, setIsShipping] = useState(false);
  const [ship, setShip] = useState(0);
  const [diaChi, setDiaChi] = useState("");
  const [tenKhachHang, setTenKhachHang] = useState("Khách lẻ");
  const [sdt, setSdt] = useState(0);
  const [ghiChu, setGhiChu] = useState("");

  //update Gia khi tat mo sale trong hoa don cho
  const updateHoaDonCT_Sale = async () => {
    try {
      const res = await updateHoaDonCT_Sale();
      if (res?.data) {
        console.log(res.data);
      }
    } catch (error) {
      console.error("Update gia trong hoa don cho error:", error);
    }
  };

  useEffect(() => {
    updateHoaDonCT_Sale();
  }, []);

  //datafilter SPCT
  const [idDanhMuc, setIdDanhMuc] = useState();
  const [idThuongHieu, setIdThuongHieu] = useState();
  const [idChatLieuVai, setIdChatLieuVai] = useState();
  const [idChatLieuDe, setIdChatLieuDe] = useState();
  const [idSanPham, setIdSanPham] = useState();
  const [dataSanPham, setDataSanPham] = useState([]);
  const [dataDanhMuc, setDataDanhMuc] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataChatLieuVai, setDatChatLieuVai] = useState([]);
  const [dataChatLieuDe, setDataChatLieuDe] = useState([]);

  //fetch data filter
  const fetchDataSanPham = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllSanPhamApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSanPham(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data san pham", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data san pham",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchDataDanhMuc = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllDanhMucApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataDanhMuc(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data danh muc", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data danh muc",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataThuongHieu = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllThuongHieuApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataThuongHieu(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data thuong hieu", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data thuong hieu",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuDe = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuDeApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataChatLieuDe(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu de", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu de",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuVai = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuVaiApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDatChatLieuVai(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu vai", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu vai",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmPaymentShow = () => {
    setConfirmPaymets(true);
  };

  const confirmPaymentHide = () => {
    setConfirmPaymets(false);
  };

  const changeType = async (id) => {
    try {
      // Gọi API để thay đổi loại hóa đơn
      await changeTypeBill(id);

      // Sau khi thay đổi loại hóa đơn thành công, cập nhật lại trạng thái của currentInvoice
      setCurrentInvoice((prev) => ({
        ...prev,
        loaiHoaDon: prev.loaiHoaDon === "OFFLINE" ? "ONLINE" : "OFFLINE", // Đảo ngược trạng thái
      }));
    } catch (error) {
      console.error("Failed to update invoice type:", error);
    }
  };

  const handleButtonClick = async (method) => {
    // setOpenThanhToan(true);
    setSelectedMethod(method);
  };

  useEffect(() => {
    if (currentInvoice && currentInvoice.tongTien) {
      setModalPaymentAmount(currentInvoice.tongTien);
    }
  }, [currentInvoice]);

  const addKhachHang = (idHoaDon, idKhachHang) => {
    updateCustomer(idHoaDon, idKhachHang);
    console.log(idHoaDon, idKhachHang);
    
  }

  const selectCustomer = async (payload) => {
    setCurrentCustomer(payload);
    addKhachHang(currentInvoice?.id, payload?.id)
    console.log("Current customer:", payload);
    setTenKhachHang(payload?.ten);
    setSdt(payload?.sdt);

    form.setFieldsValue({
      tenNguoiNhan: payload?.ten,
      sdt: payload?.sdt,
      email: payload?.email,
      address: payload?.diaChiStr,
    });
    if (isShipping && payload?.diaChiStr) {
      try {
        // Gọi API Goong để lấy tọa độ từ địa chỉ
        const response = await axios.get(
          `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
            payload.diaChiStr
          )}`
        );

        if (response.data.predictions && response.data.predictions.length > 0) {
          const placeId = response.data.predictions[0].place_id;

          const detailResponse = await axios.get(
            `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`
          );

          if (
            detailResponse.data.result &&
            detailResponse.data.result.geometry
          ) {
            const { lat, lng } = detailResponse.data.result.geometry.location;
            // Gọi hàm tính phí vận chuyển với tọa độ
            calculateShippingCost(lat, lng);
            setDiaChi(payload.diaChiStr);
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates for address:", error);
        message.error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
      }
    } else if (isShipping && !payload?.diaChiStr) {
      message.error("Vui lòng nhập địa chỉ giao hàng.");
      setShip(0);
      setDiaChi(null);
    }
  };

  useEffect(() => {
    selectCustomer(currentCustomer);
  }, [currentCustomer]);

  const showModalKhachHang = () => {
    if (currentInvoice?.id == null) {
      notificationMessage("warning", "Vui lòng chọn hóa đơn !");
      setIsShowModalKhachHang(false);
      return;
    }
    setIsShowModalKhachHang(true);
  };

  const cancelModalKhachHang = () => {
    setIsShowModalKhachHang(false);
  };

  const handleOkKhachHang = async () => {
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
      getOrderById(activeTab);
    }
  }, [activeTab]);



  //Hàm validate form thanh toán
  const validateForm = () => {
    // Kiểm tra loại hóa đơn
    if (currentInvoice?.loaiHoaDon === "ONLINE") {
      // Lấy giá trị từ form
      const values = form.getFieldsValue();

      // Kiểm tra tên người nhận
      if (!values.tenNguoiNhan || values.tenNguoiNhan.trim() === "") {
        toast.warning("Vui lòng nhập tên người nhận!");
        return false;
      }

      // Kiểm tra số điện thoại
      if (!values.sdt || values.sdt.trim() === "") {
        toast.warning("Vui lòng nhập số điện thoại!");
        return false;
      }
      if (!/^[0-9]{10}$/.test(values.sdt)) {
        toast.warning("Số điện thoại không đúng định dạng (10 chữ số)!");
        return false;
      }

      // Kiểm tra địa chỉ
      if (!values.address || values.address.trim() === "") {
        toast.warning("Vui lòng nhập địa chỉ giao hàng!");
        return false;
      }
    }

    // Trả về true nếu tất cả điều kiện hợp lệ
    return true;
  };


  useEffect(() => {
      getOrderById(currentInvoice?.id);
      localStorage.getItem(currentInvoice?.id)
  }, [currentInvoice?.id])

  const handleXacNhanThanhToan = async (id) => {
    setLoading(true);
    

    try {
      if (!currentInvoice) {
        setIsShow(true);
        setConfirmPaymets(false);
        notificationMessage("warning", "Vui lòng chọn hóa đơn");
        return;
      }
      if(currentInvoice?.tongTien == 0) {
        setConfirmPaymets(false);
        notificationMessage("warning", "Vui lòng thêm sản phẩm !");
        return;
      }
      if (currentInvoice?.loaiHoaDon === "ONLINE") {
        const isValid = validateForm();
        if (!isValid) {
          setLoading(false);
          return; // Dừng xử lý nếu không hợp lệ
        }
      }
     
  
      if (
        Number(localStorage.getItem(currentInvoice?.id)) <
        currentInvoice.tienSauGiam
      ) {
        setConfirmPaymets(false);
        notificationMessage("warning", "Vui lòng thanh toán đơn hàng!");
        return;
      }

      if (!isShipping) {
        setShip(0);
        setDiaChi(null);
      }
  
      const processedName = tenKhachHang?.trim() || "Khách lẻ";
      const processedPhone = sdt?.trim() || "";

      const res = await confirmPayment(id, selectedMethod, diaChi, ship, processedName,
        processedPhone, ghiChu);


      // const res = await confirmPayment(id, selectedMethod, diaChi, ship);
      console.log(res);

      if (res?.code === 200) {
        localStorage.removeItem(currentInvoice?.id);

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

        form.resetFields();
        
        setCurrentInvoice(null);
       
        toast.success("Thanh toán hóa đơn thành công!");
        setConfirmPaymets(false);
        setPartialPayment(0);
        setShip(0);
        setDiaChi("");
        setPaymentAmount(0)
        setIsShipping(false);
        setCurrentCustomer(null);
        console.log("Data: ", res?.code);
      }
  
      // Xử lý khi voucher hết hạn (code 1041)
      if (res?.code === 1041) {
        notificationMessage("warning", "Voucher đã hết hạn");
        return; // Kết thúc hàm nếu voucher hết hạn
      }
  
    } catch (error) {
      console.log(error);
      notificationMessage("warning", "Voucher đã dừng áp dụng !");
    } finally {
      setLoading(false);
    }
  };
  
 
  const [partialPayment, setPartialPayment] = useState(0);
  const [modalPaymentAmount, setModalPaymentAmount] = useState(0);
  const showModalThanhToan = () => setIsModalVisible(true);
  const handleCancelThanhToan = () => setIsModalVisible(false);
  const handleOkThanhToan = () => {
    setPartialPayment(currentInvoice?.tienSauGiam);
    console.log(modalPaymentAmount);
    localStorage.setItem(`${currentInvoice.id}`, paymentAmount);
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
    {
      title: "Tên Sản Phẩm",
      dataIndex: "tenSanPham",
      key: "name",
      render: (text) => <span style={{ width: "400px" }}>{text}</span>,
    },
    {
      title: "Giá Bán",
      dataIndex: "giaBanSauKhiGiam",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    { title: "Số Lượng Còn Lại", dataIndex: "soLuong", key: "quantity" },
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
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "Đang bán" : "Ngừng bán"}
        </Tag>
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
      width: 80,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="Product" style={{ width: 50 }} />
      ),
      width: 120,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "ten",
      key: "ten",
      width: 200,
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
          Chọn {console.log(currentCustomer)}
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
      notificationMessage("warning", "Vui lòng chọn hóa đơn!");
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

      notificationMessage("success", "Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      notificationMessage("error", "Số lượng vượt quá trong kho.");
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

  const fetchDataSpct = useCallback(async () => {
    const params = {
      idDanhMuc,
      idThuongHieu,
      idChatLieuVai,
      idChatLieuDe,
      idSanPham,
    };
    try {
      const res = await getAllSanPhamChiTietBanApi(params);
      if (res?.data) {
        const dataWithKey = res.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setSanPhamChiTiet(dataWithKey);
        setTotalItems(res.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  }, [idDanhMuc, idThuongHieu, idChatLieuVai, idChatLieuDe, idSanPham]);

  useEffect(() => {
    fetchDataDanhMuc();
    fetchDataThuongHieu();
    fetchDataChatLieuDe();
    fetchDataChatLieuVai();
    fetchDataSanPham();
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
        notificationMessage(
          "warning",
          "Đã đạt giới hạn 5 hóa đơn! Không thể tạo hóa đơn mới."
        );
        return;
      }
      await createHoaDon();
      notificationMessage("success", "Tạo hóa đơn mới thành công !");
      await fetchData();
    } catch (error) {
      console.log(error);
      notificationMessage("error", "Tạo hóa đơn thất bại !");
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
          notificationMessage("error", "Không tìm thấy chi tiết hóa đơn.");
        }
        console.log("Success");
      } else {
        notificationMessage("error", "Không tìm thấy hóa đơn.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        return <span>Không có hình ảnh</span>;
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
        notificationMessage("success", "Cập nhật số lượng thành công!");
      } else {
        notificationMessage("error", "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      notificationMessage("error", "Số lượng vượt quá trong kho !.");
    }
  };

  const [errorShown, setErrorShown] = useState(false);

  const handleQuantityChange = async (value, record) => {
    if (value <= 0 || value === "" || value == null) {
      return;
    }
    if (value === record.soLuong) {
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const payload = {
        idSanPhamChiTiet: record?.idSanPhamChiTiet,
        idHoaDon: currentInvoice?.id,
        method: value > record.soLuong ? "plus" : "minus",
        soLuong: Math.abs(value - record.soLuong),
      };

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
      } else {
        notificationMessage("error", "Cập nhật thất bại!");
      }
    } catch (error) {
      if (!errorShown) {
        notificationMessage(
          "error",
          "Số lượng vượt quá trong kho, kiểm tra lại số lượng sản phẩm!"
        );
        setErrorShown(true);
      }
      console.error("Error updating quantity:", error);
    } finally {
      setTimeout(() => {
        setErrorShown(false);
        setIsProcessing(false);
      }, 3000);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false); // Kiểm tra xem có đang xử lý API không

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
      notificationMessage("success", "Xóa hóa đơn chi tiết thành công!");
    } catch (error) {
      console.error("Error deleting invoice detail:", error);
      notificationMessage("error", "Có lỗi xảy ra khi xóa hóa đơn chi tiết.");
    }
  };

  const [selectedSpct, setSelectedSpct] = useState(null);

  const handleProductSelect = (product) => {
    console.log(product);
    if (currentInvoice?.id == null) {
      setIsModalOpen(false);
      notificationMessage("warning", "Vui lòng chọn hóa đơn !");
      return;
    }
    setSelectedSpct(product);
  };

  const addSpctToHoaDon = async () => {
    if (!currentInvoice) {
      notificationMessage("warning", "Vui lòng chọn hóa đơn!");
      return;
    }
    if (!selectedSpct) {
      notificationMessage("warning", "Vui lòng chọn sản phẩm!");
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

      notificationMessage("success", "Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      notificationMessage("error", "Số lượng vượt quá trong kho.");
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  // Add customer

  const [isCreateCustomer, setIsCreateCustomer] = useState(false);

  const handleCreateCustomer = async () => {
    setIsCreateCustomer(true);
  };

  const cancelCreateCustomer = async () => {
    setIsCreateCustomer(false);
  };

  const handleSubmits = async (customerData) => {
    const res = await createKhachHangApi(customerData);

    if (res?.data) {
      await fetchDataKhachHang();
      notificationMessage("success", "Thêm khách hàng thành công !");
      setIsCreateCustomer(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form] = Form.useForm();
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      console.log("Stored user info:", storedUserInfo);
      console.log("Parsed user info:", parsedUserInfo);
    }
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!userInfo || !userInfo.id) {
  //       console.log("User info not available yet");
  //       return;
  //     }
  //     // setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/v1/shop-on/confirm?idKhachHang=${userInfo.id}`
  //       );
  //       if (response.data.code === 1000) {
  //         if (
  //           !response.data.data ||
  //           !response.data.data?.gioHangChiTietList ||
  //           response.data.data?.gioHangChiTietList.length === 0
  //         ) {
  //           navigate("/");
  //           return;
  //         }
  //         setCheckoutData(response.data.data);
  //       } else {
  //         throw new Error("Failed to fetch data");
  //       }
  //     } catch (err) {
  //       setError("An error occurred while fetching data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  //   // fetchProvinces();
  // }, [userInfo]);




  // lấy địa chi

  const calculateShippingCost = async (lat, lng) => {
    setShippingLoading(true);
    try {
      const distanceResponse = await axios.get(
        `https://rsapi.goong.io/DistanceMatrix?origins=${originLat},${originLng}&destinations=${lat},${lng}&api_key=${apiKey}`
      );

      if (
        distanceResponse.data.rows &&
        distanceResponse.data.rows[0].elements &&
        distanceResponse.data.rows[0].elements[0].distance
      ) {
        const distanceKm =
          distanceResponse.data.rows[0].elements[0].distance.value / 1000;
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
      } else {
        throw new Error("Unable to calculate distance");
      }
    } catch (err) {
      console.error("Error calculating shipping cost:", err);
      message.error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
    } finally {
      setShippingLoading(false);
    }
  };



  const handleAddressSearch = debounce(async (value) => {
    if (value.length > 2) {
      try {
        const response = await axios.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(value)}`);
        if (response.data.predictions) {
          setAddressOptions(response.data.predictions.map(prediction => ({
            value: prediction.description,
            label: prediction.description,
            place_id: prediction.place_id
          })));
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    }
  }, 300);

  const handleAddressSelect = async (value, option) => {
    try {
      const detailResponse = await axios.get(`https://rsapi.goong.io/Place/Detail?place_id=${option.place_id}&api_key=${apiKey}`);
      if (detailResponse.data.result && detailResponse.data.result.geometry) {
        const { lat, lng } = detailResponse.data.result.geometry.location;
        calculateShippingCost(lat, lng);
        setDiaChi(value);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };



  // useEffect(() => {
  //   getOrderById(currentInvoice?.id);
  //   fetchData();
  // }, [currentInvoice?.id]);

  const handleSubmit = async (values) => {
    setCheckoutLoading(true);
    try {
      const hoaDonRequest = {
        idGioHang: values.idGioHang,
        tenNguoiNhan: values.tenNguoiNhan,
        // diaChiNhan: `${values.address}, ${selectedWard ? selectedWard.fullName : ""
        //   }, ${selectedDistrict ? selectedDistrict.fullName : ""}, ${selectedProvince ? selectedProvince.fullName : ""
        //   }`,
        diaChiNhan: values.address,
        sdt: values.sdt,
        tongTien: checkoutData.totalPrice + ship,
        tienSauGiam: checkoutData.totalPrice + ship,
        tienShip: ship,
        ghiChu: values.ghiChu,
        email: values.email,
        idKhachHang: values.idKhachHang,
        idVoucher: null,
        hinhThucThanhToan: paymentMethod,
        soTienGiam: 0,
      };
      console.log(hoaDonRequest);

      let response;
      if (paymentMethod === "VNPAY") {
        response = await axios.post(
          "http://localhost:8080/api/payment/submitOrder",
          hoaDonRequest
        );
        if (response.data.code === 1000) {
          window.location.href = response.data.data;
        } else {
          throw new Error("VNPay payment initiation failed");
        }
      } else {
        response = await axios.post(
          "http://localhost:8080/api/v1/shop-on/checkout",
          hoaDonRequest
        );
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
          // fetchCart();
        } else {
          throw new Error("Checkout failed");
        }
      }
    } catch (err) {
      message.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
      console.log(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div style={{ padding: 20 }}>
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
              <img src={image} style={{ margin: "0 auto" }} />
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
      ></div>
      {/* Tổng tiền */}
      <div style={{ textAlign: "right", marginTop: 20 }}>
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
        width={1200}
        bodyStyle={{
          padding: "20px",
          height: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >


        <Row className="flex justify-between">
          <Col span={8}>
            <label className="text-sm block mb-2" htmlFor="">
              Sản phẩm
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Tất cả sản phẩm"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={idSanPham}
              onChange={(value) => {
                setIdSanPham(value);
              }}
              options={[
                { value: "", label: "Tất cả sản phẩm" },
                ...dataSanPham?.map((sanPham) => ({
                  value: sanPham.id,
                  label: sanPham.tenSanPham,
                })),
              ]}
            />
          </Col>


          <Col span={3}>
            <label className="text-sm block mb-2" htmlFor="">
              Thương hiệu
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Tất cả thương hiệu"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={idThuongHieu}
              onChange={(value) => {
                setIdThuongHieu(value);
              }}
              options={[
                { value: "", label: "Tất cả thương hiệu" },
                ...dataThuongHieu?.map((thuongHieu) => ({
                  value: thuongHieu.id,
                  label: thuongHieu.tenThuongHieu,
                })),
              ]}
            />
          </Col>
          <Col span={3}>
            <label className="text-sm block mb-2" htmlFor="">
              Danh mục
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              value={idDanhMuc}
              onChange={(value) => {
                setIdDanhMuc(value);
              }}
              placeholder="Tất cả danh mục"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                { value: "", label: "Tất cả danh mục" },
                ...dataDanhMuc?.map((danhMuc) => ({
                  value: danhMuc.id,
                  label: danhMuc.tenDanhMuc,
                })),
              ]}
            />
          </Col>
          <Col span={3}>
            <label className="text-sm block mb-2" htmlFor="">
              Chất liệu vải
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              value={idChatLieuVai}
              onChange={(value) => {
                setIdChatLieuVai(value);
              }}
              placeholder="Tất cả chất vải"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                { value: "", label: "Tất cả chất vải" },
                ...dataChatLieuVai?.map((vai) => ({
                  value: vai.id,
                  label: vai.tenChatLieuVai,
                })),
              ]}
            />
          </Col>
          <Col span={3}>
            <label className="text-sm block mb-2" htmlFor="">
              Chất liệu đế
            </label>
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              value={idChatLieuDe}
              onChange={(value) => {
                setIdChatLieuDe(value);
              }}
              placeholder="Tất cả chất đế"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                { value: "", label: "Tất cả chất đế" },
                ...dataChatLieuDe?.map((de) => ({
                  value: de.id,
                  label: de.tenChatLieu,
                })),
              ]}
            />
          </Col>
        </Row>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Table
            columns={columnsSPCT}
            dataSource={sanPhamChiTiet}
            rowKey="key"
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleProductSelect(record),
            })}
            sticky // Thêm thuộc tính này để cố định thanh tiêu đề
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
          <Button key="confirm" 
          type="primary" onClick={handleOkThanhToan}
          >
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
                    selectedMethod === "Tiền mặt" ? "#3498db" : "#d9d9d9",
                  color: selectedMethod === "Tiền mặt" ? "#fff" : "#000",
                  fontWeight: selectedMethod === "Tiền mặt" ? "bold" : "normal",
                  border: "none",
                }}
                onClick={() => handleButtonClick("Tiền mặt")}
              >
                Tiền mặt
              </Button>
            </Button.Group>
          </Form.Item>

          {/* Số tiền khách thanh toán */}
          <Form.Item label="Số tiền khách thanh toán">
            <Input
              type="text"
              value={formatCurrency(paymentAmount)}  
              placeholder="Nhập số tiền thanh toán"
              onChange={(e) => handlePaymentChange(e.target.value)}
            />
          </Form.Item>

          <Divider />

          <Text strong>
            Số tiền của đơn hàng: 
            {formatCurrency(currentInvoice?.tienSauGiam + (ship || 0))}
            <br/>
           <br/>
            {paymentAmount - currentInvoice?.tienSauGiam - (ship || 0) < 0
              ? `Tiền khách thiếu: ${Math.abs(
                  paymentAmount - currentInvoice?.tienSauGiam - (ship || 0)
                ).toLocaleString()} VND` // Nếu là âm, hiển thị "Tiền khách thiếu"
              : `Tiền trả lại khách: ${Math.abs(
                  paymentAmount - currentInvoice?.tienSauGiam - (ship || 0)
                ).toLocaleString()} VND`}
          </Text>
        </Form>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* {currentInvoice?.loaiHoaDon === "ONLINE" && (
          <div style={{ width: "48%", marginTop: "40px" }}>
            <Title level={3}>Thông tin giao hàng</Title>
          
            <Form
              form={form}
              layout="vertical"
              className="space-y-4"
              initialValues={{
                tenNguoiNhan: currentCustomer?.ten,
                sdt: currentCustomer?.sdt,
                email: currentCustomer?.email,
              }}
              onFinish={handleSubmit}
            >
                tenNguoiNhan: currentInvoice?.tenNguoiNhan,
                sdt: currentInvoice?.sdt,
                province: currentCustomer?.diaChi?.tinh,
                email: currentInvoice?.email,
                district: currentCustomer?.diaChi?.quan,
                ward: currentCustomer?.diaChi?.huyen,

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
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="sdt"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^(0|\+84)[3-9][0-9]{8}$/,
                    message: "Số điện thoại không đúng định dạng!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                required
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <AutoComplete
                  options={addressOptions}
                  onSearch={handleAddressSearch}
                  onSelect={handleAddressSelect}
                  placeholder="Nhập địa chỉ"
                  size="large"
                />
              </Form.Item>



              <Form.Item label="Địa chỉ email (tùy chọn)" name="email">
                <Input size="large" />
              </Form.Item>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">THÔNG TIN BỔ SUNG</h3>
                <Form.Item label="Ghi chú đơn hàng (tùy chọn)" name="ghiChu">
                  <TextArea
                    rows={4}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        )} */}

        {currentInvoice?.loaiHoaDon === "ONLINE" && (
          <div style={{ width: "48%", marginTop: "40px" }}>
            <Title level={3}>Thông tin giao hàng</Title>

            <Form
              form={form}
              layout="vertical"
              className="space-y-4"
              initialValues={{
                tenNguoiNhan: currentCustomer?.ten,
                sdt: currentCustomer?.sdt,
                email: currentCustomer?.email,
                province: currentCustomer?.diaChi?.tinh,
                district: currentCustomer?.diaChi?.quan,
                ward: currentCustomer?.diaChi?.huyen,
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
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="sdt"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^(0|\+84)[3-9][0-9]{8}$/,
                    message: "Số điện thoại không đúng định dạng!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                required
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <AutoComplete
                  options={addressOptions}
                  onSearch={handleAddressSearch}
                  onSelect={handleAddressSelect}
                  placeholder="Nhập địa chỉ"
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Địa chỉ email (tùy chọn)" name="email">
                <Input size="large" />
              </Form.Item>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">THÔNG TIN BỔ SUNG</h3>
                <Form.Item label="Ghi chú đơn hàng (tùy chọn)" name="ghiChu">
                  <TextArea
                    rows={4}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        )} 

        {/* Form Thông tin thanh toán - Luôn hiển thị */}
        {currentInvoice?.id && (
          <div style={{ width: "48%", marginLeft: "auto", marginTop: "40px" }}>
            <Title level={3}>
              {/* <FaBagShopping style={{ marginRight: 20 }} /> */}
              Thông tin thanh toán
            </Title>
            <Form layout="vertical">
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
                    <Text strong>
                    {localStorage.getItem(currentInvoice?.id) < (currentInvoice?.tienSauGiam + (ship || 0))
                     ? <Tag color="red">Thanh toán thất bại</Tag> 
                     : 
                     <Tag color="success">Thanh toán thành công</Tag>}
                    </Text>
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
                  checked={currentInvoice?.loaiHoaDon !== "OFFLINE"} // Bật nếu loại hóa đơn không phải OFFLINE
                  onChange={async () => {
                    const newLoaiHoaDon =
                      currentInvoice?.loaiHoaDon === "OFFLINE"
                        ? "ONLINE"
                        : "OFFLINE"; // Đảo ngược trạng thái loại hóa đơn
                    setIsShipping(newLoaiHoaDon === "ONLINE"); // Cập nhật trạng thái giao hàng

                    // Nếu loại hóa đơn là ONLINE, tính phí vận chuyển
                    if (newLoaiHoaDon === "ONLINE") {
                      if (currentCustomer?.diaChiStr) {
                        try {
                          // Gọi API để tính phí vận chuyển
                          const response = await axios.get(
                            `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
                              currentCustomer.diaChiStr
                            )}`
                          );

                          if (
                            response.data.predictions &&
                            response.data.predictions.length > 0
                          ) {
                            const placeId =
                              response.data.predictions[0].place_id;

                            const detailResponse = await axios.get(
                              `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`
                            );

                            if (
                              detailResponse.data.result &&
                              detailResponse.data.result.geometry
                            ) {
                              const { lat, lng } =
                                detailResponse.data.result.geometry.location;
                              calculateShippingCost(lat, lng); // Gọi hàm tính phí ship
                              setDiaChi(currentCustomer.diaChiStr);
                            }
                          }
                        } catch (error) {
                          console.error(
                            "Error calculating shipping cost:",
                            error
                          );
                          message.error(
                            "Không thể tính phí vận chuyển. Vui lòng thử lại."
                          );
                        }
                      } else {
                        message.error(
                          "Vui lòng chọn địa chỉ khách hàng trước."
                        );
                      }
                    } else {
                      setShip(0);
                      setDiaChi("");
                    }

                    changeType(currentInvoice?.id, newLoaiHoaDon);
                  }}
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
                <Text>
                  {currentInvoice?.soTienGiam &&
                    !isNaN(currentInvoice.soTienGiam)
                    ? currentInvoice.soTienGiam.toLocaleString() + " VND"
                    : "0.0 VND"}
                </Text>
              </Form.Item>
              {currentInvoice?.loaiHoaDon === "ONLINE" && (
                <Form.Item label="Tiền ship">
                  <Text>
                    {ship && !isNaN(ship)
                      ? ship.toLocaleString() + " VND"
                      : "0.0 VND"}
                  </Text>
                </Form.Item>
              )}
              <Form.Item label="Tổng tiền">
                <Title level={4} style={{ color: "red" }}>
                  {currentInvoice?.tienSauGiam + ship &&
                    !isNaN(currentInvoice.tienSauGiam + ship)
                    ? (currentInvoice.tienSauGiam + ship).toLocaleString() +
                    " VND"
                    : "0.0 VND"}
                </Title>
              </Form.Item>
              {currentInvoice.loaiHoaDon === "OFFLINE" ? (
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
              ) : (
                <Button
                  style={{
                    width: "150px",
                    background: "black",
                    color: "white",
                    marginLeft: "400px",
                  }}
                  onClick={confirmPaymentShow}
                >
                  Xác nhận đặt hàng
                </Button>
              )}
            </Form>
            <Modal
              title="Khách hàng"
              open={isShowModalKhachHang}
              onCancel={cancelModalKhachHang}
              width={1000}
              okText="Thêm khách hàng"
              cancelText="Hủy"
              onOk={handleCreateCustomer}
            >  
              <Table
                rowKey="key"
                columns={columnsKhachHang}
                dataSource={customer}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50", "100"],
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  },
                }}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => selectCustomer(record),
                  // onChange: () => selectCustomer(record),
                })}
              />
            </Modal>
            <ModalThemMoiKhachHang
              isOpen={isCreateCustomer}
              handleClose={cancelCreateCustomer}
              title="Khách hàng"
              handleSubmit={handleSubmits}
            />
            <Modal
              title="Số lượng sản phẩm"
              open={isModalOpen}
              onOk={() => {
                if (quantity < 1) {
                  notificationMessage(
                    "error",
                    "Số lượng phải lớn hơn hoặc bằng 1 !"
                  );
                  setIsModalOpen(false);
                  setQuantity(1);
                  return;
                } else if (quantity > sanPhamChiTiet?.soLuong) {
                  notificationMessage("error", "Số lượng vượt quá trong kho !");
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
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
