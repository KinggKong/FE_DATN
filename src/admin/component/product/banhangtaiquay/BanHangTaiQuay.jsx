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
} from "../../../../api/HoaDon";
import {
  getAllHdctByIdHoaDon,
  deleteHdctById,
  createHoaDonChiTiet,
} from "../../../../api/HoaDonChiTiet";
import { toast } from "react-toastify";
import {
  fillData,
} from "../../../../api/SanPhamChiTietAPI";
import TabPane from "antd/es/tabs/TabPane";
import { getAllKhachHang } from "../../../../api/KhachHang";
import axiosClient from "../../../../api/axiosClient";
import ModalThemMoiKhachHang from "../khachhang/ModalThemMoiKhachHang";
import { createKhachHangApi } from "../../../../api/KhachHangApi";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import image from "../../../../util/cart-empty-img.8b677cb3.png";
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
  const [selectedMethod, setSelectedMethod] = useState("cash");

  const [confirmPayments, setConfirmPaymets] = useState(false);

  const [addressOptions, setAddressOptions] = useState([]);

  const notificationMessage = (type, message) => {

    toast.dismiss();
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      case 'warning':
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

  const selectCustomer = (payload) => {
    setCurrentCustomer(payload);
  };

  useEffect(() => {
    selectCustomer(currentCustomer);
  }, [currentCustomer]);

  const showModalKhachHang = () => {
    if (currentInvoice?.id == null) {
      toast.warning("Vui lòng chọn hóa đơn !");
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

  const handleXacNhanThanhToan = async (id) => {
    setLoading(true);
    try {
      if (!currentInvoice) {
        setIsShow(true);
        setConfirmPaymets(false);
        toast.warning("Vui lòng chọn hóa đơn");
        return;
      }

      if (
        Number(localStorage.getItem(currentInvoice?.id)) !==
        currentInvoice.tienSauGiam
      ) {
        console.log();
        setConfirmPaymets(false);
        toast.warning("Vui lòng thanh toán đơn hàng!");
        return;
      }

      const res = await confirmPayment(id, selectedMethod);
      console.log(res);

      if (res?.code === 200) {
        // Xóa thông tin hóa đơn khỏi localStorage khi thanh toán thành công
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
        toast.success("Thanh toán hóa đơn thành công!");
        setConfirmPaymets(false);
        setPartialPayment(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Số lương voucher đã hết !");
    } finally {
      setLoading(false);
    }
  };

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
        const response = await axios.get(
          `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
            value
          )}`
        );
        if (response.data.predictions) {
          setAddressOptions(
            response.data.predictions.map((prediction) => ({
              value: prediction.description,
              label: prediction.description,
              place_id: prediction.place_id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }
  }, 300);

  const handleAddressSelect = async (value, option) => {
    try {
      const detailResponse = await axios.get(
        `https://rsapi.goong.io/Place/Detail?place_id=${option.place_id}&api_key=${apiKey}`
      );
      if (detailResponse.data.result && detailResponse.data.result.geometry) {
        const { lat, lng } = detailResponse.data.result.geometry.location;
        calculateShippingCost(lat, lng);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const [shipping, setShipping] = useState(false);
  const [partialPayment, setPartialPayment] = useState(0);
  const [modalPaymentAmount, setModalPaymentAmount] = useState(0);
  const showModalThanhToan = () => setIsModalVisible(true);
  const handleCancelThanhToan = () => setIsModalVisible(false);
  const handleOkThanhToan = () => {
    setPartialPayment(currentInvoice?.tienSauGiam);
    console.log(modalPaymentAmount);
    localStorage.setItem(`${currentInvoice.id}`, currentInvoice?.tienSauGiam);
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
      dataIndex: "giaBan",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
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

  const fetchDataSpct = useCallback(async () => {
    const params = { pageNumber: currentPage - 1, pageSize };
    try {
      const res = await fillData(params);
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
      notificationMessage('success',"Tạo hóa đơn mới thành công !");
      await fetchData();
    } catch (error) {
      console.log(error);
      notificationMessage('error',"Tạo hóa đơn thất bại !");
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
          notificationMessage('error', "Không tìm thấy chi tiết hóa đơn.");
        }
        console.log("Success");
      } else {
        notificationMessage('error', "Không tìm thấy hóa đơn.");
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
        notificationMessage('success', "Cập nhật số lượng thành công!");
      } else {
        notificationMessage('error', "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      notificationMessage('error', "Số lượng vượt quá trong kho !.");
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
        notificationMessage('error', "Cập nhật thất bại!");
      }
    } catch (error) {
      if (!errorShown) {
        notificationMessage('error',
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
      notificationMessage('success', "Xóa hóa đơn chi tiết thành công!");
    } catch (error) {
      console.error("Error deleting invoice detail:", error);
      notificationMessage('error', "Có lỗi xảy ra khi xóa hóa đơn chi tiết.");
    }
  };

  const [selectedSpct, setSelectedSpct] = useState(null);

  const handleProductSelect = (product) => {
    console.log(product);
    if (currentInvoice?.id == null) {
      setIsModalOpen(false);
      notificationMessage('warning', "Vui lòng chọn hóa đơn !");
      return;
    }
    setSelectedSpct(product);
  };

  const addSpctToHoaDon = async () => {
    if (!currentInvoice) {
      notificationMessage('warning', "Vui lòng chọn hóa đơn!");
      return;
    }
    if (!selectedSpct) {
      notificationMessage('warning', "Vui lòng chọn sản phẩm!");
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

      notificationMessage('success', "Đã thêm sản phẩm vào hóa đơn!");
    } catch (error) {
      console.error(error);
      notificationMessage('error', "Số lượng vượt quá trong kho.");
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
      notificationMessage('success', "Thêm khách hàng thành công !");
      setIsCreateCustomer(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form] = Form.useForm();
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState(null);
  const [ship, setShip] = useState(0);
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

  const handleSubmit = async (values) => {
    setCheckoutLoading(true);
    try {
      const hoaDonRequest = {
        idGioHang: values.idGioHang,
        tenNguoiNhan: values.tenNguoiNhan,
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
        width={1200}
        bodyStyle={{
          padding: "20px",
          height: "60vh",
          overflow: "hidden",
          display: "flex",
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
            flex: 1,
            overflowY: "auto",
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
                currentInvoice?.tienSauGiam &&
                !isNaN(currentInvoice?.tienSauGiam)
                  ? currentInvoice?.tienSauGiam.toLocaleString() + " VND"
                  : "0.0 VND"
              }
              // onChange={() => setModalPaymentAmount(localStorage.getItem(currentInvoice?.id))}
              placeholder="Nhập số tiền thanh toán"
            />
          </Form.Item>
          <Divider />
          <Divider />
          <Text strong>
            {/* Khách thanh toán: {partialPayment.toLocaleString()} VND */}
            Khách thanh toán: {localStorage.getItem(currentInvoice?.id)} VND
          </Text>
          <br />
          <Text strong style={{ color: "red" }}>
            {/* Tiền thiếu: {remainingAmount.toLocaleString()} VND */}
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
                    {/* <Text strong>{partialPayment.toLocaleString()} VND</Text> */}
                    <Text strong>
                      {localStorage.getItem(currentInvoice?.id)
                        ? parseFloat(
                            localStorage.getItem(currentInvoice?.id)
                          ).toLocaleString()
                        : "0"}{" "}
                      VND
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
                  onChange={() => {
                    const newLoaiHoaDon =
                      currentInvoice?.loaiHoaDon === "OFFLINE"
                        ? "ONLINE"
                        : "OFFLINE"; // Đảo ngược trạng thái loại hóa đơn
                    changeType(currentInvoice?.id, newLoaiHoaDon); // Giả sử `changeType` là hàm cập nhật lại loại hóa đơn
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
                  onChange: () => selectCustomer(record),
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
                  notificationMessage('error', "Số lượng phải lớn hơn hoặc bằng 1 !");
                  setIsModalOpen(false);
                  setQuantity(1);
                  return;
                } else if (quantity > sanPhamChiTiet?.soLuong) {
                  notificationMessage('error', "Số lượng vượt quá trong kho !");
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
