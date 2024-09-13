import { Button, Layout, theme, Card, Badge, Avatar } from "antd";
import Logo from "../component/sidebar/Logo";
import MenuList from "../component/sidebar/MenuList";
import { useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ToggleThemeButton from "../component/sidebar/ToggleThemeButton";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";

const { Header, Sider } = Layout;
function Admin() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapse, setCollape] = useState(false);
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollape(!collapse)}
            icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge size="small" count={6} overflowCount={99}>
              <BellOutlined style={{ fontSize: "20px" }} />
            </Badge>

            <Avatar
              style={{ marginLeft: "20px", fontSize: "20px" }}
              icon={<UserOutlined />}
            />
          </div>
        </Header>
        <Content>
          <Card
            style={{
              marginTop: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Outlet />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
