import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Select, Button, Layout, Menu, Avatar, Upload, message ,AutoComplete} from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined, UploadOutlined } from "@ant-design/icons";
import { getKhachHangByIdApi, updateKhachHangApi } from "../../../api/KhachHangApi";
import { set } from "@ant-design/plots/es/core/utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../admin/component/product/spct/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { TbReplace } from "react-icons/tb";
import debounce from 'lodash/debounce';
import axios from "axios";
const { Sider, Content } = Layout;
const { Option } = Select;

const AccountInfo = () => {
    const [form] = Form.useForm();
    const [dataUser, setDataUser] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const currentYear = new Date().getFullYear();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [addressOptions, setAddressOptions] = useState([]);
    const apiKey = 'DFt7PndsFeTuDNGggyzQyLr0dzqU9Sf0hb0mMZX5';
    const originLat = 21.038059779392608;
    const originLng = 105.74668196761013;

    const fetchData = async () => {
        if (!userInfo.id) return;
        try {
            // Gọi API để lấy thông tin tài khoản
            const res = await getKhachHangByIdApi(userInfo.id); // Thay `1` bằng ID thực tế
            console.log('User info:', res.data);
            if (res.data) {
                setDataUser(res.data);
                setAvatar(res.data.avatar);

                // Cập nhật giá trị form với dữ liệu từ API
                form.setFieldsValue({
                    fullName: res.data.ten,
                    email: res.data.email,
                    phone: res.data.sdt,
                    gender: res.data.gioiTinh ? "Nam" : "Nữ",
                    dobDay: new Date(res.data.ngaySinh).getDate(),
                    dobMonth: new Date(res.data.ngaySinh).getMonth() + 1,
                    dobYear: new Date(res.data.ngaySinh).getFullYear(),
                    address: res.data.diaChiStr,
                });
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            console.log('Stored user info:', storedUserInfo);
            console.log('Parsed user info:', parsedUserInfo);

        } else {
            console.log('No stored user info, using default userId: 1');

        }

    }, []);

    useEffect(() => {
        fetchData();
    }, [userInfo]);



    // Hàm tải ảnh lên Firebase
    const uploadImageToFirebase = async (image) => {
        const imgRef = ref(storage, `images/${uuidv4()}`); // Đường dẫn Firebase
        await uploadBytes(imgRef, image); // Tải ảnh lên Firebase
        return await getDownloadURL(imgRef); // Lấy URL ảnh
    };

    // Xử lý khi chọn ảnh
    const handleAvatarChange = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ cho phép tải lên file hình ảnh!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatar(e.target.result); // Hiển thị ảnh mới
            setAvatarFile(file); // Lưu file ảnh để tải lên Firebase
        };
        reader.readAsDataURL(file);
    };

    // Xử lý cập nhật thông tin
    const handleFinish = async (values) => {
        try {
            let newAvatarUrl = avatar;

            // Nếu có ảnh mới, tải lên Firebase
            if (avatarFile) {
                newAvatarUrl = await uploadImageToFirebase(avatarFile);
            }

            // Chuẩn bị dữ liệu gửi API
            const updatedData = {
                id: dataUser.id,
                ten: values.fullName,
                email: values.email,
                sdt: values.phone,
                gioiTinh: values.gender === "Nam",
                ngaySinh: `${values.dobYear}-${String(values.dobMonth).padStart(2, '0')}-${String(values.dobDay).padStart(2, '0')}`,  // Chuyển ngày và tháng về dạng "yyyy-MM-dd"
                avatar: newAvatarUrl,
                diaChiStr: values.address,
                ma: dataUser.ma,
            };

            // Gửi yêu cầu cập nhật thông tin
            const res = await updateKhachHangApi(dataUser.id, updatedData);
            if (res.code === 1000) {
                message.success("Cập nhật thông tin thành công!");
                fetchData(); // Lấy lại thông tin mới nhất
            }

        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Đã xảy ra lỗi khi cập nhật thông tin!");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        setIsLoggedIn(false);
        navigate("/auth/login");
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

    // const handleAddressSelect = async (value, option) => {
    //     try {
    //         const detailResponse = await axios.get(`https://rsapi.goong.io/Place/Detail?place_id=${option.place_id}&api_key=${apiKey}`);
    //         if (detailResponse.data.result && detailResponse.data.result.geometry) {
    //             const { lat, lng } = detailResponse.data.result.geometry.location;
    //             console.log('Selected address:',detailResponse.data.result.geometry.location);
    //             // calculateShippingCost(lat, lng);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching place details:', error);
    //     }
    // };



    return (
        <Layout>
            <Sider width={250} style={{ background: "#fff", padding: "20px" }}>
                <Menu mode="vertical" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        Thông tin tài khoản
                    </Menu.Item>
                    {/* <Menu.Item key="2" icon={<LockOutlined />}>
                        Thay đổi mật khẩu
                    </Menu.Item> */}
                    <Menu.Item key="3" icon={<LogoutOutlined />} style={{ color: "red" }} onClick={handleLogout}>
                        Đăng xuất
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content style={{ padding: "20px", background: "#f5f5f5" }}>
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2>Thông tin tài khoản</h2>
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <div style={{ textAlign: "center", display: "grid", gridTemplateRows: "auto 1fr" }}>

                                <Avatar
                                    size={200}
                                    src={avatar}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: "0px" }}
                                />
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleAvatarChange(file);
                                        return false; // Ngăn không tải ảnh lên server
                                    }}
                                >
                                    <Button icon={<TbReplace />}>Thay đổi ảnh</Button>
                                </Upload>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>
                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                >
                                    <Radio.Group>
                                        <Radio value="Nam">Nam</Radio>
                                        <Radio value="Nữ">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="Ngày tháng năm sinh">
                                    <Input.Group compact>
                                        <Form.Item
                                            name="dobDay"
                                            noStyle
                                            rules={[{ required: true, message: "Chọn ngày!" }]}
                                        >
                                            <Select style={{ width: "70px" }}>
                                                {[...Array(31)].map((_, i) => (
                                                    <Option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="dobMonth"
                                            noStyle
                                            rules={[{ required: true, message: "Chọn tháng!" }]}
                                        >
                                            <Select style={{ width: "90px" }}>
                                                {[...Array(12)].map((_, i) => (
                                                    <Option key={i + 1} value={i + 1}>
                                                        Tháng {i + 1}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="dobYear"
                                            noStyle
                                            rules={[{ required: true, message: "Chọn năm!" }]}
                                        >
                                            <Select style={{ width: "100px" }}>
                                                {[...Array(100)].map((_, i) => (
                                                    <Option key={currentYear - i} value={currentYear - i}>
                                                        {currentYear - i}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
                                >
                                    <Input placeholder="Nhập email"  readOnly  />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                                        {
                                          pattern: /^(0?)(3|5|7|8|9)\d{8}$/,
                                          message: "Số điện thoại không hợp lệ!",
                                        },
                                      ]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    required
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <AutoComplete
                                        options={addressOptions}
                                        onSearch={handleAddressSearch}
                                        // onSelect={handleAddressSelect}
                                        placeholder="Nhập địa chỉ"
                                        size="large"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Lưu thông tin
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default AccountInfo;
