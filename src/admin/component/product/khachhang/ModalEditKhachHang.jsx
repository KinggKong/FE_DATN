import moment from 'moment';
import { Modal, notification, Row, Col, Input, DatePicker, Switch, Select, Upload, Button, Image } from "antd";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "../spct/firebaseConfig"; // Firebase config import
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const ModalEditKhachHang = ({ isOpen, handleClose, handleSubmit, khachHang }) => {
    // State cho các trường trong modal
    const [ten, setTen] = useState("");
    const [ma, setMa] = useState("");
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [email, setEmail] = useState("");
    const [sdt, setSdt] = useState("");
    const [avatar, setAvatar] = useState("");  // Giữ URL ảnh
    const [ngaySinh, setNgaySinh] = useState(null);
    const [idDiaChi, setIdDiaChi] = useState("");
    const [gioiTinh, setGioiTinh] = useState(true); // true for male, false for female
    const [trangThai, setTrangThai] = useState(true); // 1 for active, 0 for inactive
    const [previewImage, setPreviewImage] = useState(''); // URL hình ảnh preview
    const [previewOpen, setPreviewOpen] = useState(false);
    const [idTaiKhoan, setIdTaiKhoan] = useState("");  // Thêm trạng thái cho id_tai_khoan

    // Cập nhật modal với thông tin khách hàng đã chọn
    useEffect(() => {
        if (khachHang) {
            setTen(khachHang.ten);
            setMa(khachHang.ma);
            setTenDangNhap(khachHang.tenDangNhap);
            setMatKhau(khachHang.matKhau);
            setEmail(khachHang.email);
            setSdt(khachHang.sdt);
            setAvatar(khachHang.avatar);
            setNgaySinh(moment(khachHang.ngaySinh));
            setIdDiaChi(khachHang.idDiaChi);
            setIdTaiKhoan(khachHang.idTaiKhoan);  // Cập nhật id_tai_khoan
            setGioiTinh(khachHang.gioiTinh);
            setTrangThai(khachHang.trangThai === 1);
        }
    }, [khachHang]); // Khi khachHang thay đổi, cập nhật lại các giá trị

    const handleConfirmEdit = () => {
        // Kiểm tra các giá trị nhập vào
        if (!ten || !tenDangNhap || !matKhau || !email || !sdt || !idDiaChi || !idTaiKhoan) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin.",
            });
            return;
        }

        if (sdt.length < 10 || sdt.length > 11) {
            notification.error({
                message: "Lỗi",
                description: "Số điện thoại phải có độ dài từ 10 đến 11 ký tự.",
            });
            return;
        }

        if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            notification.error({
                message: "Lỗi",
                description: "Email không hợp lệ.",
            });
            return;
        }

        // Gửi dữ liệu đã nhập lên server
        handleSubmit({
            id: khachHang.id, // Giữ lại id của khách hàng để update
            ten,
            ma,
            tenDangNhap,
            matKhau,
            email,
            sdt,
            avatar,
            ngaySinh: ngaySinh ? ngaySinh.format('YYYY-MM-DD') : null, // Chuyển ngày sinh thành chuỗi
            idDiaChi,
            idTaiKhoan,  // Thêm id_tai_khoan vào dữ liệu gửi lên server
            gioiTinh,
            trangThai: trangThai ? 1 : 0, // Trạng thái khách hàng (1: hoạt động, 0: không hoạt động)
        });
    };

    const uploadImageToFirebase = async (image) => {
        const imgRef = ref(storage, `images/${uuidv4()}`);
        await uploadBytes(imgRef, image);
        return await getDownloadURL(imgRef);
    };

    const handleUploadChange = async ({ fileList }) => {
        const newFileList = await Promise.all(
            fileList.map(async (file) => {
                if (!file.url && !file.firebaseUrl) {
                    const firebaseUrl = await uploadImageToFirebase(file.originFileObj);
                    return {
                        ...file,
                        firebaseUrl,
                        url: firebaseUrl,
                    };
                }
                return file;
            })
        );

        setAvatar(newFileList[0]?.url || ''); // Cập nhật avatar với URL ảnh đã upload
    };

    const uploadButton = (
        <Button icon={<PlusOutlined />}>Upload</Button>
    );

    return (
        <Modal
            open={isOpen}
            title={(
                <span className="flex">
                    <FaEdit style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }} />
                    Chỉnh sửa khách hàng
                </span>
            )}
            okType="primary"
            onOk={handleConfirmEdit}
            onCancel={handleClose}
            keyboard={false}
            maskClosable={false}
        >
            <Row className="flex justify-between mb-3">
                <Col span={11}>
                    <label className="text-sm block mb-2">
                        <span className="text-red-600">*</span> ID Tài khoản
                    </label>
                    <Input
                        value={idTaiKhoan}
                        onChange={(e) => setIdTaiKhoan(e.target.value)}
                        placeholder="Nhập ID tài khoản"
                    />
                </Col>
            </Row>

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
                        <span className="text-red-600">*</span> ID Địa chỉ
                    </label>
                    <Input
                        type="number"
                        value={idDiaChi}
                        onChange={(e) => setIdDiaChi(e.target.value)}
                        placeholder="Nhập ID địa chỉ"
                    />
                </Col>
                <Col span={11}>
                    <label className="text-sm block mb-2"><span className="text-red-600">*</span> Ngày sinh</label>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={ngaySinh}
                        onChange={(date) => setNgaySinh(date)}
                    />
                </Col>
            </Row>

            <Row className="flex justify-between mb-3">
                <Col span={11}>
                    <label className="text-sm block mb-2"><span className="text-red-600">*</span> Trạng thái</label>
                    <Switch
                        checked={trangThai}
                        onChange={(checked) => setTrangThai(checked)}
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Không hoạt động"
                    />
                </Col>
                <Col span={11}>
                    <label className="text-sm block mb-2"><span className="text-red-600">*</span> Giới tính</label>
                    <Select
                        value={gioiTinh ? 'Nam' : 'Nữ'}
                        onChange={(value) => setGioiTinh(value === 'Nam')}
                    >
                        <Option value="Nam">Nam</Option>
                        <Option value="Nữ">Nữ</Option>
                    </Select>
                </Col>
            </Row>

            {/* Cập nhật phần input ảnh đại diện */}
            <Row className="flex justify-between mb-3">
                <Col span={11}>
                    <label className="text-sm block mb-2">Ảnh đại diện</label>
                    <Upload
                        listType="picture-card"
                        maxCount={1}  // Giới hạn chỉ cho phép tải lên 1 ảnh
                        onChange={handleUploadChange}
                        onPreview={(file) => {
                            setPreviewImage(file.url || file.preview);
                            setPreviewOpen(true);
                        }}
                    >
                        {avatar ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                            }}
                            src={previewImage}
                        />
                    )}
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalEditKhachHang;
