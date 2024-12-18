import React, { useState } from "react";
import { Input, Button, Card, Table, Tag, message, notification,Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

export default function InvoiceLookup() {
  const [invoiceCode, setInvoiceCode] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState('');

  const handleSearch = async () => {
    if (!invoiceCode) {
      message.warning("Vui lòng nhập mã hóa đơn");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/shop-on/info-order?maHoaDon=${invoiceCode}`
      );
      if (response.data && response.data.data) {
        setInvoice(response.data.data);
      } else {
        message.error("Hóa đơn không tồn tại");
        setInvoice(null);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      message.error("Hóa đơn không tồn tại");
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInVietnamese = (status) => {
    const statusMap = {
      WAITING: "Chờ xác nhận",
      ACCEPTED: "Đã xác nhận chờ giao hàng",
      SHIPPING: "Đang giao",
      DONE: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      WAITING: "blue",
      ACCEPTED: "cyan",
      SHIPPING: "orange",
      DONE: "green",
      CANCELLED: "red",
    };
    return colorMap[status] || "default";
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["sanPhamChiTietResponse", "tenSanPham"],
      key: "tenSanPham",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.sanPhamChiTietResponse.hinhAnhList[0].url}
            alt={text}
            className="w-12 h-12 object-cover rounded mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: ["sanPhamChiTietResponse", "tenMauSac"],
      key: "tenMauSac",
    },
    {
      title: "Kích thước",
      dataIndex: ["sanPhamChiTietResponse", "tenKichThuoc"],
      key: "tenKichThuoc",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      key: "giaTien",
      render: (text) => `${text.toLocaleString("vi-VN")} ₫`,
    },
  ];

  const handleCancelOrder = async () => {
    if (!cancelNote.trim()) {
      message.error('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/shop-on/update-status-bill",
        {        
          idHoaDon: invoice.hoaDonResponse.id,
          status: 'CANCELLED',
          ghiChu: cancelNote
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
        handleSearch();
        setIsCancelModalVisible(false);
        setCancelNote('');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error('Không thể hủy đơn hàng: '+ error.response?.data?.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tra cứu hóa đơn</h1>
      <div className="flex justify-center mb-8">
        <Input
          placeholder="Nhập mã hóa đơn"
          value={invoiceCode}
          onChange={(e) => setInvoiceCode(e.target.value)}
          className="w-64 mr-2"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
        >
          Tìm kiếm
        </Button>
      </div>

      {invoice && (
        <div className="space-y-8">
          <Card title="Thông tin hóa đơn" className="shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Mã hóa đơn:</strong> {invoice.hoaDonResponse.maHoaDon}</p>
                <p><strong>Tên khách hàng:</strong> {invoice.hoaDonResponse.tenKhachHang}</p>
                <p><strong>Số điện thoại:</strong> {invoice.hoaDonResponse.sdt}</p>
                <p><strong>Email:</strong> {invoice.hoaDonResponse.email}</p>
              </div>
              <div>
                <p><strong>Địa chỉ nhận:</strong> {invoice.hoaDonResponse.diaChiNhan}</p>
                <p><strong>Hình thức thanh toán:</strong> {invoice.hoaDonResponse.hinhThucThanhToan.toUpperCase()}</p>
                <div className="flex items-center justify-between">
                  <p className="flex items-center">
                    <strong>Trạng thái:</strong>&nbsp;
                    <Tag color={getStatusColor(invoice.hoaDonResponse.trangThai)}>
                      {getStatusInVietnamese(invoice.hoaDonResponse.trangThai)}
                    </Tag>
                  </p>
                  {(invoice.hoaDonResponse.trangThai === 'WAITING' || 
                    invoice.hoaDonResponse.trangThai === 'ACCEPTED') && (
                    <Button 
                      danger
                      onClick={() => setIsCancelModalVisible(true)}
                    >
                      Hủy đơn hàng
                    </Button>
                  )}
                </div>
                <p><strong>Ghi chú:</strong> {invoice.hoaDonResponse.ghiChu}</p>
              </div>
            </div>
          </Card>

          <Card title="Chi tiết đơn hàng" className="shadow-md">
            <Table
              columns={columns}
              dataSource={invoice.hoaDonChiTietResponse}
              rowKey="id"
              pagination={false}
            />
            <div className="mt-4 text-right">
              <p>
                <strong>Tổng tiền hàng:</strong>{" "}
                {invoice.tongTienHang.toLocaleString("vi-VN")} ₫
              </p>
              <p>
                <strong>Phí vận chuyển:</strong>{" "}
                {invoice.hoaDonResponse.tienShip.toLocaleString("vi-VN")} ₫
              </p>
              <p>
                <strong>Giảm giá:</strong>{" "}
                {invoice.hoaDonResponse.soTienGiam.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-xl font-bold">
                <strong>Tổng cộng:</strong>{" "}
                {invoice.hoaDonResponse.tienSauGiam.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </Card>
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
                <p className="font-medium mb-2">Lý do hủy đơn hàng</p>
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
      )}
    </div>
  );
}
