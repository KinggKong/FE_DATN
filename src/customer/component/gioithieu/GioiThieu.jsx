import React from "react";
import { Button, Carousel, Collapse } from "antd";
import {
  ShoppingOutlined,
  SafetyOutlined,
  RocketOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  CircleIcon as RunCircleIcon,
  TrendingUpIcon,
  ZapIcon,
  TrophyIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

const GioiThieu = () => {
  return (
    <main className="bg-gray-50">
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bước vào Tương lai với 3HST
            </h1>
            <p className="text-xl mb-8">
              Trải nghiệm sự thoải mái và phong cách với giày 3HST.
            </p>
            <Link to={"/filter"}>
              <Button
                type="primary"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Mua sắm ngay
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="src/assets/images/product/Adidas_Forum_Low_Core_Black.png"
              alt="Giày 3HST nổi bật"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Bộ sưu tập của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CollectionCard
              icon={<RunCircleIcon className="w-12 h-12 text-blue-600" />}
              title="Giày Chạy Bộ"
              description="Thoải mái và hỗ trợ cho mọi bước chạy của bạn."
            />
            <CollectionCard
              icon={<TrendingUpIcon className="w-12 h-12 text-blue-600" />}
              title="Giày Tập Luyện"
              description="Đa năng cho mọi bài tập của bạn tại phòng gym."
            />
            <CollectionCard
              icon={<ZapIcon className="w-12 h-12 text-blue-600" />}
              title="Giày Thể Thao"
              description="Phong cách và thoải mái cho cuộc sống hàng ngày."
            />
            <CollectionCard
              icon={<TrophyIcon className="w-12 h-12 text-blue-600" />}
              title="Giày Thi Đấu"
              description="Hiệu suất cao cho các vận động viên chuyên nghiệp."
            />
          </div>
          <div className="text-center mt-12">
            <Link to={"/filter"}>
              <Button
                type="primary"
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn 3HST?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ShoppingOutlined className="text-4xl text-blue-600" />}
              title="Đa dạng lựa chọn"
              description="Tìm đôi giày hoàn hảo từ bộ sưu tập đa dạng của chúng tôi."
            />
            <FeatureCard
              icon={<SafetyOutlined className="text-4xl text-blue-600" />}
              title="Chất lượng cao cấp"
              description="Được chế tác từ các vật liệu cao cấp để đảm bảo độ bền và thoải mái."
            />
            <FeatureCard
              icon={<RocketOutlined className="text-4xl text-blue-600" />}
              title="Giao hàng nhanh chóng"
              description="Nhận đôi giày yêu thích của bạn nhanh chóng tại nhà."
            />
            <FeatureCard
              icon={<HeartOutlined className="text-4xl text-blue-600" />}
              title="Hài lòng khách hàng"
              description="Ưu tiên hàng đầu của chúng tôi là đảm bảo bạn yêu thích đôi giày mới."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Khách hàng nói gì về chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Nguyễn Văn A"
              comment="Giày 3HST là sự kết hợp hoàn hảo giữa phong cách và thoải mái. Tôi không thể ngừng giới thiệu cho bạn bè!"
            />
            <TestimonialCard
              name="Trần Thị B"
              comment="Chất lượng vượt trội và dịch vụ khách hàng tuyệt vời. 3HST đã trở thành thương hiệu giày yêu thích của tôi."
            />
            <TestimonialCard
              name="Lê Văn C"
              comment="Thiết kế hiện đại và độ bền đáng kinh ngạc. Đầu tư vào 3HST là quyết định sáng suốt nhất của tôi."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Chính sách của 3HST
          </h2>
          <Collapse defaultActiveKey={["1"]} className="mb-8">
            <Panel header="Chính Sách Bán Hàng" key="1">
              <h3 className="font-semibold mb-2">Giá Cả và Khuyến Mãi:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>
                  Cập nhật thường xuyên giá bán các sản phẩm giày thể thao.
                </li>
                <li>Mức giá phải chăng cho mọi người tiêu dùng.</li>
                <li>
                  Chương trình giảm giá và khuyến mãi vào các dịp đặc biệt.
                </li>
                <li>
                  Ưu đãi khuyến mại và giảm giá tùy thuộc vào giá trị đơn hàng
                  và loại sản phẩm.
                </li>
              </ul>
              <h3 className="font-semibold mb-2">Đặt Hàng và Thanh Toán:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Đặt hàng trực tuyến hoặc trực tiếp tại cửa hàng.</li>
                <li>Chấp nhận thanh toán khi nhận hàng (COD).</li>
                <li>Hệ thống thanh toán an toàn, bảo mật.</li>
              </ul>
              <h3 className="font-semibold mb-2">Quy Định Về Đơn Hàng:</h3>
              <ul className="list-disc pl-5">
                <li>
                  Giới hạn tối đa 20 mặt hàng, tổng giá trị không quá 10 triệu
                  đồng.
                </li>
                <li>Tối đa 5 sản phẩm cho mỗi mặt hàng.</li>
                <li>
                  {" "}
                  Nếu khách hàng muốn mua số lượng lớn hơn, vui lòng liên hệ
                  chúng tôi qua số điện thoại <b>0374269862</b> để nhận thêm
                  nhiều ưu đãi .
                </li>
                <li>
                  Thông báo thông tin đơn hàng về email khi đặt hàng thành công.
                </li>
              </ul>
            </Panel>
            <Panel header="Chính Sách Giao Hàng" key="2">
              <h3 className="font-semibold mb-2">Phương Thức Giao Hàng:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Dịch vụ giao hàng nhanh.</li>
                <li>Thời gian giao hàng dựa trên địa chỉ khách hàng.</li>
                <li>
                  Chúng tôi chỉ chấp nhận thanh toán khi nhận hàng (COD). Quý
                  khách sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận
                  sản phẩm.
                </li>
              </ul>
              <h3 className="font-semibold mb-2">Phí Giao Hàng:</h3>
              <ul className="list-disc pl-5">
                <li>Dưới 40 km: 30,000 VND</li>
                <li>40 km - dưới 100 km: 50,000 VND</li>
                <li>100 km - dưới 200 km: 60,000 VND</li>
                <li>200 km - dưới 400 km: 70,000 VND</li>
                <li>Trên 400 km: 90,000 VND</li>
              </ul>
            </Panel>
            <Panel header="Chính Sách Khuyến Mãi và Giảm Giá" key="3">
              <h3 className="font-semibold mb-2">Giảm Giá Thường Xuyên:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Chương trình giảm giá định kỳ theo mùa.</li>
              </ul>
              <h3 className="font-semibold mb-2">
                Giảm Giá và Phiếu Khuyến Mại:
              </h3>
              <ul className="list-disc pl-5">
                <li>
                  Phiếu giảm giá áp dụng theo tỷ lệ phần trăm hoặc giá trị cố
                  định.
                </li>
              </ul>
            </Panel>
            <Panel header="Chính Sách Hủy Đơn Hàng" key="4">
              <ul className="list-disc pl-5">
                <li>Có thể hủy đơn hàng trước khi sản phẩm được vận chuyển.</li>
                <li>
                  Không thể hủy đơn hàng sau khi đã giao cho đơn vị vận chuyển.
                </li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng nâng cấp phong cách của bạn?
          </h2>
          <p className="text-xl mb-8">
            Khám phá bộ sưu tập 3HST và tìm đôi giày hoàn hảo của bạn ngay hôm
            nay.
          </p>
          <Link to={"/filter"}>
            <Button
              type="primary"
              size="large"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Mua sắm ngay
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ name, comment }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{comment}"</p>
      <p className="font-semibold">{name}</p>
    </div>
  );
};

const CollectionCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
export default GioiThieu;
