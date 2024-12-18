import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Button, Upload, Image, Form, AutoComplete } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import debounce from 'lodash/debounce';

const { Option } = Select;

const ModalEditNhanVien = ({ isOpen, handleClose, title, handleSubmit, nhanVien }) => {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaySinh, setNgaySinh] = useState(null);
  const [gioiTinh, setGioiTinh] = useState(true);
  const [trangThai, setTrangThai] = useState(true);
  const [diaChiStr, setDiaChiStr] = useState("");
  const [addressOptions, setAddressOptions] = useState([]);
  const [fileList, setFileList] = useState([]);

  const apiKey = 'DFt7PndsFeTuDNGggyzQyLr0dzqU9Sf0hb0mMZX5'; // API key Goong

  // Hàm xử lý tìm kiếm địa chỉ
  const handleAddressSearch = debounce(async (value) => {
    if (value.length > 2) { // Chỉ gọi API khi người dùng nhập ít nhất 3 ký tự
      try {
        const response = await axios.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(value)}`);
        if (response.data.predictions) {
          setAddressOptions(response.data.predictions.map(prediction => ({
            value: prediction.description,
            label: prediction.description,
            place_id: prediction.place_id
          })));
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    }
  }, 300); // Debounce 300ms

  const handleAddressSelect = (value) => {
    setDiaChiStr(value);
  };

  // Thiết lập thông tin nhân viên khi modal được mở
  useEffect(() => {
    if (nhanVien) {
      setTen(nhanVien.ten);
      setEmail(nhanVien.email);
      setSdt(nhanVien.sdt);
      setNgaySinh(moment(nhanVien.ngaySinh));
      setGioiTinh(nhanVien.gioiTinh);
      setDiaChiStr(nhanVien.diaChi);
      setTrangThai(nhanVien.trangThai === 1);

      if (nhanVien.avatar) {
        setFileList([{ url: nhanVien.avatar }]);
      }
    }
  }, [nhanVien]);

  const handleConfirmEdit = () => {
    if (!ten || !email || !sdt || !ngaySinh || !diaChiStr) {
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

    // Kiểm tra ngày sinh không được lớn hơn ngày hiện tại
    if (ngaySinh.isAfter(moment().subtract(18, 'years'), 'day')) {
      notification.error({
        message: "Lỗi",
        description: "Bạn phải đủ 18 tuổi để đăng ký!",
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

    // Gửi thông tin đã chỉnh sửa
    handleSubmit(nhanVien?.id, {
      ten,
      email,
      sdt,
      ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh,
      trangThai: trangThai ? 1 : 0,
      diaChi: diaChiStr,
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

      <Row className="flex justify-between mb-3">
        <Col span={24}>
          <Form.Item
            label="Địa chỉ"
            labelCol={{ span: 24 }} // Đẩy label thành 100% chiều rộng
            wrapperCol={{ span: 24 }}
          >
            <AutoComplete
              value={diaChiStr}  // Liên kết với state diaChiStr
              options={addressOptions}
              onSearch={handleAddressSearch}
              onSelect={handleAddressSelect}
              onChange={(value) => setDiaChiStr(value)}  // Cập nhật giá trị khi người dùng gõ
              placeholder="Nhập địa chỉ"
              size="large"
            />
          </Form.Item>
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
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalEditNhanVien;
