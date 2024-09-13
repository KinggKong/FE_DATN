import React from "react";
import { Menu } from "antd";
import {
  AreaChartOutlined,
  UserOutlined,
  SettingOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { GiConverseShoe } from "react-icons/gi";
import { MdAutoFixHigh } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { TbBrand4Chan } from "react-icons/tb";
import { TbBrandDenodo } from "react-icons/tb";
import { SlSizeFullscreen } from "react-icons/sl";
import { LiaShoePrintsSolid } from "react-icons/lia";

const MenuList = ({ darkTheme }) => {
  return (
    <div>
      <Menu
        theme={darkTheme ? "dark" : "light"}
        mode="inline"
        className="menu-bar"
      >
        <Menu.Item key="home" icon={<FaEye />}>
          Tổng quan
        </Menu.Item>

        <Menu.Item key="activity" icon={<MdLocalShipping />}>
          Bán hàng
        </Menu.Item>

        <Menu.SubMenu
          key="submn1"
          icon={<ProductOutlined />}
          title="Quản lý sản phẩm"
        >
          <Menu.Item key="sub1-t1" icon={<GiConverseShoe />}>
            <Link to={"sanpham"}>Sản phẩm</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1-t2"
            title="Thuộc tính"
            icon={<MdAutoFixHigh />}
          >
            <Menu.Item key="sub1-t3" icon={<LiaShoePrintsSolid />}>
              <Link to={"degiay"}>Đế giày</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t4" icon={<TbBrandDenodo />}>
              <Link to={"chatlieu"}>Chất liệu</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t5" icon={<SlSizeFullscreen />}>
              <Link to={"kichthuoc"}>Kích cỡ</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t6" icon={<MdCategory />}>
              <Link to={"danhmuc"}>Danh mục</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t7" icon={<TbBrand4Chan />}>
              <Link to={"thuonghieu"}>Thương hiệu</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="submn2"
          icon={<UserOutlined />}
          title="Quản lý tài khoản"
        >
          <Menu.Item key="sub2-t1">
            <Link to={"taisandat"}>Tài sản đất</Link>
          </Menu.Item>
          <Menu.Item key="sub2-t2">
            <Link to={"taisannha"}>Tài sản nhà</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="progress" icon={<AreaChartOutlined />}>
          Thống kê
        </Menu.Item>

        <Menu.Item key="discount" icon={<MdDiscount />}>
          Giảm giá
        </Menu.Item>

        <Menu.Item key="setting" icon={<SettingOutlined />}>
          Cài đặt
        </Menu.Item>
        <Menu.Item key="payment" icon={<IoExitOutline />}>
          Thoát
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuList;
