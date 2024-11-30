import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Typography, Card } from "antd";
import { getViecCanLamApi } from "../../../api/ThongKeApi";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const TongQuan = () => {
  const [data, setData] = useState([
    { label: "Chờ Xác Nhận", value: 0 },
    { label: "Chờ Lấy Hàng", value: 0 },
    { label: "Đang giao hàng", value: 0 },
    { label: "Sản Phẩm Hết Hàng", value: 0 },
  ]);
 

  const fetchData = useCallback( async () => {
    try {
      const res = await getViecCanLamApi();
      console.log("res", res);
      if (res.code === 1000) {
       
        const transformedData = [
          { label: "Chờ Xác Nhận", value: res.data.donChoXacNhan },
          { label: "Chờ Lấy Hàng", value:res.data.donChoLayHang },
          { label: "Đang giao hàng", value: res.data.donDangGiaoHang },
          { label: "Sản Phẩm Hết Hàng", value: res.data.sanPhamHetHang },
        ];
  
        setData(transformedData);
      }

    }catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Danh sách việc cần làm</Title>

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
              <Title level={4} style={{ marginBottom: "10px", color: "#1890ff" }}>
                {item.value}
              </Title>
              <Text>{item.label}</Text>
            </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TongQuan;
