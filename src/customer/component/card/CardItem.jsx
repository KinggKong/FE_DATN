import React from "react";
import { Card, Image } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";


const CardItem = ({product}) => {
  console.log(product);  
  return (
    <div>
      <Card
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
      </Card>
    </div>
  );
};

export default CardItem;
