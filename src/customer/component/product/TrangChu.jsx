import React, { useEffect, useState } from "react";
import HomeCarousel from "../carousel/HomeCarousel";
import CardItem from "../card/CardItem";
import SPKhuyenMaiCarousel from "../carousel/SPKhuyenMaiCarousel";
import TitleSanPham from "../title/TitleSanPham";
import { fake_product } from "../../data/fake_product";
import { getSanPhamGiamGiaApi,getSanPhamBanChayApi } from "../../../api/SanPhamApi";
import { Link } from "react-router-dom";

const TrangChu = () => {
  const [sanPhamGiamGia, setSanPhamGiamGia] = useState([]);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);

  const fetchSanPhamGiamGia = async () => {
    try {
      const res = await getSanPhamGiamGiaApi();
      setSanPhamGiamGia(res.data);
    } catch (error) {
      console.error("Failed to fetch product list: ", error);
    }
  };
  const fetchSanPhamBanChay = async () => {
    try {
      const res = await getSanPhamBanChayApi();
      console.log(res.data);
      setSanPhamBanChay(res.data);
    } catch (error) {
      console.error("Failed to fetch product list: ", error);
    }
  }
  useEffect(() => {
    fetchSanPhamGiamGia();
    fetchSanPhamBanChay();
  }, []);
  return (
    <div className="text-center mx-auto">
      <HomeCarousel />
      <h1 className="text-2xl uppercase font-bold mt-8 text-gray-600 inline-block w-75">
        Thương hiệu nổi bật
        <hr className="mt-5" />
      </h1>

      {/* Thương hiệu */}
      <div>
        <div className="flex justify-center justify-center mt-6">
          <Link to={"/filter?thuongHieu=1"} >
            <img
              className="hover:scale-110 transition-all duration-300 cursor-pointer "
              src="\src\assets\images\thuonghieu\logoAdidas.png"
              style={{
                width: "250px",
                height: "150px",
                marginRight: "20px",
                marginLeft: "20px",
              }}
              alt=""
            />
          </Link>
          <Link to={"/filter?thuongHieu=2"} >
            <img
              className="hover:scale-110 transition-all duration-300 cursor-pointer "
              src="\src\assets\images\thuonghieu\logo-nike-1.jpg"
              style={{
                width: "250px",
                height: "150px",
                marginRight: "20px",
                marginLeft: "20px",
              }}
              alt=""
            />
          </Link>
          <Link to={"/filter?thuongHieu=3"} >
            <img
              className="hover:scale-110 transition-all duration-300 cursor-pointer "
              src="\src\assets\images\thuonghieu\puma-logo-3.jpg"
              style={{
                width: "250px",
                height: "150px",
                marginRight: "20px",
                marginLeft: "20px",
              }}
              alt=""
            />
          </Link>
          <Link to={"/filter?thuongHieu=4"} >
            <img
              className="hover:scale-110 transition-all duration-300 cursor-pointer "
              src="\src\assets\images\thuonghieu\logoNewBalance.jpg"
              style={{
                width: "250px",
                height: "150px",
                marginRight: "20px",
                marginLeft: "20px",
              }}
              alt=""
            />
          </Link>




        </div>
      </div>

      <TitleSanPham
        title={"Sản phẩm khuyến mãi"}
        description={"Các sản phẩm đang được khuyến mãi"}
      />

      <SPKhuyenMaiCarousel data={sanPhamGiamGia} />

      <TitleSanPham
        title={" Top bán chạy"}
        description={"Top sản phẩm bán chạy nhất"}
      />

      {/* <div className="mx-auto w-[1300px] flex-wrap flex justify-around">
        {sanPhamBanChay.map((product) => (
          <CardItem key={product.id} product={product} />
        ))}
      </div> */}
      <SPKhuyenMaiCarousel data={sanPhamBanChay} />
      <div>
        <Link to="/filter">
        <button className="btn border rounded-xl px-10 py-2 border-black hover:bg-black hover:text-white  ">Xem Thêm &gt;</button>
        </Link>
      </div>
    </div>
  );
};

export default TrangChu;
