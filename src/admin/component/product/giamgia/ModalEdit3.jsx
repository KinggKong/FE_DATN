import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";

const { Option } = Select;

const ModalEdit3 = ({ isOpen, handleClose, title, handleSubmit, voucher }) => {
  const [newVoucherName, setNewVoucherName] = useState("");
  const [maVoucher, setMaVoucher] = useState("");
  const [giaTriGiam, setGiaTriGiam] = useState("");
  const [giaTriDonHangToiThieu, setGiaTriDonHangToiThieu] = useState("");
  const [giaTriGiamToiDa, setGiaTriGiamToiDa] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState(null);
  const [ngayKetThuc, setNgayKetThuc] = useState(null);
  const [hinhThucGiam, setHinhThucGiam] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [trangThai, setTrangThai] = useState(true); // Trạng thái mặc định là hoạt động

  const handleConfirmEdit = () => {
    const giaTriGiamFloat = parseFloat(giaTriGiam);

    // Kiểm tra điều kiện cho hình thức giảm
    if (hinhThucGiam === "%" && (giaTriGiamFloat <= 0 || giaTriGiamFloat >= 100)) {
      notification.error({
        message: "Lỗi",
        description: "Giá trị giảm phải lớn hơn 0 và nhỏ hơn 100 khi hình thức giảm là %!",
      });
      return;
    }

    if (hinhThucGiam === "VNĐ" && giaTriGiamFloat <= 1000) {
      notification.error({
        message: "Lỗi",
        description: "Giá trị giảm phải lớn hơn 1000 khi hình thức giảm là VNĐ!",
      });
      return;
    }

    if (giaTriGiamFloat <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Giá trị giảm phải lớn hơn 0!",
      });
      return;
    }

    // Kiểm tra số lượng phải lớn hơn hoặc bằng 0, bao gồm 0
    if (parseInt(soLuong, 10) < 0) {
      notification.error({
        message: "Lỗi",
        description: "Số lượng phải lớn hơn hoặc bằng 0!",
      });
      return;
    }

    if (parseFloat(giaTriDonHangToiThieu) <= 0 || parseFloat(giaTriGiamToiDa) <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Tất cả các giá trị phải lớn hơn 0!",
      });
      return;
    }

    if (ngayBatDau && ngayKetThuc && ngayKetThuc.isBefore(ngayBatDau)) {
      notification.error({
        message: "Lỗi",
        description: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!",
      });
      return;
    }

    // Gửi thông tin voucher, nếu số lượng là 0 thì trạng thái sẽ là "Không hoạt động"
    handleSubmit(voucher?.id, {
      tenVoucher: newVoucherName,
      maVoucher,
      giaTriGiam: giaTriGiamFloat,
      giaTriDonHangToiThieu: parseFloat(giaTriDonHangToiThieu),
      giaTriGiamToiDa: parseFloat(giaTriGiamToiDa),
      ngayBatDau: ngayBatDau ? ngayBatDau.format('YYYY-MM-DDTHH:mm:ss') : null,
      ngayKetThuc: ngayKetThuc ? ngayKetThuc.format('YYYY-MM-DDTHH:mm:ss') : null,
      hinhThucGiam,
      soLuong: parseInt(soLuong, 10),
      trangThai: soLuong === "0" ? 0 : trangThai ? 1 : 0, // Trạng thái tự động chuyển thành 0 nếu số lượng là 0
    });
  };

  // Cập nhật trạng thái khi số lượng thay đổi
  useEffect(() => {
    if (soLuong === "0") {
      setTrangThai(false); // Đặt trạng thái là không hoạt động khi số lượng là 0
    } else {
      setTrangThai(true); // Đặt trạng thái là hoạt động khi số lượng không phải là 0
    }
  }, [soLuong]); // Theo dõi thay đổi số lượng

  useEffect(() => {
    if (voucher) {
      setNewVoucherName(voucher.tenVoucher);
      setMaVoucher(voucher.maVoucher);
      setGiaTriGiam(voucher.giaTriGiam);
      setGiaTriDonHangToiThieu(voucher.giaTriDonHangToiThieu);
      setGiaTriGiamToiDa(voucher.giaTriGiamToiDa);
      setNgayBatDau(moment(voucher.ngayBatDau));
      setNgayKetThuc(moment(voucher.ngayKetThuc));
      setHinhThucGiam(voucher.hinhThucGiam);
      setSoLuong(voucher.soLuong);
      setTrangThai(voucher.trangThai === 1);
    }
  }, [voucher]);

  return (
    <Modal
      open={isOpen}
      title={
        <span className="flex">
          <FaEdit style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }} />
          Chỉnh sửa {title}
        </span>
      }
      okType="primary"
      onOk={handleConfirmEdit}
      onCancel={handleClose}
      keyboard={false}
      maskClosable={false}
    >
      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Tên voucher
          </label>
          <Input
            value={newVoucherName}
            onChange={(e) => setNewVoucherName(e.target.value)}
            placeholder="Nhập vào tên voucher"
          />
        </Col>
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
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Giá trị giảm
          </label>
          <Input
            type="number"
            value={giaTriGiam}
            onChange={(e) => setGiaTriGiam(e.target.value)}
            placeholder="Nhập giá trị giảm"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Hình thức giảm
          </label>
          <Select
            value={hinhThucGiam}
            onChange={(value) => setHinhThucGiam(value)}
          >
            <Option value="VNĐ">VNĐ</Option>
            <Option value="%">%</Option>
          </Select>
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2"><span className="text-red-600">*</span>Giá trị đơn hàng tối thiểu</label>
          <Input
            type="number"
            value={giaTriDonHangToiThieu}
            onChange={(e) => setGiaTriDonHangToiThieu(e.target.value)}
            placeholder="Nhập giá trị đơn hàng tối thiểu"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2"><span className="text-red-600">*</span> Giá trị giảm tối đa</label>
          <Input
            type="number"
            value={giaTriGiamToiDa}
            onChange={(e) => setGiaTriGiamToiDa(e.target.value)}
            placeholder="Nhập giá trị giảm tối đa"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Ngày bắt đầu
          </label>
          <DatePicker
            style={{ width: "100%" }}
            value={ngayBatDau}
            onChange={(date) => setNgayBatDau(date)}
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2"><span className="text-red-600">*</span> Số lượng</label>
          <Input
            type="number"
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
            placeholder="Nhập số lượng"
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
            value={ngayKetThuc}
            onChange={(date) => setNgayKetThuc(date)}
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2"><span className="text-red-600">*</span> Trạng thái</label>
          <Switch
            checked={trangThai}
            onChange={(checked) => setTrangThai(checked)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalEdit3;
