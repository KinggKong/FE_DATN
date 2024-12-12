import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";
import moment from "moment";
import '../../../assets/style/cssEndDateDiscount.css';
import { useEffect, useState } from "react";

export default function CardItemDrawer({ product, onQuantityChange, onRemove }) {
  const [timeLeft, setTimeLeft] = useState('');

  // Hàm để tính toán thời gian còn lại
  const calculateTimeLeft = () => {
    const now = moment();
    const endDate = moment(product.thoiGianGiamGia);
    const duration = moment.duration(endDate.diff(now));

    // Kiểm tra nếu hết thời gian giảm giá
    if (duration.asMilliseconds() <= 0) {
      setTimeLeft('Khuyến mãi đã kết thúc');
    } else {
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      if (days > 0) {
        setTimeLeft(`Flash sale kết thúc sau ${days} ngày nữa`);
      } else if (hours > 0) {
        setTimeLeft(`Flash sale kết thúc sau ${hours} giờ nữa`);
      } else if (minutes > 0) {
        setTimeLeft(`Flash sale kết thúc sau ${minutes} phút nữa`);
      } else if (seconds > 0) {
        setTimeLeft(`Flash sale kết thúc sau ${seconds} giây nữa`);
      } else {
        setTimeLeft("Flash sale đã kết thúc");
      }
    }
  };

  // Cập nhật countdown mỗi giây
  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Kiểm tra trạng thái sản phẩm
  const isUnavailable = product.sanPhamChiTietResponse.trangThai === 0;
  const isOutOfStock = product.sanPhamChiTietResponse.soLuong === 0;

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      <div
        className="bg-gray-200 rounded-md flex-shrink-0"
        style={{ width: "100px", height: "50px", overflow: "hidden" }}
      >
        <img
          src={product.sanPhamChiTietResponse.hinhAnhList[0]?.url || ""}
          className="w-full h-full object-cover"
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
        <p className="text-sm text-gray-600 mb-2">
          {product.thoiGianGiamGia ? (
            <span className="font-semibold text-blue-600 sliding-text">
              {timeLeft}
            </span>
          ) : null}
        </p>

        <div className="flex items-center justify-between">
          {isUnavailable ? (
            <div className="text-red-500 text-sm italic">
              Sản phẩm này đã ngừng bán.
            </div>
          ) : isOutOfStock ? (
            <div className="text-red-500 text-sm italic">
              Sản phẩm đã hết hàng.
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onQuantityChange(product.sanPhamChiTietResponse.id, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                  disabled={product.soLuong <= 1}
                >
                  <CiCircleMinus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center">{product.soLuong}</span>

                <button
                  onClick={() => onQuantityChange(product.sanPhamChiTietResponse.id, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                  disabled={product.soLuong >= product.sanPhamChiTietResponse.soLuong}
                >
                  <CiCirclePlus className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-semibold text-gray-800">
                {(product.sanPhamChiTietResponse.giaBan && product.giaTien < product.sanPhamChiTietResponse.giaBan) ||
                (product.sanPhamChiTietResponse.giaBan && product.discountPrice < product.sanPhamChiTietResponse.giaBan) ? (
                  <>
                    {product.discountPrice ? (
                      <span className="text-red-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discountPrice)}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTien)}
                      </span>
                    )}
                    <span className="text-gray-500 line-through ml-2">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.sanPhamChiTietResponse.giaBan)}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-800">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaTien)}
                  </span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => onRemove(product.sanPhamChiTietResponse.id)}
      >
        <TiDeleteOutline className="w-5 h-5" />
      </button>
    </div>
  );
}



