
import TableSanPhamChiTiet from "../../component/product/spct/TableSanPhamChiTiet";
import { Link } from 'react-router-dom';
import { Button } from "antd";
import DrawerAdd from "../../component/product/spct/Drawer";

const SanPhamChiTiet = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Quản lý sản phẩm chi tiết</h1>
      {/* <Button type="primary">
        <Link to="/admin/sanphamchitiet/add">Thêm mới</Link>
      </Button> */}
      {/* <DrawerAdd /> */}
      <TableSanPhamChiTiet />
    </div>
  )
}
export default SanPhamChiTiet;