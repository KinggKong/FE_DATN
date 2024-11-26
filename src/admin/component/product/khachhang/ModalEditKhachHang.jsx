import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Upload, Image } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons"; 
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const { Option } = Select;

const ModalEditKhachHang = ({ isOpen, handleClose, title, handleSubmit, khachHang }) => {
  const [ten, setTen] = useState("");
  const [ma, setMa] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaySinh, setNgaySinh] = useState(null);
  const [gioiTinh, setGioiTinh] = useState(true); // true for male, false for female
  const [trangThai, setTrangThai] = useState(true); // Default to active
  const [idTaiKhoan, setIdTaiKhoan] = useState(""); // Account ID
  const [idDiaChi, setIdDiaChi] = useState(""); // Address ID
  const [fileList, setFileList] = useState([]); // State để lưu file tải lên (avatar)

  useEffect(() => {
    if (khachHang) {
      setTen(khachHang.ten);
      setMa(khachHang.ma);
      setEmail(khachHang.email);
      setSdt(khachHang.sdt);
      setNgaySinh(moment(khachHang.ngaySinh));
      setGioiTinh(khachHang.gioiTinh);  // true for male, false for female
      setIdTaiKhoan(khachHang.idTaiKhoan);
      setIdDiaChi(khachHang.idDiaChi);
      setTrangThai(khachHang.trangThai === 1); // Assuming 1 means active
      // Set fileList nếu khách hàng đã có avatar
      if (khachHang.avatar) {
        setFileList([{ url: khachHang.avatar }]); // Giả sử avatar là URL của ảnh
      }
    }
  }, [khachHang]);

  const handleConfirmEdit = () => {
    // Validate the customer data
    if (!ten || !ma || !email || !sdt || !ngaySinh || !idTaiKhoan || !idDiaChi) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ các trường!",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.error({
        message: "Lỗi",
        description: "Email không hợp lệ!",
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(sdt)) {
      notification.error({
        message: "Lỗi",
        description: "Số điện thoại không hợp lệ!",
      });
      return;
    }

    // Handle submit
    handleSubmit(khachHang?.id, {
      ten,
      ma,
      email,
      sdt,
      ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh,
      trangThai: trangThai ? 1 : 0,
      idTaiKhoan,
      idDiaChi,
      avatar: fileList.length > 0 && fileList[0].url ? fileList[0].url : "", // Lưu URL avatar
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); // Cập nhật fileList khi người dùng thay đổi ảnh
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Hàm chuyển file sang base64 (dùng cho việc xem trước ảnh)
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </div>
  );

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
            <span className="text-red-600">*</span> Tên khách hàng
          </label>
          <Input
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            placeholder="Nhập tên khách hàng"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Mã khách hàng
          </label>
          <Input
            value={ma}
            onChange={(e) => setMa(e.target.value)}
            placeholder="Nhập mã khách hàng"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Số điện thoại
          </label>
          <Input
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Ngày sinh
          </label>
          <DatePicker
            style={{ width: "100%" }}
            value={ngaySinh}
            onChange={(date) => setNgaySinh(date)}
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Giới tính
          </label>
          <Select
            value={gioiTinh ? 'Nam' : 'Nữ'}
            onChange={(value) => setGioiTinh(value === 'Nam')}
            placeholder="Chọn giới tính"
            style={{ width: "100%" }}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> ID Tài khoản
          </label>
          <Input
            value={idTaiKhoan}
            onChange={(e) => setIdTaiKhoan(e.target.value)}
            placeholder="Nhập ID tài khoản"
            type="number"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> ID Địa chỉ
          </label>
          <Input
            value={idDiaChi}
            onChange={(e) => setIdDiaChi(e.target.value)}
            placeholder="Nhập ID địa chỉ"
            type="number"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Trạng thái
          </label>
          <Switch
            checked={trangThai}
            onChange={(checked) => setTrangThai(checked)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Col>
      </Row>

      {/* Cột Upload ảnh */}
      <Row className="flex justify-between mb-3">
        <Col span={24}>
          <label className="text-sm block mb-2">Avatar</label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            customRequest={() => {}}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {fileList.length > 0 && fileList[0].url && (
            <Image
              src={fileList[0].url}
              alt="Avatar"
              style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
            />
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalEditKhachHang;
