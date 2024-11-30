import KichThuoc from "../admin/pages/product/KichThuoc";
import Admin from "../admin/pages/Admin";
import ChatLieu from "../admin/pages/product/ChatLieu";
import DeGiay from "../admin/pages/product/DeGiay";
import DanhMuc from "../admin/pages/product/DanhMuc";
import ThuongHieu from "../admin/pages/product/ThuongHieu";
import SanPham from "../admin/pages/product/SanPham";
import BanHang from "../admin/pages/banhang/BanHang";
import GiamGia from "../admin/pages/giamgia/GiamGia";
import Nhanvien from "../admin/pages/taikhoan/Nhanvien";
import KhachHang from "../admin/pages/taikhoan/KhachHang";
import ThongKe from "../admin/pages/thongke/ThongKe"
import MauSac from "../admin/pages/product/MauSac";
import SanPhamChiTiet from "../admin/pages/product/SanPhamChiTiet";

import DotGiamGia from "../admin/pages/giamgia/DotGiamGia";
import FormAddDotGiamGia from "../admin/component/giamgia/DrawerAdd";
import ViewEditDotGiamGia from "../admin/component/giamgia/ViewEdit";
import OrderManagement from "../admin/component/banhang/OrderManagement";
import OrderDetail from "../admin/component/banhang/OrderDetail";
import TongQuan from "../admin/pages/thongke/TongQuan";



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
      path: "thuonghieu",
      element: <ThuongHieu />,
    },
    {
      path: "mausac",
      element: <MauSac />,
    },
    {
      path: "danhmuc",
      element: <DanhMuc />,
    },
    {
      path: "banhang",
      element: <BanHang />,
    },
    {
      path: "giamgia",
      element: <GiamGia />,
    },
    {
      path: "nhanvien",
      element: <Nhanvien />,
    },
    {
      path: "khachhang",
      element: <KhachHang />,
    },
    {
      path: "thongke",
      element: <ThongKe />,
    },
    {
      path:"sanphamchitiet",
      element:<SanPhamChiTiet />
    },

    {
      path:"sale",
      element:<DotGiamGia />
    },
    {
      path:"sale/add",
      element:<FormAddDotGiamGia />
    },
    {
      path:"sale/edit/:id",
      element:<ViewEditDotGiamGia />
    },  
    {
      path:"order-management",
      element:<OrderManagement />
    },
    {
      path:"order-detail/:id",
      element:<OrderDetail />
    },
    {
      
      path: "tong-quan",
      element: <TongQuan />,
    },
    {
      index: true, 
      element: <TongQuan />,
    }


  ],
};

export default AdminRouters;
