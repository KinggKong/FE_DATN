import React from 'react'
import TimKiem from '../../component/product/TimKiem'
import TableKichThuoc from '../../component/product/kichthuoc/TableKichThuoc'

const KichThuoc = () => {
  return (
    <div>
        <TimKiem title={"Kích cỡ"} placeholder={"Nhập vào kích cỡ của giày mà bạn muốn tìm !"}/>
        <TableKichThuoc/>
    </div>
  )
}

export default KichThuoc
