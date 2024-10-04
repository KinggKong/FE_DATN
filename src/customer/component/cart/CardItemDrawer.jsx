import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";

export default function CardItemDrawer() {
  const handleQuantityChange = () => {};

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      <div className="w-15 h-10 bg-gray-200 rounded-md flex-shrink-0">
        <img src="/src/assets/images/product/Nike_Air_Jordan_1_Retro_Low_Golf_Travis_Scott.png" className="w-full h-full" alt="" />
      </div>
      <div className="flex-grow">
        <h5 className="text-sm font-semibold text-gray-800 mb-1">
          Giày Nike Air Jordan 1 Retro Low Golf ‘Travis Scott’ FZ3124-200
        </h5>
        <p className="text-sm text-gray-600 mb-2">Kích thước: 34, Màu: Đen</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
            >
              <CiCircleMinus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center">10</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
            >
              <CiCirclePlus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-800">$500</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <TiDeleteOutline className="w-5 h-5" />
      </button>
    </div>
  );
}
