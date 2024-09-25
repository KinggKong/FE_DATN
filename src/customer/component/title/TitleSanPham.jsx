import React from "react";

const TitleSanPham = ({title,description}) => {
  
  return (
    <div>
      <h1 className="text-2xl uppercase font-bold mt-14 text-gray-600">
        {title}
      </h1>
      <span className="text-gray-600 w-70 inline-block ">
        {description }
        <hr className="mt-5" />
      </span>
    </div>
  );
};

export default TitleSanPham;
