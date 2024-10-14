import React, { useState, useEffect } from 'react';
import { Layout, Button, Table, Tabs, Modal, Input, notification, Select } from 'antd';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const POS = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('Nhân viên 1');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [moneyGiven, setMoneyGiven] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState('');

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Nếu cần định dạng lại dữ liệu
        const formattedData = data.map(product => ({
          ...product,
          quantity: 0, // thêm thuộc tính số lượng
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        notification.error({ message: 'Lỗi', description: 'Không thể lấy dữ liệu sản phẩm.' });
      }
    };

    fetchProducts();
  }, []);

  const handleInvoiceCreation = () => {
    const pendingInvoices = invoices.filter(invoice => !invoice.paid);
    if (pendingInvoices.length >= 5) {
      notification.warning({
        message: 'Giới hạn hóa đơn',
        description: 'Bạn chỉ có thể tạo tối đa 5 hóa đơn chưa thanh toán!',
      });
      return;
    }
    const newInvoiceKey = (invoices.length > 0 ? Math.max(...invoices.map(invoice => parseInt(invoice.key))) + 1 : 1).toString();
    setInvoices([...invoices, { key: newInvoiceKey, items: [], paid: false }]);
    setActiveKey(newInvoiceKey);
    setCustomerPhone('');
    setSelectedEmployee('Nhân viên 1');
    setPaymentMethod('');
    setMoneyGiven(0);
    setSelectedVoucher('');
  };

  const addToCart = (product) => {
    const newInvoices = [...invoices];
    const currentInvoice = newInvoices.find(invoice => invoice.key === activeKey);

    if (currentInvoice && !currentInvoice.paid) {
      const existingItem = currentInvoice.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentInvoice.items.push({ ...product, quantity: 1 });
      }
      setInvoices(newInvoices);
      notification.success({
        message: 'Thêm vào hóa đơn',
        description: `${product.tenSanPham} đã được thêm vào hóa đơn!`,
      });
    }
  };

  const removeFromCart = (id) => {
    const currentInvoice = invoices.find(invoice => invoice.key === activeKey);
    if (currentInvoice && !currentInvoice.paid) {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
        onOk: () => {
          const newInvoices = [...invoices];
          currentInvoice.items = currentInvoice.items.filter(item => item.id !== id);
          setInvoices(newInvoices);
          notification.success({
            message: 'Xóa sản phẩm',
            description: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
          });
        },
        onCancel: () => {
          notification.info({
            message: 'Đã hủy',
            description: 'Bạn đã hủy việc xóa sản phẩm.',
          });
        },
      });
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
  };

  const saveEditQuantity = () => {
    const newInvoices = [...invoices];
    const currentInvoice = newInvoices.find(invoice => invoice.key === activeKey);
    if (currentInvoice && !currentInvoice.paid) {
      const existingItem = currentInvoice.items.find(item => item.id === editItem.id);
      if (existingItem) {
        existingItem.quantity = editQuantity;
      }
      setInvoices(newInvoices);
      notification.success({
        message: 'Chỉnh sửa thành công',
        description: `Số lượng của ${editItem.tenSanPham} đã được cập nhật!`,
      });
      setEditItem(null);
    }
  };

  const handlePayment = () => {
    const currentInvoice = invoices.find(invoice => invoice.key === activeKey);
    if (currentInvoice && currentInvoice.items.length > 0) {
      const total = currentInvoice.items.reduce((total, item) => total + item.price * item.quantity, 0);
      Modal.confirm({
        title: 'Xác nhận thanh toán',
        content: `Bạn có chắc chắn muốn thanh toán hóa đơn với tổng số tiền: ${total} VNĐ?`,
        onOk: () => {
          notification.success({
            message: 'Thanh toán thành công',
            description: `Hóa đơn đã được thanh toán với tổng số tiền: ${total} VNĐ!`,
          });
          currentInvoice.paid = true;
          setActiveKey(invoices.length > 1 ? invoices[0].key : "1");
        },
        onCancel: () => {
          notification.info({
            message: 'Đã hủy thanh toán',
            description: 'Bạn đã hủy thanh toán hóa đơn.',
          });
        },
      });
    } else {
      notification.warning({
        message: 'Lỗi',
        description: 'Không có sản phẩm trong hóa đơn để thanh toán!',
      });
    }
  };

  const handleCancelInvoice = () => {
    const currentInvoice = invoices.find(invoice => invoice.key === activeKey);
    if (currentInvoice && !currentInvoice.paid) {
      Modal.confirm({
        title: 'Xác nhận hủy hóa đơn',
        content: `Bạn có chắc chắn muốn hủy hóa đơn ${currentInvoice.key}?`,
        onOk: () => {
          const updatedInvoices = invoices.filter(invoice => invoice.key !== activeKey);
          setInvoices(updatedInvoices);
          if (updatedInvoices.length > 0) {
            setActiveKey(updatedInvoices[0].key);
          } else {
            setActiveKey("1");
          }
          notification.success({
            message: 'Hủy hóa đơn thành công',
            description: `Hóa đơn ${currentInvoice.key} đã được hủy.`,
          });
        },
      });
    } else {
      notification.warning({
        message: 'Lỗi',
        description: 'Hóa đơn đã thanh toán không thể hủy!',
      });
    }
  };

  const productColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'tenSanPham', key: 'tenSanPham' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: price => `${price} VNĐ` },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button type="link" onClick={() => addToCart(record)}>
          <FaEdit className="size-5" />
        </Button>
      ),
    },
  ];

  const invoiceColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'tenSanPham', key: 'tenSanPham' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: price => `${price} VNĐ` },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
          {!invoices.find(invoice => invoice.key === activeKey).paid && (
            <>
              <Button type="link" onClick={() => openEditModal(record)}>
                <FaEdit className="size-5" />
              </Button>
              <Button type="link" danger onClick={() => removeFromCart(record.id)}>
                <MdDelete className="size-5" />
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Layout>
      <Header style={{ color: 'white', fontSize: '24px' }}>Hệ thống Bán Hàng Tại Quầy</Header>
      <Content style={{ padding: '20px' }}>
        <Button type="primary" onClick={handleInvoiceCreation} style={{ marginBottom: '20px' }}>
          Tạo hóa đơn
        </Button>

        <Table
          dataSource={currentProducts}
          columns={productColumns}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: products.length,
            onChange: (page) => setCurrentPage(page),
          }}
          title={() => 'Danh sách sản phẩm'}
        />

        <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ marginTop: '20px' }}>
          {invoices.map(invoice => (
            <TabPane
              tab={<span style={{ color: invoice.paid ? 'red' : 'black' }}>Hóa đơn {invoice.key}</span>}
              key={invoice.key}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Table
                    dataSource={invoice.items}
                    columns={invoiceColumns}
                    rowKey="id"
                    pagination={{
                      pageSize: itemsPerPage,
                      total: invoice.items.length,
                      showSizeChanger: false,
                    }}
                  />
                </div>

                <div style={{ width: '300px', marginLeft: '20px', border: '1px solid #ddd', padding: '10px' }}>
                  <h4 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', margin: '20px 0', color: invoice.paid ? 'red' : 'black' }}>
                    Thông tin thanh toán
                  </h4>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Mã hóa đơn:</label>
                    <span style={{ marginLeft: '10px' }}>{invoice.key}</span>
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Số điện thoại khách:</label>
                    <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} disabled={invoice.paid} />
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Tên nhân viên:</label>
                    <Select value={selectedEmployee} onChange={(value) => setSelectedEmployee(value)} style={{ width: '100%', marginTop: '5px' }} disabled={invoice.paid}>
                      {/* Giả sử bạn có danh sách nhân viên từ API */}
                      <Option value="Nhân viên 1">Nhân viên 1</Option>
                      <Option value="Nhân viên 2">Nhân viên 2</Option>
                    </Select>
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Hình thức thanh toán:</label>
                    <Select value={paymentMethod} onChange={(value) => setPaymentMethod(value)} style={{ width: '100%', marginTop: '5px' }} disabled={invoice.paid}>
                      <Option value="cash">Tiền mặt</Option>
                      <Option value="creditCard">Thẻ tín dụng</Option>
                      <Option value="bankTransfer">Chuyển khoản ngân hàng</Option>
                    </Select>
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Tiền khách đưa:</label>
                    <Input type="number" value={moneyGiven} onChange={(e) => setMoneyGiven(e.target.value)} disabled={invoice.paid} />
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Voucher:</label>
                    <Select value={selectedVoucher} onChange={(value) => setSelectedVoucher(value)} style={{ width: '100%', marginTop: '5px' }} disabled={invoice.paid}>
                      <Option value="20percent">20% Giảm giá</Option>
                    </Select>
                  </div>
                  <div style={{ marginBottom: '10px', color: invoice.paid ? 'red' : 'black' }}>
                    <label>Tiền thừa:</label>
                    <Input type="number" value={moneyGiven - invoice.items.reduce((total, item) => total + item.price * item.quantity, 0)} readOnly />
                  </div>
                  <h4 style={{ color: invoice.paid ? 'red' : 'black' }}>
                    Tổng tiền: {invoice.items.reduce((total, item) => total + item.price * item.quantity, 0)} VNĐ
                  </h4>
                  <Button type="primary" onClick={handlePayment} disabled={invoice.paid}>
                    Thanh toán
                  </Button>
                  <Button type="danger" onClick={handleCancelInvoice} disabled={invoice.paid} style={{ marginTop: '10px' }}>
                    Hủy hóa đơn
                  </Button>
                </div>
              </div>
            </TabPane>
          ))}
        </Tabs>

        {editItem && (
          <Modal
            title={`Chỉnh sửa số lượng: ${editItem.tenSanPham}`}
            visible={!!editItem}
            onOk={saveEditQuantity}
            onCancel={() => setEditItem(null)}
          >
            <Input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(parseInt(e.target.value))}
            />
          </Modal>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Cửa hàng của bạn</Footer>
    </Layout>
  );
};

export default POS;
