import React, { useState, useEffect } from "react";
import { Row, Col, Image, Typography, Button, Radio, InputNumber, Card, Breadcrumb, message } from "antd";
import { useParams } from 'react-router-dom';
import { getSanPhamByIdApi, getSanPhamByIdDanhMucApi } from "../../../api/SanPhamApi";
import CardItem from "../card/CardItem";
import SPKhuyenMaiCarousel from "../carousel/SPKhuyenMaiCarousel";
import { Link } from "react-router-dom";
import { SyncOutlined, TrophyOutlined, CarOutlined, CreditCardOutlined, WalletOutlined, EnvironmentOutlined, SafetyOutlined, GiftOutlined } from "@ant-design/icons";
import useCartStore from "../cart/useCartStore";
import { getSaleCTByPrDtApi } from "../../../api/SaleCTApi";
import { set } from "@ant-design/plots/es/core/utils";
const ProductDetail = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState({});
  const [detail, setDetail] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [nameSize, setNameSize] = useState(null);
  const [nameColor, setNameColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [productPrice, setProductPrice] = useState(0); // Thêm state cho giá sản phẩm
  const [stockQuantity, setStockQuantity] = useState(0); // Thêm state cho số lượng tồn kho
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productDetailId, setProductDetailId] = useState(null);
  const [productDiscountPrice, setProductDiscountPrice] = useState(0); // Thêm state cho giá sau khi giảm
  const [discountEndDate, setDiscountEndDate] = useState(null); // Thêm state cho thời gian kết thúc giảm giá
  const [saleForProduct, setSaleForProduct] = useState(null); // Thêm state cho thông tin khuyến mãi
  const { addToCart } = useCartStore();

  const features = [
    {
      icon: <GiftOutlined style={{ fontSize: "30px", color: "#4CAF50" }} />,
      title: "Ưu Đãi Đặc Biệt",
      description: "Dành Riêng Cho Thành Viên",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: "30px", color: "#4CAF50" }} />,
      title: "An Toàn Thanh Toán",
      description: "Bảo Mật Mọi Giao Dịch",
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: "30px", color: "#4CAF50" }} />,
      title: "Giao Hàng Nhanh",
      description: "Chỉ Trong 24 Giờ",
    },
    {
      icon: <WalletOutlined style={{ fontSize: "30px", color: "#FF5722" }} />,
      title: "Giá Cả Hợp Lý",
      description: "Cạnh Tranh Nhất Thị Trường",
    },
  ];

  const handleThumbnailClick = (url) => setSelectedImage(url);
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)

    // Tìm tên kích thước từ danh sách sản phẩm chi tiết
    const size = productDetail.sanPhamChiTietList?.find(item => item.id_kichThuoc === e.target.value);
    if (size) {
      setDetail(size);
      setNameSize(size.tenKichThuoc); // Cập nhật tên kích thước
    }
    updatePrice(e.target.value, selectedColor); // Cập nhật giá khi thay đổi kích thước

  };

  // Cập nhật ảnh chính khi chọn màu
  const handleColorChange = (colorId) => {
    const color = productDetail.sanPhamChiTietList?.find((item) => item.id_mauSac === colorId);
    console.log("Color", color);
    if (color) {
      setSelectedImage(color.hinhAnhList?.[0].url || "");
      setDetail(color);
      setSelectedColor(colorId);
      setNameColor(color.tenMauSac); // Cập nhật tên màu
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
      const basePrice = selectedProduct.giaBan; // Lấy giá gốc

      // Kiểm tra nếu sản phẩm có chương trình giảm giá
      let finalPrice = basePrice;
      let finalDiscountPrice = basePrice;
      if (saleForProduct && saleForProduct.phanTramGiam > 0) {
        finalDiscountPrice = basePrice * (1 - saleForProduct.phanTramGiam / 100); // Giá sau khi giảm
        setDiscountEndDate(saleForProduct.thoiGianKetThuc); // Cập nhật thời gian kết thúc giảm giá
      }

      setProductPrice(finalPrice); // Cập nhật giá gốc
      setProductDiscountPrice(finalDiscountPrice); // Cập nhật giá sau giảm

      setStockQuantity(selectedProduct.soLuong); // Cập nhật số lượng tồn kho khi thay đổi kích thước và màu
    }
  };

  useEffect(() => {
    if (selectedSize && selectedColor) {
      updatePrice(selectedSize, selectedColor);
    }
  }, [selectedSize, selectedColor, saleForProduct]);

  //Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const productToAdd = {
      id: productDetailId,
      sanPhamChiTietResponse: getProductDetail(productDetailId),
      name: productDetail.tenSanPham,
      giaTien: productPrice,
      discountPrice: productDiscountPrice, // Giá sau giảm
      thoiGianGiamGia: discountEndDate, // Thời gian kết thúc giảm giá (ISO format)
      selectedColor,
      selectedSize,
      nameColor,
      nameSize,
      soLuong: quantity || 1,
      image: selectedImage,


    }

    console.log("SP giỏ", productToAdd);


    addToCart(productToAdd); // Thêm sản phẩm vào giỏ hàng




  }

  // hàm tìm sản phẩm chi tiết từ danh sách thông qua idProductDetail
  const getProductDetail = (id) => {
    const productDetailItem = productDetail?.sanPhamChiTietList?.find(
      (item) => item.id === id
    );
    setDetail(productDetailItem);
    console.log("ProductDetail", productDetailItem);
    return productDetailItem ? productDetailItem : null;
  }



  const fetchProduct = async () => {
    try {
      const res = await getSanPhamByIdApi(id);
      setProductDetail(res.data);
      const firstItem = res.data.sanPhamChiTietList?.[0];
      setDetail(firstItem);
      if (firstItem) {
        setProductDetailId(firstItem.id); // Set id của productDetail mặc định
        setSelectedColor(firstItem.id_mauSac);
        setSelectedSize(firstItem.id_kichThuoc);
        setNameColor(firstItem.tenMauSac);
        setNameSize(firstItem.tenKichThuoc);
        setSelectedImage(firstItem.hinhAnhList?.[0].url || "");
        setProductPrice(firstItem.giaBan); // Set giá mặc định
        setStockQuantity(firstItem.soLuong); // Set số lượng tồn kho mặc định


      }
      fetchProductByCategory(res.data.danhMuc.id);
    } catch (error) {
      console.log('Failed to fetch product detail: ', error);
    }
  };



  const fetchSaleForProduct = async (id) => {
    try {
      const res = await getSaleCTByPrDtApi(id);

      // Kiểm tra nếu không có dữ liệu hoặc trang thái sale không phải là 1
      if (res.data && res.data.trangThaiSale === 1) {
        setSaleForProduct(res.data);
        console.log("Sale", res.data);
      } else {
        setSaleForProduct(null);
        console.log("Không tìm thấy đợt giảm giá hoặc trạng thái sale không phải 1");
      }
    } catch (error) {
      setSaleForProduct(null); // Đặt null khi có lỗi xảy ra
      console.log('Failed to fetch product detail: ', error);
    }
  };




  const fetchProductByCategory = async (idDanhMuc) => {
    try {
      const res = await getSanPhamByIdDanhMucApi(idDanhMuc);
      console.log("danh muc", res);
      const filteredProducts = res.data.filter((product) => product.id !== id && product.soLuongSanPhamChiTiet > 0);
      console.log("danh muc fiter", filteredProducts);
      setRelatedProducts(filteredProducts);
    }
    catch (error) {
      console.log('Failed to fetch product detail: ', error);
    }
  };



  useEffect(() => {

    fetchProduct();
    fetchSaleForProduct(productDetailId);

    console.log("Id spct", productDetailId);
  }, [id]);
  useEffect(() => {
    fetchSaleForProduct(productDetailId);
  }, [productDetailId]);


  // Hàm để lấy ProductDetail ID từ sizeID và colorID
  const getProductDetailId = (sizeID, colorID) => {
    const productDetailItem = productDetail?.sanPhamChiTietList?.find(
      (item) => item.id_kichThuoc === sizeID && item.id_mauSac === colorID
    );

    return productDetailItem ? productDetailItem.id : null; // Trả về id của ProductDetail hoặc null nếu không tìm thấy
  };

  useEffect(() => {
    // Kiểm tra nếu productDetail đã sẵn sàng và selectedSize, selectedColor đã có giá trị
    if (productDetail && selectedSize && selectedColor) {
      const id = getProductDetailId(selectedSize, selectedColor);
      setProductDetailId(id);
    }
  }, [selectedSize, selectedColor, productDetail]);


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
      <Breadcrumb className="font-semibold mb-2"
        style={{ fontSize: "14px" }}>
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
      <Row gutter={[16, 16]} style={{ padding: "0 100px  " }} >
        {/* Cột hình ảnh sản phẩm */}
        <Col xs={24} md={10}>
          {/* Ảnh hiển thị chính */}
          <Image
            src={selectedImage}
            alt={productDetail.tenSanPham}
            style={{
              borderRadius: "8px",
              marginBottom: "20px",
              width: "385px", // Đảm bảo chiếm toàn bộ chiều rộng container
              height: "385px", // Chiều cao cố định
              objectFit: "cover", // Cắt ảnh để phù hợp khung
            }}
            preview={false}
          />

          <Row
            gutter={0} // Không có khoảng cách giữa các cột
            style={{
              display: "flex", // Sử dụng flex để điều chỉnh
              gap: "4px", // Khoảng cách nhỏ giữa các ảnh
            }}
          >
            {productDetail.sanPhamChiTietList?.find(
              (item) => item.id_mauSac === selectedColor
            )?.hinhAnhList.map((thumb, index) => (
              <Col key={index} style={{ flex: "0 0 auto" }}>
                <Image
                  src={thumb.url}
                  alt={`Thumb ${index}`}
                  preview={false}
                  style={{
                    width: "80px", // Chiều rộng cố định
                    height: "80px", // Chiều cao cố định
                    objectFit: "cover", // Đảm bảo ảnh không bị méo
                    border:
                      selectedImage === thumb.url ? "2px solid #1890ff" : "none", // Đánh dấu ảnh đang được chọn
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Kiểm tra nếu có sale */}
            {saleForProduct ? (
              <>
                {/* Giá giảm */}
                <Typography.Text strong style={{ fontSize: "20px", color: "#d0021b" }}>
                  {productDiscountPrice.toLocaleString()} VND
                </Typography.Text>

                {/* Giá gốc với dấu gạch chéo */}
                <Typography.Text
                  delete
                  style={{
                    fontSize: "18px",
                    color: "gray",
                  }}
                >
                  {productPrice.toLocaleString()} VND
                </Typography.Text>

                {/* % giảm giá */}
                <Typography.Text
                  className="gradient-text shaking-text"
                  style={{
                    fontSize: "16px",
                    color: "#52c41a",
                    fontWeight: "bold",
                  }}
                >
                  Giảm {saleForProduct?.phanTramGiam ?? 0}%
                </Typography.Text>
              </>
            ) : (
              // Nếu không có sale, chỉ hiển thị giá gốc
              <Typography.Text strong style={{ fontSize: "20px", color: "#d0021b" }}>
                {productPrice.toLocaleString()} VND
              </Typography.Text>
            )}
          </div>


          <Typography.Paragraph
            style={{
              color:
                productDetail.trangThai === 1 && stockQuantity > 0 && detail.trangThai === 1
                  ? "green" // Màu xanh lá cho 'Còn hàng'
                  : productDetail.trangThai === 0 || detail.trangThai === 0
                    ? "gray"  // Màu xám cho 'Ngừng bán'
                    : "red",  // Màu đỏ cho 'Hết hàng'
              fontWeight: "bold", // Tùy chọn: làm chữ đậm hơn để nổi bật
            }}
          >
            Tình trạng:
            {productDetail.trangThai === 1 && stockQuantity > 0 && detail.trangThai === 1
              ? " Còn hàng"
              : productDetail.trangThai === 0 || detail.trangThai === 0
                ? " Ngừng bán"
                : " Hết hàng"}
          </Typography.Paragraph>



          {/* Số lượng tồn kho
          <Typography.Paragraph>Số lượng còn lại: {stockQuantity}</Typography.Paragraph> */}

          {/* Thông tin hỗ trợ */}
          <div style={{ margin: "20px 0", fontSize: "16px", lineHeight: "1.8" }}>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li>🔒 Bảo mật thông tin khách hàng tuyệt đối</li>
              <li>🚛 Giao hàng toàn quốc chỉ từ 2-5 ngày làm việc</li>
              <li>📋 Xuất hóa đơn VAT theo yêu cầu</li>
              <li>📞 Hỗ trợ khách hàng qua hotline 24/7: <b>1800 9999</b></li>
              <li>💼 Bộ sản phẩm bao gồm: Hóa đơn, Hướng Dẫn Sử Dụng</li>
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
            <Col span={24}>
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
                onClick={handleAddToCart} // Thêm sản phẩm vào giỏ hàng
                // disabled
                // className={`${productDetail.trangThai === 1 && stockQuantity > 0 ? "" : "disabled"}`}
                disabled={!(productDetail.trangThai === 1 && stockQuantity > 0 && detail.trangThai === 1)}
              >
                Thêm sản phẩm vào giỏ hàng
              </Button>
            </Col>
            {/* <Col span={12}>
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
            </Col> */}
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
          {productDetail.moTa}
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
