import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Upload, Image, AutoComplete, Form } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from '../spct/firebaseConfig'; // Import tệp cấu hình Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import debounce from 'lodash/debounce';
import axios from 'axios';
const { Option } = Select;

const ModalEditKhachHang = ({ isOpen, handleClose, title, handleSubmit, khachHang }) => {
  const [ten, setTen] = useState("");
  const [ma, setMa] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaySinh, setNgaySinh] = useState(null);
  const [gioiTinh, setGioiTinh] = useState(true);
  const [trangThai, setTrangThai] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [ngayTao, setNgayTao] = useState(null);
  const [diaChiStr, setDiaChiStr] = useState("");
  const [addressOptions, setAddressOptions] = useState([]);
  const apiKey = 'DFt7PndsFeTuDNGggyzQyLr0dzqU9Sf0hb0mMZX5';

  useEffect(() => {
    if (khachHang) {
      console.log(khachHang);
      setTen(khachHang.ten);
      setMa(khachHang.ma);
      setEmail(khachHang.email);
      setSdt(khachHang.sdt);
      setNgaySinh(moment(khachHang.ngaySinh));
      setNgayTao(moment(khachHang.ngayTao));
      setGioiTinh(khachHang.gioiTinh);
      setTrangThai(khachHang.trangThai === 1);
      // if (khachHang.diaChiStr){
      //   setDiaChiStr(khachHang.diaChiStr);
      // } else {
      //   setDiaChiStr("");
      // }
      setDiaChiStr(khachHang.diaChiStr || "");

      if (khachHang.avatar) {
        setFileList([{ url: khachHang.avatar }]);
      } else {
        setFileList([]);
      }
    }
  }, [khachHang]);

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
    if (ngaySinh.isAfter(moment(), 'day')) {
      notification.error({
        message: "Lỗi",
        description: "Ngày sinh không thể lớn hơn ngày hiện tại!",
      });
      return;
    }


    const phoneRegex = /^0[0-9]{9,10}$/;
    if (!phoneRegex.test(sdt)) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)!",
      });
      return;
    }


    handleSubmit(khachHang?.id, {
      ten,
      ma,
      email,
      sdt,
      ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh,
      trangThai: trangThai ? 1 : 0,
      diaChiStr,
      avatar: fileList.length > 0 && fileList[0].url ? fileList[0].url : "",
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };


  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const storageRef = ref(storage, 'avatars/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {

        },
        (error) => {
          onError(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onSuccess(null, file);
          setFileList([{ url: downloadURL }]);
        }
      );
    } catch (error) {
      onError(error);
    }
  };

  const handleAddressSearch = debounce(async (value) => {
    if (value.length > 2) {
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
  }, 300);

  const handleAddressSelect = async (value) => {
    setDiaChiStr(value);
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
            <span className="text-red-600">*</span> Ngày sinh
          </label>
          <DatePicker
            style={{ width: "100%" }}
            value={ngaySinh}
            onChange={(date) => setNgaySinh(date)}
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
        <Col span={8}>
          <label className="text-sm block mb-2">Trạng thái</label>
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
              value={diaChiStr}
              options={addressOptions}
              onSearch={handleAddressSearch}
              onSelect={handleAddressSelect}
              onChange={(value) => setDiaChiStr(value)}
              placeholder="Nhập địa chỉ"
              size="large"
            />
          </Form.Item>
        </Col>

      </Row>


      <Row className="flex justify-between mb-3">
        <Col span={14}>
          <label className="text-sm block mb-2">Avatar</label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            customRequest={customRequest}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {/* {fileList.length > 0 && fileList[0].url && (
            <Image
              src={fileList[0].url}
              alt="Avatar"
              style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
            />
          )} */}
        </Col>

      </Row>
    </Modal>
  );
};

export default ModalEditKhachHang;