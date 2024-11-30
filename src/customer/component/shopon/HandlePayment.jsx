import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HandlePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('paymentStatus');
    const orderCode = searchParams.get('orderCode');
    console.log("Handling payment result");

    if (paymentStatus === '1') {
      navigate(`/infor-order?maHoaDon=${orderCode}`);
    } else {
      navigate('/failed-pay');
    }
  }, [navigate, location]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Đang xử lý kết quả thanh toán...</h1>
    </div>
  );
};

export default HandlePayment;

