import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Button, Upload, Image } from "antd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { Option } = Select;

const ModalThemMoiKhachHang = ({ isOpen, handleClose, title, handleSubmit }) => {
  const [ten, setTen] = useState("");
  const [ma, setMa] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaySinh, setNgaySinh] = useState(null);
  const [gioiTinh, setGioiTinh] = useState(true);  
  const [ngayTao, setNgayTao] = useState(moment()); 
  const [trangThai, setTrangThai] = useState(true);
  const [idTaiKhoan, setIdTaiKhoan] = useState("");  
  const [idDiaChi, setIdDiaChi] = useState("");  
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleConfirmAdd = () => {
    // Kiểm tra dữ liệu đầu vào
    if (!ten || !ma || !email || !sdt || !ngaySinh || !idTaiKhoan || !idDiaChi) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập đúng định dạng email!",
      });
      return;
    }

    // Kiểm tra số điện thoại 
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(sdt)) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập số điện thoại hợp lệ (10-11)!",
      });
      return;
    }

    // Nếu có ảnh, upload và lưu URL
    let avatarUrl = "";
    if (fileList.length > 0 && fileList[0].status === 'done') {
      avatarUrl = fileList[0].url;  // Lưu URL ảnh
    }

    handleSubmit({
      ten,
      ma,
      email,
      sdt,
      ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh,  // Đảm bảo là true hoặc false
      ngayTao: ngayTao.format('YYYY-MM-DD'), // Lưu ngày tạo
      trangThai: trangThai ? 1 : 0,
      idTaiKhoan,
      idDiaChi,
      avatar: avatarUrl,  // Lưu URL avatar
    });
  };

  // Xử lý thay đổi tệp tải lên
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // Xử lý xem trước ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Hàm chuyển đổi file sang base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Tạo nút upload
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </div>
  );

  // Custom request for Firebase Storage upload
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const storageRef = ref(storage, 'avatars/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Optional: Handle progress if needed
        },
        (error) => {
          onError(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onSuccess(null, file);
          setFileList([{ url: downloadURL }]);  // Update fileList with the URL of the uploaded image
        }
      );
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      title={
        <span className="flex">
          <IoMdAddCircleOutline style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }} />
          Thêm mới {title}
        </span>
      }
      okType="primary"
      onOk={handleConfirmAdd}
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
            placeholder="Nhập vào tên khách hàng"
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
            placeholder="Nhập ID tài khoản" type="number"
          />
        </Col>
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> ID Địa chỉ
          </label>
          <Input
            value={idDiaChi}
            onChange={(e) => setIdDiaChi(e.target.value)}
            placeholder="Nhập ID địa chỉ" type="number"
          />
        </Col>
      </Row>

      <Row className="flex justify-between mb-3">
        <Col span={11}>
          <label className="text-sm block mb-2">
            <span className="text-red-600">*</span> Ngày tạo
          </label>
          <DatePicker
            style={{ width: "100%" }}
            value={ngayTao}
            disabled
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
            customRequest={customRequest} // Use custom request for Firebase upload
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

export default ModalThemMoiKhachHang;
