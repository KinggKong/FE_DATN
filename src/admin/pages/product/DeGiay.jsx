import React from 'react'
import { Space, Table, Tag } from 'antd';


import TimKiem from '../../component/product/TimKiem';
import ModalThemMoi from '../../component/product/ModalThemMoi';
import TableDeGiay from '../../component/product/degiay/TableDeGiay';
import { useState } from 'react';

const DeGiay = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm

  const handleSearchChange = (value) => {
    setSearchTerm(value); // Cập nhật giá trị tìm kiếm
  };
  return (
    <div>

      <div>
        <TimKiem
          title={"Đế giày"}
          placeholder={"Nhập vào loại đế giày của giày mà bạn muốn tìm !"}
          onSearchChange={handleSearchChange} // Truyền hàm tìm kiếm
        />
        <TableDeGiay searchTerm={searchTerm} />
      </div>

    </div>
  )
}



export default DeGiay;
