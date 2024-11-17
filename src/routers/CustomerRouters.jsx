import HomePage from "../customer/component/pages/HomePage";
import TrangChu from "../customer/component/product/TrangChu";
import FilterProduct from "../customer/component/product/FilterProduct";
import ProductDetail from "../customer/component/product/ProductDetail";

const CustomerRouters = {
  path: "/",
  element: <HomePage />,
  children: [
    {
      index: true, // This will make "TrangChu" the default route for "/"
      element: <TrangChu />// Redirect from "/" to "/sanpham"
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
  ],
};

export default CustomerRouters;
