import HomePage from "../customer/component/pages/HomePage";
import TrangChu from "../customer/component/product/TrangChu";
import FilterProduct from "../customer/component/product/FilterProduct";
import ProductDetail from "../customer/component/product/ProductDetail";
import PreCheckout from "../customer/component/shopon/PreCheckout";
import OrderConfirmation from "../customer/component/shopon/OrderConfirmation";
import InvoiceLookup from "../customer/component/shopon/InvoiceLookup";
import GioiThieu from "../customer/component/gioithieu/GioiThieu";
import FailedPay from "../customer/component/shopon/FailedPay";
import HandlePayment from "../customer/component/shopon/HandlePayment"
import AccountInfo from "../customer/component/profile/AccountInfo";
import { Navigate } from "react-router-dom";

const getRole = () => {
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo);
    return parsedUserInfo?.vaiTro || null;
  }
  return null;
};

const RoleRedirect = ({ element }) => {
  const role = getRole();

  if (role === "ROLE_ADMIN" || role === "ROLE_STAFF") {
    return <Navigate to="/admin/tong-quan" replace />;
  }
  return element;
};

const CustomerRouters = {
  path: "/",
  element: <HomePage />,
  children: [
    {
      index: true,
      element: <RoleRedirect element={<TrangChu />} />,
    },
    {
      path: "sanpham",
      element: <RoleRedirect element={<TrangChu />} />,
    },
    {
      path: "filter",
      element: <RoleRedirect element={<FilterProduct />} />,
    },
    {
      path: "detail/:id",
      element: <RoleRedirect element={<ProductDetail />} />,
    },
    {
      path: "payment",
      element: <RoleRedirect element={<PreCheckout />} />,
    },
    {
      path: "infor-order",
      element: <RoleRedirect element={<OrderConfirmation />} />,
    },
    {
      path: "invoice-lookup",
      element: <RoleRedirect element={<InvoiceLookup />} />,
    },
    {
      path: "about",
      element: <RoleRedirect element={<GioiThieu />} />,
    },
    {
      path: "failed-pay",
      element: <RoleRedirect element={<FailedPay />} />,
    },
    {
      path: "hanlde-result-payment",
      element: <RoleRedirect element={<HandlePayment />} />,
    },
    {
      path: "profile",
      element: <RoleRedirect element={<AccountInfo />} />,
    },
  ],
};

export default CustomerRouters;
