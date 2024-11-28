import React, { useState } from "react";
import { Input, Badge, Dropdown, Avatar,Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";
import useCartStore from "../cart/useCartStore";
import { getAllSanPhamByCustomerFilterApi } from "../../../api/SanPhamApi";
import "../../../assets/style/cssGoiYSearch.css"

const Navigation = ({ searchValue, setSearchValue }) => {
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const handleSearchEnter = () => {
    if (searchValue.trim()) {
      navigate(`/filter?search=${encodeURIComponent(searchValue)}`); 
    } else {
      navigate("/filter");
    }
  };
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
  
    if (value.trim()) {
      try {
        // Gọi API với tham số tìm kiếm
        const response = await getAllSanPhamByCustomerFilterApi({ tenSanPham: value });
        console.log(response);
        const filteredSuggestions = response.data.content;  
        setSuggestions(filteredSuggestions);
        setDropdownVisible(true);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        setSuggestions([]);
        setDropdownVisible(false);
      }
    } else {
      setDropdownVisible(false);
    }
  };
  const handleItemClick = (id) => {
    navigate(`/detail/${id}`); // Điều hướng tới trang chi tiết sản phẩm với ID tương ứng
    setDropdownVisible(false); // Đóng dropdown khi chọn item
  };
  
  const cartCount = useCartStore(state => state.cart.length);
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
              <Link to={"invoice-lookup"}>Tra cứu đơn hàng</Link>
        
            </a>
          </div>
        </div>

        <div className="flex items-center">
          {/* <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearchEnter} // Add onPressEnter event
            style={{ width: "200px" }}
          /> */}
          <Dropdown 
            overlay={
              <Menu>
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <Menu.Item key={item.id} onClick={() => handleItemClick(item.id)}>
                    <div className="flex items-center">
                      <img src={item.hinhAnh} alt={item.name} style={{ width: "40px", height: "40px", marginRight: "10px" }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{item.tenSanPham}</p>
                        <p style={{ margin: 0, color: "gray" }}>{item.giaHienThi}</p>
                      </div>
                    </div>
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item disabled>Không tìm thấy sản phẩm</Menu.Item>
              )}
            </Menu>
            }
            visible={isDropdownVisible}
            onVisibleChange={(visible) => setDropdownVisible(visible)}
            placement="bottomCenter"

          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm"
              value={searchValue}
              onChange={handleSearchChange}
              onPressEnter={handleSearchEnter}
              style={{ width: "200px" }}
            />
          </Dropdown>

          <Badge count={cartCount} style={{ marginRight: "20px" }}>
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
