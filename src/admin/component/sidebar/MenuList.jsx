import { Menu } from "antd";
import {
  AreaChartOutlined,
  UserOutlined,
  SettingOutlined,
  ProductOutlined,
  BgColorsOutlined,
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
import { FaRegUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

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
          <Link to={"banhang"}>Bán hàng</Link>
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
            <Menu.Item key="sub1-t6" icon={<BgColorsOutlined />}>
              <Link to={"mausac"}>Màu sắc</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t7" icon={<MdCategory />}>
              <Link to={"danhmuc"}>Danh mục</Link>
            </Menu.Item>
            <Menu.Item key="sub1-t8" icon={<TbBrand4Chan />}>
              <Link to={"thuonghieu"}>Thương hiệu</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="submn2"
          icon={<UserOutlined />}
          title="Quản lý tài khoản"
        >
          <Menu.Item key="sub2-t1" icon={<FaRegUser />}>
            <Link to={"nhanvien"}>Nhân Viên</Link>
          </Menu.Item>
          <Menu.Item key="sub2-t2" icon={<FaUserCircle />}>
            <Link to={"khachhang"}>Khách hàng</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="progress" icon={<AreaChartOutlined />}>
          <Link to={"thongke"}>Thống kê</Link>
        </Menu.Item>

        <Menu.Item key="discount" icon={<MdDiscount />}>
          <Link to={"giamgia"}>Giảm giá</Link>
        </Menu.Item>

        <Menu.Item key="setting" icon={<SettingOutlined />}>
          Cài đặt
        </Menu.Item>
        <Menu.Item key="exit" icon={<IoExitOutline />}>
          Thoát
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuList;
