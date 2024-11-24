import React from "react";
import { Card, Image } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const CardItem = ({ product }) => {

  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/detail/${id}`); // Điều hướng tới trang chi tiết
  }

  return (
    <div>
      {/* Cái này là cái cũ của thây Huy */}
      {/* <Card
        hoverable
        style={{
          width: 260,
      
          margin: "20px",
        }}
        className="rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
        cover={<Image className="rounded-t-xl" width={260}  src={product?.image} />}
      >
        <div className="text-start">
          <h3 className="text-[15px] font-bold">
          {product?.name}
           
          </h3>

          <div className="flex justify-between items-center mt-3">
            <span>{product?.price}</span>
            <button className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
              <ShoppingCartOutlined />
            </button>
          </div>
        </div>
      </Card> */}


      <Card
        hoverable
        style={{
          width: 260,

          margin: "20px",
        }}
        className="rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
        cover={<Image
          className="rounded-t-xl"
          width={260}
          height={180} // Chiều cao cố định
          style={{ objectFit: "cover" }} // Đảm bảo ảnh vừa khít container
          src={product?.hinhAnh}
        />}

      >

        {/* Hiển thị phần trăm giảm giá */}
        {product?.phanTramGiamGia && (
          <div className="ribbon">
            -{product.phanTramGiamGia}%
          </div>
        )}

        {product?.soLuongBan > 0 && (
          <div className="absolute top-2 right-2 bg-green-700 text-white px-2 py-1 rounded-full text-sm">
            {product.soLuongBan} lượt bán
          </div>
        )}
        



        <div className="text-start" onClick={() => handleCardClick(product.id)}>
          <h3 className="text-[15px] font-bold">
            {product?.tenSanPham}

          </h3>

          <div className="flex justify-between items-center mt-3">
            <span>{product?.giaHienThi}</span>
            <button className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
              <ShoppingCartOutlined />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardItem;
