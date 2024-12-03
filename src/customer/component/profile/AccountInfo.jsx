import React from "react";
import { Form, Input, Radio, Select, Button, Layout, Menu, Avatar } from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Option } = Select;

const AccountInfo = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Values: ", values);
  };

  return (
    <Layout>
      <Sider width={250} style={{ background: "#fff", padding: "20px" }}>
        <Menu mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Thông tin tài khoản
          </Menu.Item>
          <Menu.Item key="2" icon={<LockOutlined />}>
            Thay đổi mật khẩu
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} style={{ color: "red" }}>
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              gender: "Nam",
              dobDay: 1,
              dobMonth: 1,
              dobYear: 1950,
            }}
          >
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <Avatar
                  size={128}
                  icon={<UserOutlined />}
                  style={{ marginBottom: "20px" }}
                />
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
                          <Option key={1950 + i} value={1950 + i}>
                            {1950 + i}
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
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
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
