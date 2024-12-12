import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Typography, Card, Space } from "antd";
import { getViecCanLamApi } from "../../../api/ThongKeApi";
import { Link } from "react-router-dom";
import moment from "moment";
import logo from '../../../assets/images/3HST.png';

const { Title, Text } = Typography;

const TongQuan = () => {
  const [data, setData] = useState([
    { label: "Chờ Xác Nhận", value: 0 },
    { label: "Chờ Lấy Hàng", value: 0 },
    { label: "Đang giao hàng", value: 0 },
    { label: "Sản Phẩm Hết Hàng", value: 0 },
  ]);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  const fetchData = useCallback(async () => {
    try {
      const res = await getViecCanLamApi();
      console.log("res", res);
      if (res.code === 1000) {
        const transformedData = [
          { label: "Chờ Xác Nhận", value: res.data.donChoXacNhan },
          { label: "Chờ Lấy Hàng", value: res.data.donChoLayHang },
          { label: "Đang giao hàng", value: res.data.donDangGiaoHang },
          { label: "Sản Phẩm Hết Hàng", value: res.data.sanPhamHetHang },
        ];
        setData(transformedData);
      }
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [fetchData]);

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Danh sách việc cần làm</Title>
        </Col>

      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {data.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Link to="/admin/order-management">
              <Card
                bordered={false}
                style={{
                  textAlign: "center",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <Title
                  level={4}
                  style={{ marginBottom: "10px", color: "#1890ff" }}
                >
                  {item.value}
                </Title>
                <Text>{item.label}</Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Row style={{ marginTop: "20px", justifyContent: "center", textAlign: "center" }}>
        <Col>
          <Space direction="vertical" align="center">
            <Text style={{ fontSize: "36px", fontWeight: "bold" }}>
              {currentTime}
            </Text>
            <Text style={{ fontSize: "18px" }}>
              {moment().format("dddd, DD/MM/YYYY")}
            </Text>
          </Space>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px", justifyContent: "center", textAlign: "center" }}>
        <Col>
          <img
            src={logo} 
            alt="Logo"
            style={{ width: "150px", height: "auto" }} 
          />
        </Col>
      </Row>

    </div>
  );
};

export default TongQuan;
