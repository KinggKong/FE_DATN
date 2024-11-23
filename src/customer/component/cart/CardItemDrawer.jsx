import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";

export default function CardItemDrawer({ product, onQuantityChange, onRemove }) {
  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      <div className="w-15 h-10 bg-gray-200 rounded-md flex-shrink-0">
        <img
          src={product.sanPhamChiTietResponse.hinhAnhList[0].url || ""}
          className="w-full h-full"
          alt={product.name || "Product Image"}
        />
      </div>
      <div className="flex-grow">
        <h5 className="text-sm font-semibold text-gray-800 mb-1">
          {product.sanPhamChiTietResponse.tenSanPham || "Tên sản phẩm"}
        </h5>
        <p className="text-sm text-gray-600 mb-2">
          Kích thước: {product.sanPhamChiTietResponse.tenKichThuoc}, Màu: {product.sanPhamChiTietResponse.tenMauSac}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuantityChange(product.sanPhamChiTietResponse.id, -1)} // Giảm số lượng
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
              disabled={product.soLuong <= 1} // Disable khi số lượng <= 1
            >
              <CiCircleMinus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center">{product.soLuong}</span>

            <button
              onClick={() => onQuantityChange(product.sanPhamChiTietResponse.id, 1)} // Tăng số lượng
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
              disabled={product.soLuong >= product.sanPhamChiTietResponse.soLuong} // Disable khi số lượng >= max stock
            >
              <CiCirclePlus className="w-4 h-4" />
            </button>

          </div>


          <p className="text-sm font-semibold text-gray-800">
            {/* Kiểm tra nếu giá giảm khác giá gốc mới hiển thị */}
            {product.sanPhamChiTietResponse.giaBan && product.discountPrice < product.sanPhamChiTietResponse.giaBan ? (
              <>
                {/* Giá giảm */}
                <span className="text-red-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discountPrice)}
                </span>

                {/* Giá gốc với dấu gạch chéo */}
                <span className="text-gray-500 line-through ml-2">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTien)}

                </span>
              </>
            ) : (
              // Nếu không có giá giảm, chỉ hiển thị giá gốc
              <span className="text-gray-800">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTien)}
              </span>
            )}
          </p>

        </div>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => onRemove(product.sanPhamChiTietResponse.id,)}
      >
        <TiDeleteOutline className="w-5 h-5" />
      </button>
    </div>
  );
}
