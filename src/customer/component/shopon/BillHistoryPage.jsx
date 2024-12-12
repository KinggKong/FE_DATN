import React, { useState, useEffect } from 'react';
import { List, Card, Modal, Spin, message, Button, Input, Pagination } from 'antd';
import { CalendarOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import axios from 'axios';

const BillHistoryPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [cancellingBillId, setCancellingBillId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBills, setTotalBills] = useState(0);

  const pageSize = 10; // Fixed page size

  useEffect(() => {
    fetchBills();
  }, [currentPage]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/shop-on/history-bill/1`, {
        params: {
          pageNumber: currentPage,
          pageSize: pageSize
        }
      });
      if (response.data && response.data.code === 1000) {
        setBills(response.data.data.content);
        setTotalBills(response.data.data.totalElements);
      } else {
        throw new Error('Không thể lấy lịch sử hóa đơn');
      }
    } catch (error) {
      console.error('Lỗi khi lấy hóa đơn:', error);
      message.error('Không thể lấy lịch sử hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const showBillDetails = (bill) => {
    setSelectedBill(bill);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const statusMap = {
    'WAITING': 'Chờ xác nhận',
    'ACCEPTED': 'Đã xác nhận',
    'SHIPPING': 'Đang giao hàng',
    'DONE': 'Hoàn thành',
    'CANCELLED': 'Đã hủy'
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'WAITING': 'text-yellow-500',
      'ACCEPTED': 'text-blue-500',
      'SHIPPING': 'text-purple-500',
      'DONE': 'text-green-500',
      'CANCELLED': 'text-red-500'
    };
    return colorMap[status] || 'text-gray-500';
  };

  const showCancelModal = (billId) => {
    setCancellingBillId(billId);
    setIsCancelModalVisible(true);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/shop-on/update-status-bill",
        {        
          idHoaDon: cancellingBillId,
          status: 'CANCELLED',
          ghiChu: cancelNote
        }
      );
      if (response.data && response.data.code === 1000) {
        message.success('Đã hủy đơn hàng thành công');
        fetchBills();
      } else {
        throw new Error('Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      message.error('Không thể hủy đơn hàng');
    } finally {
      setIsCancelModalVisible(false);
      setCancelNote("");
      setCancellingBillId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Lịch sử hóa đơn</h1>
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={bills}
          renderItem={(bill) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => showBillDetails(bill)}
                className="w-full shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{bill.maHoaDon}</span>
                    <span className={`font-medium ${getStatusColor(bill.trangThai)}`}>
                      {statusMap[bill.trangThai]}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarOutlined className="mr-2" />
                    <span>{formatDate(bill.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserOutlined className="mr-2" />
                    <span>{bill.tenNguoiNhan}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CreditCardOutlined className="mr-2" />
                    <span>{bill.hinhThucThanhToan}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-blue-600">{formatCurrency(bill.tongTien)}</span>
                    {(bill.trangThai === 'WAITING' || bill.trangThai === 'ACCEPTED') && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showCancelModal(bill.id);
                        }}
                        danger
                        size="small"
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Spin>

      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalBills}
          onChange={(page) => setCurrentPage(page)}
          showQuickJumper
          showTotal={(total) => `Tổng ${total} hóa đơn`}
        />
      </div>

      <Modal
        title={<h2 className="text-2xl font-bold text-gray-800">Chi tiết hóa đơn</h2>}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        className="bill-detail-modal"
      >
        {selectedBill && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Mã hóa đơn:</p>
                  <p>{selectedBill.maHoaDon}</p>
                </div>
                <div>
                  <p className="font-medium">Trạng thái:</p>
                  <p className={getStatusColor(selectedBill.trangThai)}>{statusMap[selectedBill.trangThai]}</p>
                </div>
                <div>
                  <p className="font-medium">Người nhận:</p>
                  <p>{selectedBill.tenNguoiNhan}</p>
                </div>
                <div>
                  <p className="font-medium">Số điện thoại:</p>
                  <p>{selectedBill.sdt}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Địa chỉ:</p>
                  <p>{selectedBill.diaChiNhan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Chi tiết thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Tổng tiền:</p>
                  <p className="text-blue-600 font-bold">{formatCurrency(selectedBill.tongTien)}</p>
                </div>
                <div>
                  <p className="font-medium">Tiền sau giảm:</p>
                  <p>{formatCurrency(selectedBill.tienSauGiam)}</p>
                </div>
                <div>
                  <p className="font-medium">Phí vận chuyển:</p>
                  <p>{formatCurrency(selectedBill.tienShip)}</p>
                </div>
                <div>
                  <p className="font-medium">Phương thức thanh toán:</p>
                  <p>{selectedBill.hinhThucThanhToan}</p>
                </div>
                {selectedBill.maVoucher && (
                  <div>
                    <p className="font-medium">Mã giảm giá:</p>
                    <p>{selectedBill.maVoucher}</p>
                  </div>
                )}
                {selectedBill.soTienGiam > 0 && (
                  <div>
                    <p className="font-medium">Số tiền giảm:</p>
                    <p>{formatCurrency(selectedBill.soTienGiam)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Sản phẩm</h3>
              <List
                dataSource={selectedBill.hoaDonChiTietResponse}
                renderItem={(item) => (
                  <List.Item className="border-b last:border-b-0 py-4">
                    <div className="flex w-full">
                      <img
                        src={item.sanPhamChiTietResponse.hinhAnhList[0]?.url || 'https://via.placeholder.com/100'}
                        alt={item.sanPhamChiTietResponse.tenSanPham}
                        className="w-24 h-24 object-cover mr-4 rounded-md"
                      />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-lg">{item.sanPhamChiTietResponse.tenSanPham}</h4>
                        <p className="text-gray-600">Màu sắc: {item.sanPhamChiTietResponse.tenMauSac}</p>
                        <p className="text-gray-600">Kích thước: {item.sanPhamChiTietResponse.tenKichThuoc}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-600">Số lượng: {item.soLuong}</p>
                          <p className="font-bold text-blue-600">{formatCurrency(item.giaTien)}</p>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {selectedBill.ghiChu && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Ghi chú</h3>
                <p>{selectedBill.ghiChu}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={<h3 className="text-xl font-bold text-gray-800">Hủy đơn hàng</h3>}
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
          <p className="text-red-500 font-medium">Bạn có chắc chắn muốn hủy đơn hàng này?</p>
          <div>
            <p className="font-medium mb-2">Lý do hủy đơn hàng</p>
            <Input.TextArea
              rows={4}
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              className="w-full"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillHistoryPage;

