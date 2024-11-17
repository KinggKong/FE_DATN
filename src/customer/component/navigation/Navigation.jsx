import React, { useState } from "react";
import { Input, Badge, Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";
const Navigation = () => {
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  return (
    <div>
      <p className="flex h-5 items-center justify-center bg-black px-4 text-xs font-medium text-white sm:text-1 sm:px-4 lg:px-6">
        3HST Shoes - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời
        trang quốc tế hàng đầu Việt Nam
      </p>
      <nav className="flex items-center justify-center flex-wrap">
        <div className="flex items-center ">
          <img
            src="\src\assets\images\logo9.png"
            alt="Logo"
            className="mr-2 "
          />
        </div>

        <div className="w-full lg:flex lg:items-center lg:w-auto uppercase  ">
          <div
            className="text-sm lg:flex-grow "
            style={{ fontFamily: "sans-serif", padding: "0 80px" }}
          >
            <a
              href="#responsive-header"
              className="block  mt-4 lg:inline-block lg:mt-0  hover:text-slate-500 mr-9"
            >
              <Link to={"sanpham"}>Trang Chủ</Link>
            </a>
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0  hover:text-slate-500 mr-9"
            >
              <Link to={"filter"}>Sản Phẩm</Link>
            </a>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0  hover:text-slate-500 mr-9"
            >
                   <Link to={"about"}>    Giới Thiệu</Link>
          
            </a>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0  hover:text-slate-500 mr-9"
            >
              Liên Hệ
            </a>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0  hover:text-slate-500"
            >
              Giảm giá
            </a>
          </div>
        </div>

        <div className="flex items-center">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm"
            style={{ width: "200px" }}
          />
          <Badge count={5} style={{ marginRight: "20px" }}>
            <ShoppingCartOutlined
              onClick={() => setOpenDrawer(true)}
              style={{ fontSize: "24px", padding: "0 15px" }}
            />
          </Badge>
          <Dropdown
            menu={{
              items: [
                { key: "profile", label: "Hồ sơ" },
                { key: "settings", label: "Cài đặt" },
                { key: "logout", label: "Đăng xuất" },
              ],
            }}
          >
            <Avatar icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </nav>
      <CartDrawer showDrawer={setOpenDrawer} isOpenDrawer={isOpenDrawer} />
    </div>
  );
};

export default Navigation;
