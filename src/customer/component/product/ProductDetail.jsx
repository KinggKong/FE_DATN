import React, { useState, useEffect } from "react";
import { Row, Col, Image, Typography, Button, Radio, InputNumber, Card, Breadcrumb } from "antd";
import { useParams } from 'react-router-dom';
import { getSanPhamByIdApi, getSanPhamByIdDanhMucApi } from "../../../api/SanPhamApi";
import CardItem from "../card/CardItem";
import SPKhuyenMaiCarousel from "../carousel/SPKhuyenMaiCarousel";
import { Link } from "react-router-dom";
import { SyncOutlined, TrophyOutlined, CarOutlined, CreditCardOutlined } from "@ant-design/icons";
const ProductDetail = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [productPrice, setProductPrice] = useState(0); // Thêm state cho giá sản phẩm
  const [stockQuantity, setStockQuantity] = useState(0); // Thêm state cho số lượng tồn kho
  const [relatedProducts, setRelatedProducts] = useState([]);

  const features = [
    {
      icon: <SyncOutlined style={{ fontSize: "30px", color: "#FFC107" }} />,
      title: "Miễn Phí Giao Hàng",
      description: "Trên Toàn Quốc",
    },
    {
      icon: <TrophyOutlined style={{ fontSize: "30px", color: "#FFC107" }} />,
      title: "Hỗ Trợ Bảo Hành",
      description: "Từ 1 Đến 5 Năm",
    },
    {
      icon: <CarOutlined style={{ fontSize: "30px", color: "#FFC107" }} />,
      title: "Đổi Hàng Miễn Phí",
      description: "Trong 30 Ngày",
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: "30px", color: "#FFC107" }} />,
      title: "Hoàn Tiền 100%",
      description: "Nếu Sản Phẩm Lỗi",
    },
  ];

  const handleThumbnailClick = (url) => setSelectedImage(url);
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
    updatePrice(e.target.value, selectedColor); // Cập nhật giá khi thay đổi kích thước
  };

  // Cập nhật ảnh chính khi chọn màu
  const handleColorChange = (colorId) => {
    const color = productDetail.sanPhamChiTietList?.find((item) => item.id_mauSac === colorId);
    if (color) {
      setSelectedImage(color.hinhAnhList[0].url); // Lấy ảnh đầu tiên của màu
      setSelectedColor(colorId);
      updatePrice(selectedSize, colorId); // Cập nhật giá khi thay đổi màu
      setStockQuantity(color.soLuong); // Cập nhật số lượng tồn kho khi thay đổi màu
    }
  };

  const handleQuantityChange = (value) => setQuantity(value);

  // Cập nhật giá khi thay đổi kích thước hoặc màu sắc
  const updatePrice = (size, color) => {
    const selectedProduct = productDetail.sanPhamChiTietList.find(item =>
      item.id_mauSac === color && item.id_kichThuoc === size
    );

    if (selectedProduct) {
      setProductPrice(selectedProduct.giaBan); // Cập nhật giá mới
      setStockQuantity(selectedProduct.soLuong); // Cập nhật số lượng tồn kho khi thay đổi kích thước và màu
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await getSanPhamByIdApi(id);
      setProductDetail(res.data);
      const firstItem = res.data.sanPhamChiTietList?.[0];
      if (firstItem) {
        setSelectedColor(firstItem.id_mauSac);
        setSelectedSize(firstItem.id_kichThuoc);
        setSelectedImage(firstItem.hinhAnhList?.[0].url || "");
        setProductPrice(firstItem.giaBan); // Set giá mặc định
        setStockQuantity(firstItem.soLuong); // Set số lượng tồn kho mặc định
      }
      fetchProductByCategory(res.data.danhMuc.id);
    } catch (error) {
      console.log('Failed to fetch product detail: ', error);
    }
  };

  const fetchProductByCategory = async (idDanhMuc) => {
    try {
      const res = await getSanPhamByIdDanhMucApi(idDanhMuc);
      console.log(res);
      setRelatedProducts(res.data);
    }
    catch (error) {
      console.log('Failed to fetch product detail: ', error);
    }
  };



  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!productDetail) return <div>Loading...</div>;

  // Lọc các màu sắc và kích thước không trùng nhau
  const uniqueColors = productDetail.sanPhamChiTietList?.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id_mauSac === value.id_mauSac
    ))
  );

  const uniqueSizes = productDetail.sanPhamChiTietList?.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id_kichThuoc === value.id_kichThuoc
    ))
  );

  // Lọc các màu sắc có sẵn cho kích thước đã chọn
  const availableColorsForSelectedSize = uniqueColors?.filter((color) =>
    productDetail.sanPhamChiTietList?.some((item) =>
      item.id_mauSac === color.id_mauSac && item.id_kichThuoc === selectedSize
    )
  );

  // Lọc các kích thước có sẵn cho màu sắc đã chọn
  const availableSizesForSelectedColor = uniqueSizes?.filter((size) =>
    productDetail.sanPhamChiTietList?.some((item) =>
      item.id_kichThuoc === size.id_kichThuoc && item.id_mauSac === selectedColor
    )
  );



  return (
    <div style={{ padding: "20px" }}>
      <Breadcrumb className="text-xl font-semibold mb-2">
        <Breadcrumb.Item>
          <Link to={"/"} >
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/filter"} >
            Sản phẩm
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{productDetail.tenSanPham}</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[16, 16]}>
        {/* Cột hình ảnh sản phẩm */}
        <Col xs={24} md={10}>
          {/* Ảnh hiển thị chính */}
          <Image
            src={selectedImage}
            alt={productDetail.tenSanPham}
            style={{ borderRadius: "8px", marginBottom: "20px" }}
            preview={false}
          />

          {/* Danh sách ảnh nhỏ */}
          <Row gutter={[8, 8]}>
            {productDetail.sanPhamChiTietList?.find((item) => item.id_mauSac === selectedColor)?.hinhAnhList.map((thumb, index) => (
              <Col key={index} span={6}>
                <Image
                  src={thumb.url}
                  alt={`Thumb ${index}`}
                  preview={false}
                  style={{
                    border: selectedImage === thumb.url ? "2px solid #1890ff" : "none", // Đánh dấu ảnh đang được chọn
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleThumbnailClick(thumb.url)} // Thay đổi ảnh chính khi click
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Cột thông tin sản phẩm */}
        <Col xs={24} md={14}>
          <Typography.Title level={3}>{productDetail.tenSanPham}</Typography.Title>
          <Typography.Text strong style={{ fontSize: "20px", color: "#d0021b" }}>
            {productPrice.toLocaleString()} VND
          </Typography.Text>
          <Typography.Paragraph>Tình trạng: {productDetail.trangThai === 1 ? 'Còn hàng' : 'Hết hàng'}</Typography.Paragraph>

          {/* Số lượng tồn kho */}
          <Typography.Paragraph>Số lượng còn lại: {stockQuantity}</Typography.Paragraph>

          {/* Thông tin hỗ trợ */}
          <div style={{ margin: "20px 0", fontSize: "16px", lineHeight: "1.8" }}>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li>♻️ Hỗ trợ đổi size miễn phí trong vòng 30 ngày</li>
              <li>🔰 Bảo hành sản phẩm đến 1 năm</li>
              <li>🚚 Giao hàng nhanh toàn quốc</li>
              <li>💎 Kiểm tra hàng và thanh toán khi nhận hàng</li>
              <li>🎁 Bộ sản phẩm bao gồm: Hộp, Giấy Lót, Thẻ Bảo Hành, Thẻ Hướng Dẫn Bảo Quản</li>
            </ul>
          </div>

          {/* Kích thước */}
          <div style={{ marginBottom: "20px" }}>
            <Typography.Text>Kích thước: </Typography.Text>
            <Radio.Group onChange={handleSizeChange} value={selectedSize}>
              {availableSizesForSelectedColor?.map((item) => (
                <Radio.Button key={item.id_kichThuoc} value={item.id_kichThuoc}>
                  {item.tenKichThuoc}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* Màu sắc */}
          <div style={{ marginBottom: "20px" }}>
            <Typography.Text>Màu sắc: </Typography.Text>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {availableColorsForSelectedSize?.map((item) => (
                <Button
                  key={item.id_mauSac}
                  type={selectedColor === item.id_mauSac ? "primary" : "default"}
                  onClick={() => handleColorChange(item.id_mauSac)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={item.hinhAnhList[0]?.url}
                    alt={item.tenMauSac}
                    style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                  />
                  <span style={{ marginLeft: "5px" }}>{item.tenMauSac}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chọn số lượng */}
          <div style={{ marginBottom: "20px" }}>
            <Typography.Text>Số lượng: </Typography.Text>
            <InputNumber
              min={1}
              max={stockQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: "100px" }}
            />
          </div>

          {/* Nút mua hàng */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button
                type="primary"
                block
                size="large"
                style={{
                  backgroundColor: "black",  // Nền đen
                  borderColor: "black",
                  color: "white",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.borderColor = "black";
                  e.target.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "black";
                  e.target.style.borderColor = "black";
                  e.target.style.color = "white";
                }}
              >
                Thêm sản phẩm vào giỏ hàng
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                block
                size="large"
                style={{
                  backgroundColor: "green",  // Nền xanh lá
                  color: "white",
                  borderColor: "green",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.borderColor = "green";
                  e.target.style.color = "green";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "green";
                  e.target.style.borderColor = "green";
                  e.target.style.color = "white";
                }}
              >
                MUA NGAY VỚI GIÁ {productPrice.toLocaleString()} VND
              </Button>
            </Col>
          </Row>

        </Col>

      </Row >
      <Col xs={24} className="mt-3">
        {/* Tiêu đề Mô tả sản phẩm */}
        <Typography.Title
          level={4}
          style={{
            marginBottom: "10px",
            fontWeight: "bold",
            borderBottom: "2px solid #FFC107",
            display: "inline-block",
            paddingBottom: "5px",
          }}
        >
          Mô tả sản phẩm
        </Typography.Title>

        {/* Đoạn mô tả */}
        <Typography.Paragraph style={{ fontSize: "16px", lineHeight: "1.8", marginBottom: "20px" }}>
          Giày sục nam SA42 là một sản phẩm cao cấp mà mọi quý ông nên có trong bộ sưu tập của mình.
          Được làm từ chất liệu da cao cấp và thiết kế hiện đại với gam màu thời thượng, đôi giày này không chỉ đảm bảo sự thoải mái tối đa mà còn là một biểu tượng thời trang đẳng cấp,
          làm nổi bật phong cách của các phái mạnh.
        </Typography.Paragraph>


      </Col>
      <Row gutter={[16, 16]} style={{ background: "#f8f8f8", padding: "20px" }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <div
              style={{
                textAlign: "center",
                border: "1px solid #FFC107",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ marginBottom: "10px" }}>{feature.icon}</div>
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{feature.title}</div>
              <div>{feature.description}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Sản phẩm liên quan */}
      <div style={{ marginTop: "40px" }}>
        <Typography.Title level={3}>Sản phẩm liên quan</Typography.Title>
        {/* <Row gutter={[16, 16]}>
          {relatedProducts.map((product) => (
            <Col key={product.id} xs={12} md={8} lg={6}>
              <CardItem product={product} key={product.id} />
              
            </Col>
          ))}
        </Row> */}
        <SPKhuyenMaiCarousel data={relatedProducts} />
      </div>
    </div >
  );
};

export default ProductDetail;
