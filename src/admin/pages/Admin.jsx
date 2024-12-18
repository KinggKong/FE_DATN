
import { Button, Layout, theme, Card, Badge, Avatar } from "antd";
import Logo from "../component/sidebar/Logo";
import MenuList from "../component/sidebar/MenuList";
import { useEffect, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import ToggleThemeButton from "../component/sidebar/ToggleThemeButton";
import { getNhanVienByIdApi, getTaiKhoanByIdOwner } from "../../api/NhanVienApi";


const { Header, Sider } = Layout;

function Admin() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idRole, setIdRole] = useState(1);

  const user = null;
  // const user = {
  //   name: "Hoàng Trung Thông",
  //   role: "Chủ cửa hàng",
  //   avatar: "https://i.pravatar.cc/150",
  // };
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchUser = async () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      const id = parsedUserInfo.id;
      const params = {
        email: parsedUserInfo.email,
      };
      const res = await getTaiKhoanByIdOwner(params);
      console.log(res);
      if (res.data) {
        setIdRole(res.data.vaiTro.id);
      }
    }
  }

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {

      const parsedUserInfo = JSON.parse(storedUserInfo);
      const id = parsedUserInfo.id;
      fetchUser();
      setUserInfo(parsedUserInfo);
      console.log('Stored user info:', storedUserInfo);
      console.log('Parsed user info:', parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  return (
    <Layout>
      <Sider
        width={230}
        collapsed={collapse}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebar"
      >
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapse(!collapse)}
            icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            {isLoggedIn ? (
              // Hiển thị thông tin người dùng khi đã đăng nhập
              <>
                <div
                  style={{
                    textAlign: "right",
                    marginRight: "10px",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      display: "block",
                    }}
                  >
                    {userInfo.ten}
                  </span>
                  <span style={{ color: "#888", fontSize: "14px" }}>
                    {idRole === 1 ? "Chủ cửa hàng" : "Nhân viên"}
                  </span>
                </div>
                <Avatar size={40} src={userInfo.avatar} />
              </>
            ) : (
              <Link to="/auth/login-admin">
                <Button type="primary">Đăng nhập</Button>
              </Link>
            )}

          </div>
        </Header>
        <Content>
          <div style={{ padding: "20px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
