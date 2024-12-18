import React, { useState, useEffect } from "react";
import {
  Steps,
  Card,
  Descriptions,
  Button,
  message,
  Typography,
  Breadcrumb,
  Modal,
  notification,
  Image,
  Empty,
  Input,
} from "antd";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  FileProtectOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextStatus, setNextStatus] = useState(null);
  const { id } = useParams();
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      console.log("Stored user info:", storedUserInfo);
      console.log("Parsed user info:", parsedUserInfo);
    } else {
      console.log("No stored user info, using default userId: 1");
    }
  }, []);

  const statusSteps = {
    WAITING: 0,
    ACCEPTED: 1,
    SHIPPING: 2,
    DONE: 3,
    CANCELLED: 4,
  };

  const statusConfig = {
    WAITING: {
      title: "Chờ xác nhận",
      nextAction: "Xác nhận",
      nextStatus: "ACCEPTED",
      showCancel: true,
      icon: <ClockCircleOutlined />,
    },
    ACCEPTED: {
      title: "Đã xác nhận",
      nextAction: "Giao hàng",
      nextStatus: "SHIPPING",
      showCancel: true,
      icon: <FileProtectOutlined />,
    },
    SHIPPING: {
      title: "Đang giao hàng",
      nextAction: "Hoàn thành",
      nextStatus: "DONE",
      showCancel: false,
      icon: <CarOutlined />,
    },
    DONE: {
      title: "Hoàn thành",
      nextAction: null,
      nextStatus: null,
      showCancel: false,
      icon: <CheckCircleOutlined />,
    },
    CANCELLED: {
      title: "Đã hủy",
      nextAction: null,
      nextStatus: null,
      showCancel: false,
      icon: <CloseCircleOutlined />,
    },
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/shop-on/detail-history-bill/${id}`
      );
      if (response.data.code === 1000) {
        setOrderData(response.data.data);
        const currentStatus =
          response.data.data.lichSuHoaDonResponses.length > 0
            ? response.data.data.lichSuHoaDonResponses[
                response.data.data.lichSuHoaDonResponses.length - 1
              ].trangThai
            : response.data.data.hoaDonResponse.trangThai;
        setCurrentStatus(currentStatus);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error("Không thể tải thông tin đơn hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelNote.trim()) {
      message.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/shop-on/update-status-bill",
        {
          idNhanvien: userInfo?.id,
          idHoaDon: orderData.hoaDonResponse.id,
          status: "CANCELLED",
          ghiChu: cancelNote,
        }
      );

      if (response.data.code === 1000) {
        notification.success({
          message: "Success",
          duration: 4,
          pauseOnHover: false,
          showProgress: true,
          description: `Hủy đơn hàng thành công!`,
        });
        setCurrentStatus("CANCELLED");
        setIsCancelModalVisible(false);
        setCancelNote("");
        fetchOrderDetail();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error("Không thể hủy đơn hàng: " + error.message);
    }
  };

  const showModal = (status) => {
    setNextStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/shop-on/update-status-bill",
        {
          idNhanvien: userInfo?.id,
          idHoaDon: orderData.hoaDonResponse.id,
          status: nextStatus,
        }
      );
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
        // Nếu API trả về lỗi nhưng không ném exception
        const errorMessage =
          response.data.message || "Lỗi không xác định từ server";
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Lấy thông báo lỗi từ API hoặc mặc định
      const errorMessage =
        error.response?.data?.message || // Thông báo từ server
        error.message || // Thông báo lỗi từ client
        "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại."; // Thông báo mặc định

      // Hiển thị thông báo lỗi
      message.error(`Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`);
      console.error("Error details:", error); // Log lỗi chi tiết để debug
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
    const historyItem = lichSuHoaDonResponses.find(
      (item) => item.trangThai === status
    );
    return {
      title: statusConfig[status].title,
      icon: statusConfig[status].icon,
      description: historyItem ? (
        <>
          <Text type="secondary" className="text-xs block">
            {new Date(historyItem.createdAt).toLocaleString()}
          </Text>
          {statusSteps[status] >= statusSteps.ACCEPTED && (
            <Text type="secondary" className="text-xs">
              Created by: {historyItem.createdBy}
            </Text>
          )}
        </>
      ) : null,
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
          status={currentStatus === "CANCELLED" ? "error" : "process"}
        />
      </Card>

      <div className="flex justify-between mb-6">
        {currentConfig.showCancel && (
          <Button danger onClick={() => setIsCancelModalVisible(true)}>
            Hủy
          </Button>
        )}
        {currentConfig.nextAction && (
          <Button
            type="primary"
            className="bg-blue-500"
            onClick={() => showModal(currentConfig.nextStatus)}
          >
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
          <Descriptions.Item label="Loại đơn hàng">
            {hoaDonResponse.loaiHoaDon}
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            {hoaDonResponse.tienShip.toLocaleString()}đ
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {hoaDonResponse.tongTien.toLocaleString()}đ
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {hoaDonResponse.soTienGiam.toLocaleString()}đ
          </Descriptions.Item>
          <Descriptions.Item label="Phải thanh toán">
            <span className="text-red-600 font-bold">
              {hoaDonResponse.tienSauGiam.toLocaleString()}đ
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức thanh toán">
            {hoaDonResponse.hinhThucThanhToan}
          </Descriptions.Item>
          {lichSuHoaDonResponses.some(
            (item) => item.trangThai === "CANCELLED"
          ) && (
            <Descriptions.Item label="Ghi chú hủy đơn">
              {
                lichSuHoaDonResponses.find(
                  (item) => item.trangThai === "CANCELLED"
                )?.ghiChu
              }
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card className="mb-6" title="THÔNG TIN KHÁCH HÀNG">
        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Tên khách hàng">
            {hoaDonResponse.tenNguoiNhan}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {hoaDonResponse.sdt}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {hoaDonResponse.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {hoaDonResponse.diaChiNhan}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {hoaDonResponse.ghiChu}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <div className="flex justify-between items-center">
            <Title level={4}>Danh sách sản phẩm</Title>
            <Text className="text-gray-500">
              Tổng {orderData?.hoaDonChiTietResponses?.length || 0} sản phẩm
            </Text>
          </div>
        }
        className="mb-8 shadow-sm"
      >
        {orderData?.hoaDonChiTietResponses?.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 py-4 border-b last:border-b-0"
          >
            <Image
              src={item.sanPhamChiTietResponse.hinhAnhList[0]?.url}
              alt={item.sanPhamChiTietResponse.tenSanPham}
              width={100}
              height={100}
              className="object-cover rounded"
              fallback="/placeholder.png"
            />
            <div className="flex-grow">
              <Title level={5} className="mb-2">
                {item.sanPhamChiTietResponse.tenSanPham}
              </Title>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <Text>Màu sắc: {item.sanPhamChiTietResponse.tenMauSac}</Text>
                <Text>Số lượng: {item.soLuong}</Text>
                <Text>
                  Kích thước: {item.sanPhamChiTietResponse.tenKichThuoc}
                </Text>
                <Text>Giá tiền: {item.giaTien.toLocaleString()}đ</Text>
              </div>
              <Text strong className="mt-2 block">
                Thành tiền: {(item.giaTien * item.soLuong).toLocaleString()}đ
              </Text>
            </div>
          </div>
        ))}
      </Card>

      <Card
        className="mb-6"
        title={<Title level={4}>Lịch sử thanh toán</Title>}
        className="mb-8 shadow-sm"
      >
        {orderData?.lichSuThanhToanResponse ? (
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Text className="text-gray-500 block mb-1">Mã hóa đơn</Text>
              <div className="font-medium">
                {orderData.lichSuThanhToanResponse.maHoaDon}
              </div>
            </div>
            <div>
              <Text className="text-gray-500 block mb-1">Số tiền</Text>
              <div className="font-medium">
                {orderData.lichSuThanhToanResponse.soTien.toLocaleString()}đ
              </div>
            </div>
            <div>
              <Text className="text-gray-500 block mb-1">Phương thức</Text>
              <div className="font-medium">
                {(() => {
                  const methodMap = {
                    COD: "Thanh toán khi nhận hàng",
                    VNPAY: "VNPay",
                    MOMO: "Momo",
                  };
                  return (
                    methodMap[
                      orderData.lichSuThanhToanResponse.paymentMethod
                    ] || orderData.lichSuThanhToanResponse.paymentMethod
                  );
                })()}
              </div>
            </div>
            <div>
              <Text className="text-gray-500 block mb-1">
                Thời gian thanh toán
              </Text>
              <div className="font-medium">
                {new Date(
                  orderData.lichSuThanhToanResponse.createdAt
                ).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>
            <div>
              <Text className="text-gray-500 block mb-1">Trạng thái</Text>
              <div>
                {(() => {
                  const statusMap = {
                    DONE: "Thành công",
                    PENDING: "Đang xử lý",
                    FAILED: "Thất bại",
                  };
                  const colorMap = {
                    DONE: "text-green-600",
                    PENDING: "text-yellow-600",
                    FAILED: "text-red-600",
                  };
                  const status = orderData.lichSuThanhToanResponse.status;
                  return (
                    <span className={`font-medium ${colorMap[status] || ""}`}>
                      {statusMap[status] || status}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          <Empty description="Chưa có lịch sử thanh toán" />
        )}
      </Card>

      <Modal
        title="Xác nhận thay đổi trạng thái"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "
          {statusConfig[nextStatus]?.title}"?
        </p>
      </Modal>
      <Modal
        title="Hủy đơn hàng"
        visible={isCancelModalVisible}
        onOk={handleCancelOrder}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setCancelNote("");
        }}
        okText="Xác nhận"
        cancelText="Đóng"
      >
        <div className="space-y-4">
          <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
          <div>
            <Text strong className="block mb-2">
              Lý do hủy đơn hàng
            </Text>
            <Input.TextArea
              rows={4}
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
