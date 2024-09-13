import React from "react";
import KichThuoc from "../admin/pages/product/KichThuoc";
import Admin from "../admin/pages/Admin";
import ChatLieu from "../admin/pages/product/ChatLieu";
import DeGiay from "../admin/pages/product/DeGiay";
import DanhMuc from "../admin/pages/product/DanhMuc";
import ThuongHieu from "../admin/pages/product/ThuongHieu";
import SanPham from "../admin/pages/product/SanPham";

const AdminRouters = {
  path: "/admin/",
  element: <Admin />,
  children: [
    {
      path: "sanpham",
      element: <SanPham />,
    },
    {
      path: "degiay",
      element: <DeGiay />,
    },
    {
      path: "kichthuoc",
      element: <KichThuoc />,
    },
    {
      path: "chatlieu",
      element: <ChatLieu />,
    },
    {
      path: "danhmuc",
      element: <DanhMuc />,
    },
    {
      path: "thuonghieu",
      element: <ThuongHieu />,
    },
  ],
};

export default AdminRouters;
