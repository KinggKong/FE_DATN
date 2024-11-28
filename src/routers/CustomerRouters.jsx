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
import Login from "../customer/auth/Login";

const CustomerRouters = {
  path: "/",
  element: <HomePage />,
  children: [
    {
      index: true, 
      element: <TrangChu />
    },
    {
      path: "sanpham",
      element: <TrangChu />,
    },
    {
      path: "filter",
      element: <FilterProduct />,
    },
    {
      path: "detail/:id",
      element: <ProductDetail />,
    },
    {
      path: "payment",
      element: <PreCheckout />,
    },
    {
      path: "infor-order",
      element: <OrderConfirmation />,
    },
    {
      path: "invoice-lookup",
      element: <InvoiceLookup />,
    },
    {
      path: "about",
      element: <GioiThieu />,
    },
    {
      path: "failed-pay",
      element: <FailedPay/>,
    },  
    {
      path: "hanlde-result-payment",
      element: <HandlePayment/>,
    }
  ],
};

export default CustomerRouters;
