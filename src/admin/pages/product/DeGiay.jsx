
import TableDeGiay from '../../component/product/degiay/TableDeGiay';
import { useState } from 'react';

const DeGiay = () => {
  
  return (
    <div>

      <div>
        {/* <TimKiem
          title={"Đế giày"}
          placeholder={"Nhập vào loại đế giày của giày mà bạn muốn tìm !"}
          onSearchChange={handleSearchChange} // Truyền hàm tìm kiếm
        /> */}
        <TableDeGiay/>
      </div>

    </div>
  )
}



export default DeGiay;
