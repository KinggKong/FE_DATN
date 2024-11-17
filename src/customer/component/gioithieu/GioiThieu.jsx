import React from 'react';
import { Button, Carousel } from 'antd';
import { ShoppingOutlined, SafetyOutlined, RocketOutlined, HeartOutlined } from '@ant-design/icons';

const GioiThieu = () => {
  return (
    <main className="bg-gray-50">
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bước vào Tương lai với 3HST</h1>
            <p className="text-xl mb-8">Trải nghiệm sự thoải mái và phong cách với giày 3HST.</p>
            <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100">
              Mua sắm ngay
            </Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="src\assets\images\product\Adidas_Forum_Low_Core_Black.png"
              alt="Giày 3HST nổi bật"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Bộ sưu tập mới nhất của chúng tôi</h2>
          <Carousel autoplay className="mb-12">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="px-4">
                <img
                  src={`/placeholder.svg?height=300&width=300&text=Giày+${index}`}
                  alt={`Giày ${index}`}
                  className="mx-auto rounded-lg shadow-md w-full h-auto"
                />
              </div>
            ))}
          </Carousel>
          <div className="text-center">
            <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700">
              Xem tất cả sản phẩm
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn 3HST?</h2>
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

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
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


      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng cấp phong cách của bạn?</h2>
          <p className="text-xl mb-8">Khám phá bộ sưu tập 3HST và tìm đôi giày hoàn hảo của bạn ngay hôm nay.</p>
          <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100">
            Mua sắm ngay
          </Button>
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

export default GioiThieu;