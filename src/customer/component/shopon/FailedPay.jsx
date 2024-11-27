import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Result } from 'antd';
import { CloseCircleFilled, HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const FailedPay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = new URLSearchParams(location.search).get('error') || 'Đã xảy ra lỗi trong quá trình thanh toán.';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <Result
          status="error"
          title={<Title level={2} className="text-red-600">Thanh toán thất bại</Title>}
          subTitle={<Text className="text-lg text-gray-600">{errorMessage}</Text>}
          icon={<CloseCircleFilled className="text-red-500 text-6xl" />}
        />

        <div className="text-center mt-8">
          <Paragraph className="text-gray-600 mb-6">
            Rất tiếc, đã xảy ra lỗi trong quá trình xử lý đơn hàng của bạn. 
            Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi để được giúp đỡ.
          </Paragraph>

          <div className="flex justify-center space-x-4">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={() => navigate('/cart')}
              className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            >
              Quay lại giỏ hàng
            </Button>
            <Button
              icon={<HomeOutlined />}
              size="large"
              onClick={() => navigate('/')}
              className="border-gray-300 hover:border-gray-400 text-gray-700"
            >
              Trang chủ
            </Button>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Title level={4} className="text-center mb-4">Bạn cần hỗ trợ?</Title>
          <div className="text-center">
            <Text className="text-gray-600">
              Nếu bạn cần trợ giúp hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:
            </Text>
            <div className="mt-2">
              <Text strong className="text-blue-600">Email: </Text>
              <Text>support@example.com</Text>
            </div>
            <div>
              <Text strong className="text-blue-600">Điện thoại: </Text>
              <Text>1900 123 456</Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FailedPay;

