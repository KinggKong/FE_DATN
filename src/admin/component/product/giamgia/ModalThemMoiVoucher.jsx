import { Modal, Row, Col, Input, DatePicker, Select } from "antd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useState } from "react";

const ModalThemMoi = ({ isOpen, handleClose, title, handleSubmit }) => {
  const [tenVoucher, setTenVoucher] = useState('');
  const [maVoucher, setMaVoucher] = useState('');
  const [giaTriGiam, setGiaTriGiam] = useState(null);
  const [hinhThucGiam, setHinhThucGiam] = useState('VND'); // Mặc định chọn "VNĐ"
  const [ngayBatDau, setNgayBatDau] = useState(null);
  const [ngayKetThuc, setNgayKetThuc] = useState(null);
  const [trangThai, setTrangThai] = useState(1); // Thay đổi trạng thái mặc định thành 1
  const [soLuong, setSoLuong] = useState(null);
  const [giaTriDonHangToiThieu, setGiaTriDonHangToiThieu] = useState(null);
  const [giaTriGiamToiDa, setGiaTriGiamToiDa] = useState(null);

  const handleConfirmAdd = () => {
    const newVoucher = {
      tenVoucher,
      maVoucher,
      giaTriGiam,
      hinhThucGiam,
      ngayBatDau,
      ngayKetThuc,
      trangThai,
      soLuong,
      giaTriDonHangToiThieu,
      giaTriGiamToiDa,
    };
    handleSubmit(newVoucher);
  };

  return (
    <Modal
      open={isOpen}
      title={
        <span className="flex">
          <IoMdAddCircleOutline
            style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
          />
          Thêm mới {title}
        </span>
      }
      width={1000}
      okType="primary"
      onOk={handleConfirmAdd}
      onCancel={handleClose}
      keyboard={false}
      maskClosable={false}
    >
      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm inline-block mb-2">
            <span className="text-red-600">*</span> Tên voucher
          </label>
          <Input
            value={tenVoucher}
            onChange={(e) => setTenVoucher(e.target.value)}
            placeholder="Nhập vào tên voucher"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">Số lượng</label>
          <Input
            type="number"
            value={soLuong}
            onChange={(e) => setSoLuong(parseInt(e.target.value))}
            placeholder="Nhập số lượng"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Mã voucher
          </label>
          <Input
            value={maVoucher}
            onChange={(e) => setMaVoucher(e.target.value)}
            placeholder="Nhập mã voucher"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Giá trị giảm
          </label>
          <Input
            type="number"
            value={giaTriGiam}
            onChange={(e) => setGiaTriGiam(parseFloat(e.target.value))}
            placeholder="Nhập giá trị giảm"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Hình thức giảm
          </label>
          <Select
            value={hinhThucGiam}
            onChange={setHinhThucGiam}
            placeholder="Chọn hình thức giảm"
            style={{ width: "100%" }}
          >
            <Select.Option value="VND">VNĐ</Select.Option>
            <Select.Option value="%">%</Select.Option>
          </Select>
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Ngày bắt đầu
          </label>
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date) => setNgayBatDau(date)}
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Ngày kết thúc
          </label>
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date) => setNgayKetThuc(date)}
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            Giá trị đơn hàng tối thiểu
          </label>
          <Input
            type="number"
            value={giaTriDonHangToiThieu}
            onChange={(e) => setGiaTriDonHangToiThieu(parseFloat(e.target.value))}
            placeholder="Nhập giá trị đơn hàng tối thiểu"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">Giá trị giảm tối đa</label>
          <Input
            type="number"
            value={giaTriGiamToiDa}
            onChange={(e) => setGiaTriGiamToiDa(parseFloat(e.target.value))}
            placeholder="Nhập giá trị giảm tối đa"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">Trạng thái</label>
          <Select
            value={trangThai}
            onChange={(value) => setTrangThai(value)}
            style={{ width: "100%" }}
            placeholder="Chọn trạng thái"
          >
            <Select.Option value={1}>Hoạt động</Select.Option>
            <Select.Option value={0}>Không hoạt động</Select.Option>
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalThemMoi;
