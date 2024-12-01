import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Upload, Image } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons"; 
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { Option } = Select;

const ModalEditNhanVien = ({ isOpen, handleClose, title, handleSubmit, nhanVien }) => {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaySinh, setNgaySinh] = useState(null);
  const [gioiTinh, setGioiTinh] = useState(true); // true for male, false for female
  const [trangThai, setTrangThai] = useState(true); // Default to active
  const [idTaiKhoan, setIdTaiKhoan] = useState(""); // Account ID
  const [diaChi, setDiaChi] = useState(""); // Address ID
  const [fileList, setFileList] = useState([]); // State để lưu file tải lên (avatar)

  useEffect(() => {
    if (nhanVien) {
      setTen(nhanVien.ten);
      setEmail(nhanVien.email);
      setSdt(nhanVien.sdt);
      setNgaySinh(moment(nhanVien.ngaySinh));
      setGioiTinh(nhanVien.gioiTinh);  // true for male, false for female
      setIdTaiKhoan(nhanVien.idTaiKhoan);
      setDiaChi(nhanVien.diaChi);
      setTrangThai(nhanVien.trangThai === 1); // Assuming 1 means active
      // Set fileList nếu nhân viên đã có avatar
      if (nhanVien.avatar) {
        setFileList([{ url: nhanVien.avatar }]); // Giả sử avatar là URL của ảnh
      }
    }
  }, [nhanVien]);

  const handleConfirmEdit = () => {
   
    if (!ten || !email || !sdt || !ngaySinh || !idTaiKhoan || !diaChi) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ các trường!",
      });
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.error({
        message: "Lỗi",
        description: "Email không hợp lệ!",
      });
      return;
    }

    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(sdt)) {
      notification.error({
        message: "Lỗi",
        description: "Số điện thoại từ 10 - 11 số!",
      });
      return;
    }

   
    handleSubmit(nhanVien?.id, {
      ten,
      email,
      sdt,
      ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh,
      trangThai: trangThai ? 1 : 0,
      idTaiKhoan,
      diaChi,
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

  // Sửa lại customRequest để upload ảnh lên Firebase
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const storageRef = ref(storage, 'avatars/' + file.name); // Tạo tham chiếu đến Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file); // Upload tệp

      // Lắng nghe sự kiện thay đổi trạng thái upload
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Có thể thêm logic để hiển thị tiến độ tải lên
        },
        (error) => {
          onError(error); // Nếu có lỗi, gọi onError
        },
        async () => {
          // Sau khi tải lên xong, lấy URL ảnh từ Firebase Storage
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          file.url = downloadURL; // Thêm URL vào đối tượng file
          onSuccess(file); // Gọi onSuccess để thông báo đã tải lên thành công
        }
      );
    } catch (error) {
      onError(error); // Gọi onError nếu có lỗi xảy ra
    }
  };

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
            <span className="text-red-600">*</span> Tên nhân viên
          </label>
          <Input
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            placeholder="Nhập tên nhân viên"
          />
        </Col>
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
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Địa chỉ
          </label>
          <Input
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Tài khoản
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
            customRequest={customRequest} // Sử dụng customRequest để upload ảnh lên Firebase
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

export default ModalEditNhanVien;
