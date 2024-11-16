import React from "react";
import { Card, Image, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const CardItem = ({ product }) => {
  return (
    <div>
      <Card
        hoverable
        style={{
          width: 260,
          margin: "20px",
        }}
        className="rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
        cover={
          <Image
            className="rounded-t-xl"
            width={260}
            src={product?.image || "https://via.placeholder.com/260"}
            alt={product?.name || "Product Image"}
            placeholder={
              <div style={{ textAlign: "center", lineHeight: "260px" }}>
                Loading...
              </div>
            }
          />
        }
      >
        <div className="text-start">
          <h3 className="text-[15px] font-bold">
            {product?.name || "Tên sản phẩm"}
          </h3>

          <div className="flex justify-between items-center mt-3">
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product?.price || 0)}
            </span>
            <Button
              type="primary"
              shape="circle"
              icon={<ShoppingCartOutlined />}
              onClick={() => console.log("Thêm vào giỏ:", product?.id)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardItem;
