
import { Menu, Modal } from "antd";

import { useState,useEffect } from "react";


import {
  AreaChartOutlined,
  UserOutlined,
  SettingOutlined,
  ProductOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { GiConverseShoe } from "react-icons/gi";
import { GiRunningShoe } from "react-icons/gi";
import { MdAutoFixHigh } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { TbBrand4Chan } from "react-icons/tb";
import { TbBrandDenodo } from "react-icons/tb";
import { SlSizeFullscreen } from "react-icons/sl";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { CiDiscount1 } from "react-icons/ci";
import { FaFileInvoice } from "react-icons/fa";
import { useState } from "react";

const MenuList = ({ darkTheme }) => {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { confirm } = Modal;

  const handleLogout = () => {
    confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        // Xử lý đăng xuất
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        setIsLoggedIn(false);

        navigate("/auth/login-admin"); // Điều hướng về trang đăng nhập
      },
      onCancel() {
        console.log("Hủy đăng xuất");
      },
    });

  };

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  const isStaff = userInfo?.vaiTro === "ROLE_STAFF";

  return (
    <div>
      <Menu
        theme={darkTheme ? "dark" : "light"}
        mode="inline"
        className="menu-bar"
      >
        <Menu.Item key="home" icon={<FaEye />}>
          <Link to={"tong-quan"}>Tổng quan</Link>

        </Menu.Item>

        <Menu.Item key="activity" icon={<MdLocalShipping />}>
          <Link to={"banhang"}>Bán hàng</Link>
        </Menu.Item>

        <Menu.Item key="ordermanagement" icon={<FaFileInvoice />}>
          <Link to={"order-management"}>Danh sách hóa đơn</Link>
        </Menu.Item>

        <Menu.SubMenu
          key="submn1"
          icon={<ProductOutlined />}
          title="Quản lý sản phẩm"
        >
          <Menu.Item key="sub1-t1" icon={<GiConverseShoe />}>
            <Link to={"sanpham"}>Sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="sub1-t2" icon={<GiRunningShoe />}>
            <Link to={"sanphamchitiet"}>Sản phẩm chi tiết</Link>
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
        <Menu.SubMenu
          key="submn3"
          icon={<BiSolidDiscount />}
          title="Giảm giá"
        >

           <Menu.Item key="sub3-t1" icon={<MdDiscount />} >
          <Link to={"giamgia"}>Phiếu giảm giá</Link>

          </Menu.Item>
          <Menu.Item key="sub3-t2" icon={<CiDiscount1 />}>
            <Link to={"sale"}>Đợt giảm giá</Link>
          </Menu.Item>
        </Menu.SubMenu>       
        <Menu.Item key="exit" icon={<IoExitOutline />} onClick={handleLogout}>
          Đăng xuất

        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuList;
