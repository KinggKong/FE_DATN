import { Modal, notification } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";

const ModalEdit3 = ({ isOpen, handleClose, title, handleSubmit, voucher }) => {
  const [newVoucherName, setNewVoucherName] = useState("");
  const [maVoucher, setMaVoucher] = useState("");
  const [giaTriGiam, setGiaTriGiam] = useState("");
  const [giaTriDonHangToiThieu, setGiaTriDonHangToiThieu] = useState("");
  const [giaTriGiamToiDa, setGiaTriGiamToiDa] = useState(""); // Thêm trường này
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [hinhThucGiam, setHinhThucGiam] = useState(""); 
  const [soLuong, setSoLuong] = useState(""); 
  const [trangThai, setTrangThai] = useState(""); 

  const handleConfirmEdit = () => {
    // Kiểm tra các giá trị
    if (parseFloat(giaTriGiam) <= 0 || parseFloat(giaTriDonHangToiThieu) <= 0 || parseFloat(giaTriGiamToiDa) <= 0 || parseInt(soLuong, 10) <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Tất cả các giá trị phải lớn hơn 0!",
      });
      return;
    }

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    if (ngayBatDau && ngayKetThuc && new Date(ngayKetThuc) < new Date(ngayBatDau)) {
      notification.error({
        message: "Lỗi",
        description: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!",
      });
      return;
    }

    handleSubmit(voucher?.id, {
      tenVoucher: newVoucherName,
      maVoucher,
      giaTriGiam: parseFloat(giaTriGiam),
      giaTriDonHangToiThieu: parseFloat(giaTriDonHangToiThieu),
      giaTriGiamToiDa: parseFloat(giaTriGiamToiDa),
      ngayBatDau,
      ngayKetThuc,
      hinhThucGiam,
      soLuong: parseInt(soLuong, 10),
      trangThai,
    });
  };

  useEffect(() => {
    if (voucher) {
      setNewVoucherName(voucher.tenVoucher);
      setMaVoucher(voucher.maVoucher);
      setGiaTriGiam(voucher.giaTriGiam);
      setGiaTriDonHangToiThieu(voucher.giaTriDonHangToiThieu);
      setGiaTriGiamToiDa(voucher.giaTriGiamToiDa);
      setNgayBatDau(voucher.ngayBatDau);
      setNgayKetThuc(voucher.ngayKetThuc);
      setHinhThucGiam(voucher.hinhThucGiam);
      setSoLuong(voucher.soLuong);
      setTrangThai(voucher.trangThai);
    }
  }, [voucher]);

  return (
    <Modal
      open={isOpen}
      title={
        <span className="flex">
          <FaEdit
            style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
          />
          Chỉnh sửa {title}
        </span>
      }
      okType="primary"
      onOk={handleConfirmEdit}
      onCancel={handleClose}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
      keyboard={false}
      maskClosable={false}
    >
      <div className="mb-4">
        <label>Tên voucher</label>
        <input
          onChange={(e) => setNewVoucherName(e.target.value)}
          value={newVoucherName}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Mã voucher</label>
        <input
          onChange={(e) => setMaVoucher(e.target.value)}
          value={maVoucher}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Giá trị giảm</label>
        <input
          type="number"
          onChange={(e) => setGiaTriGiam(e.target.value)}
          value={giaTriGiam}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Giá trị đơn hàng tối thiểu</label>
        <input
          type="number"
          onChange={(e) => setGiaTriDonHangToiThieu(e.target.value)}
          value={giaTriDonHangToiThieu}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Giá trị giảm tối đa</label>
        <input
          type="number"
          onChange={(e) => setGiaTriGiamToiDa(e.target.value)}
          value={giaTriGiamToiDa}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Ngày bắt đầu</label>
        <input
          type="datetime-local"
          onChange={(e) => setNgayBatDau(e.target.value)}
          value={ngayBatDau}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Ngày kết thúc</label>
        <input
          type="datetime-local"
          onChange={(e) => setNgayKetThuc(e.target.value)}
          value={ngayKetThuc}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Hình thức giảm</label>
        <input
          onChange={(e) => setHinhThucGiam(e.target.value)}
          value={hinhThucGiam}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Số lượng</label>
        <input
          type="number"
          onChange={(e) => setSoLuong(e.target.value)}
          value={soLuong}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
      <div className="mb-4">
        <label>Trạng thái</label>
        <input
          onChange={(e) => setTrangThai(e.target.value)}
          value={trangThai}
          className="w-full border rounded-sm h-8 p-4"
        />
      </div>
    </Modal>
  );
};

export default ModalEdit3;
