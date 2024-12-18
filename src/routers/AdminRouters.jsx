import React from "react";
import { Navigate } from "react-router-dom";
import SanPham from "../admin/pages/product/SanPham";
import DeGiay from "../admin/pages/product/DeGiay";
import KichThuoc from "../admin/pages/product/KichThuoc";
import ChatLieu from "../admin/pages/product/ChatLieu";
import ThuongHieu from "../admin/pages/product/ThuongHieu";
import MauSac from "../admin/pages/product/MauSac";
import DanhMuc from "../admin/pages/product/DanhMuc";
import BanHang from "../admin/pages/banhang/BanHang";
import GiamGia from "../admin/pages/giamgia/GiamGia";
import Nhanvien from "../admin/pages/taikhoan/Nhanvien";
import KhachHang from "../admin/pages/taikhoan/KhachHang";
import ThongKe from "../admin/pages/thongke/ThongKe";
import SanPhamChiTiet from "../admin/pages/product/SanPhamChiTiet";
import DotGiamGia from "../admin/pages/giamgia/DotGiamGia";
import FormAddDotGiamGia from "../admin/component/giamgia/DrawerAdd";
import ViewEditDotGiamGia from "../admin/component/giamgia/ViewEdit";
import OrderManagement from "../admin/component/banhang/OrderManagement";
import OrderDetail from "../admin/component/banhang/OrderDetail";
import TongQuan from "../admin/pages/thongke/TongQuan";
import Admin from "../admin/pages/Admin";

const getRole = () => {
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo);
    return parsedUserInfo?.vaiTro || null;
  }
  return null;
};

const PrivateRoute = ({ element, allowedRoles }) => {
  const role = getRole();
  if (allowedRoles.includes(role)) {
    return element;
  }
  return <Navigate to="/forbidden" replace />;
};

const AdminRouters = {
  path: "/admin",
  element: <Admin />,
  children: [
    {
      path: "sanpham",
      element: <PrivateRoute element={<SanPham />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "degiay",
      element: <PrivateRoute element={<DeGiay />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "kichthuoc",
      element: <PrivateRoute element={<KichThuoc />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "chatlieu",
      element: <PrivateRoute element={<ChatLieu />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "thuonghieu",
      element: <PrivateRoute element={<ThuongHieu />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "mausac",
      element: <PrivateRoute element={<MauSac />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "danhmuc",
      element: <PrivateRoute element={<DanhMuc />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "banhang",
      element: <PrivateRoute element={<BanHang />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "giamgia",
      element: <PrivateRoute element={<GiamGia />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "nhanvien",
      element: <PrivateRoute element={<Nhanvien />} allowedRoles={["ROLE_ADMIN"]} />,
    },
    {
      path: "khachhang",
      element: <PrivateRoute element={<KhachHang />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "thongke",
      element: <PrivateRoute element={<ThongKe />} allowedRoles={["ROLE_ADMIN"]} />,
    },
    {
      path: "sanphamchitiet",
      element: <PrivateRoute element={<SanPhamChiTiet />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "sale",
      element: <PrivateRoute element={<DotGiamGia />} allowedRoles={["ROLE_ADMIN"]} />,
    },
    {
      path: "sale/add",
      element: <PrivateRoute element={<FormAddDotGiamGia />} allowedRoles={["ROLE_ADMIN"]} />,
    },
    {
      path: "sale/edit/:id",
      element: <PrivateRoute element={<ViewEditDotGiamGia />} allowedRoles={["ROLE_ADMIN"]} />,
    },
    {
      path: "order-management",
      element: <PrivateRoute element={<OrderManagement />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "order-detail/:id",
      element: <PrivateRoute element={<OrderDetail />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      path: "tong-quan",
      element: <PrivateRoute element={<TongQuan />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
    {
      index: true,
      element: <PrivateRoute element={<TongQuan />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
    },
  ],
};

export default AdminRouters;
