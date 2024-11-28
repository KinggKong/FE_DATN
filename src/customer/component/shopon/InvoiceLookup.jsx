import React, { useState } from 'react';
import { Input, Button, Card, Table, Tag, message,notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function InvoiceLookup() {
  const [invoiceCode, setInvoiceCode] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!invoiceCode) {
      message.warning('Vui lòng nhập mã hóa đơn');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/shop-on/info-order?maHoaDon=${invoiceCode}`);
      if (response.data && response.data.data) {
        setInvoice(response.data.data);
      } else {
        message.error('Hóa đơn không tồn tại');     
        setInvoice(null);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      message.error('Hóa đơn không tồn tại');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInVietnamese = (status) => {
    const statusMap = {
      WAITING: 'Chờ xác nhận',
      ACCEPTED: 'Đã xác nhận chờ giao hàng',
      SHIPPING: 'Đang giao',
      DONE: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      WAITING: 'blue',
      ACCEPTED: 'cyan',
      SHIPPING: 'orange',
      DONE: 'green',
      CANCELLED: 'red'
    };
    return colorMap[status] || 'default';
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: ['sanPhamChiTietResponse', 'tenSanPham'],
      key: 'tenSanPham',
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
      title: 'Màu sắc',
      dataIndex: ['sanPhamChiTietResponse', 'tenMauSac'],
      key: 'tenMauSac',
    },
    {
      title: 'Kích thước',
      dataIndex: ['sanPhamChiTietResponse', 'tenKichThuoc'],
      key: 'tenKichThuoc',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'giaTien',
      key: 'giaTien',
      render: (text) => `${text.toLocaleString('vi-VN')} ₫`,
    },
  ];

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
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
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
                <p>
                  <strong>Trạng thái:</strong> 
                  <Tag color={getStatusColor(invoice.hoaDonResponse.trangThai)}>
                    {getStatusInVietnamese(invoice.hoaDonResponse.trangThai)}
                  </Tag>
                </p>
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
              <p><strong>Tổng tiền hàng:</strong> {invoice.tongTienHang.toLocaleString('vi-VN')} ₫</p>
              <p><strong>Phí vận chuyển:</strong> {invoice.hoaDonResponse.tienShip.toLocaleString('vi-VN')} ₫</p>
              <p><strong>Giảm giá:</strong> {invoice.hoaDonResponse.soTienGiam.toLocaleString('vi-VN')} ₫</p>
              <p className="text-xl font-bold">
                <strong>Tổng cộng:</strong> {invoice.hoaDonResponse.tienSauGiam.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}