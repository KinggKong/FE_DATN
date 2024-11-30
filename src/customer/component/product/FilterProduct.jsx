import { React, useEffect, useState } from 'react'
import { Flex, Layout, Row, Col, Breadcrumb, Pagination } from 'antd';
import FilterSidebar from './filterPage/filterSidebar';
import { getAllSanPhamByCustomerFilterApi } from '../../../api/SanPhamApi';
import CardItem from '../card/CardItem';
const { Header, Footer, Sider, Content } = Layout;
import { Link } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";



const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  // color: '#fff',
  backgroundColor: 'white',
};



const FilterProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { searchValue } = useOutletContext();
  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterReady, setIsFilterReady] = useState(false);


  const fetchProducts = async () => {
    try {
      const params = {
        page: 1,
        limit: 10,
      };
      const res = await getAllSanPhamByCustomerApi(params);
      console.log(res);
      setProducts(res.data.content);
      console.log(products);

    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }
  //Lọc theo giá
  const [activeSort, setActiveSort] = useState("Mới nhất");

  const sortOptions = [
    "Mới nhất",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
  ];

  const fetchProductsByFilter = async () => {
    try {
      const sortMap = {
        "Mới nhất": "moiNhat",
        "Giá thấp đến cao": "tuThapDenCao",
        "Giá cao đến thấp": "tuCaoDenThap",
      };

      const filter = {

        danhMucs: filteredProducts.danhMucs,
        thuongHieu: filteredProducts.thuongHieu,
        chatLieuDes: filteredProducts.chatLieuDes,
        chatLieuVais: filteredProducts.chatLieuVais,
        minPrice: filteredProducts.minPrice,
        maxPrice: filteredProducts.maxPrice,
        tenSanPham: searchValue,
        pageNumber: currentPage - 1, // Backend thường bắt đầu từ 0
        pageSize: pageSize,
        sortBy: sortMap[activeSort] || "moiNhat",
      };
      console.log("filter", filter);
      const res = await getAllSanPhamByCustomerFilterApi(filter);
      console.log(res);
      // Lọc bỏ sản phẩm có soLuongSanPhamChiTiet = 0
      const locProduct = res.data.content.filter(
        (product) => product.soLuongSanPhamChiTiet > 0
      );
      setProducts(locProduct);
      setTotalItems(locProduct.length);
      console.log(products);

    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }
  useEffect(() => {
    const thuongHieu = searchParams.get("thuongHieu");

    // Cập nhật state filteredProducts chỉ khi giá trị thuongHieu thay đổi
    setFilteredProducts((prev) => {
      const parsedThuongHieu = thuongHieu ? parseInt(thuongHieu) : null;
      if (prev.thuongHieu !== parsedThuongHieu) {
        return { ...prev, thuongHieu: parsedThuongHieu };
      }
      return prev;
    });


    setIsFilterReady(true);
    // Không gọi fetchProductsByFilter liên tục nếu không cần thiết
  }, []);

  useEffect(() => {
    // Gọi API chỉ khi filteredProducts thay đổi
    if (!isFilterReady) return;
    fetchProductsByFilter(filteredProducts);
    setSearchParams(searchParams.delete("thuongHieu"));
  }, [filteredProducts, searchValue, activeSort, currentPage]);



  // useEffect(() => {

  //   const thuongHieu = searchParams.get("thuongHieu");
  //   setFilteredProducts(filteredProducts.thuongHieu = [thuongHieu]);
  //   // if (thuongHieu) {
  //   //   setFilteredProducts((prev) => ({
  //   //     ...prev,
  //   //     thuongHieu: parseInt(thuongHieu), // Chuyển thành số nguyên
  //   //   }));
  //   // }

  //   fetchProductsByFilter(filteredProducts);

  //   //  setSearchParams("thuongHieu",  filteredProducts.thuongHieu);

  //   console.log("filter", filteredProducts);
  // }, [filteredProducts, searchValue, activeSort, currentPage ]);




  const handleSortClick = (option) => {
    setActiveSort(option);
    console.log("Đã chọn:", option);
  };

  return (
    <div>
      <Breadcrumb className="text-xl font-semibold mb-2 mt-2 ms-4">
        <Breadcrumb.Item>
          <Link to={"/"} >
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Sản phẩm
        </Breadcrumb.Item>

      </Breadcrumb>


      <Layout>
        <Sider width="25%" style={siderStyle}>
          <FilterSidebar onFilter={setFilteredProducts} />
        </Sider>

        <Content style={{ backgroundColor: "white" }}>
          <div style={{ textAlign: "start", minHeight: "20px" }}>


            <div className='mt-2 ms-5'>
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>Ưu tiên xem:</span>
              {sortOptions.map((option) => (
                <a
                  key={option}
                  href="#"
                  onClick={() => handleSortClick(option)}
                  style={{
                    marginRight: "15px",
                    textDecoration: "none",
                    color: activeSort === option ? "#FFC107" : "#333",
                    fontWeight: activeSort === option ? "bold" : "500",
                  }}
                >
                  {option}
                </a>
              ))}
            </div>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "#888" }}>
              Không có sản phẩm phù hợp.
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
                  <CardItem product={product} />
                </Col>
              ))}
            </Row>
          )}
          {/* <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={8}>
                <CardItem product={product} key={product.id} />
              </Col>
            ))}
          </Row> */}
          <hr />
          {products.length === 0 ? (
            <div></div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", marginBottom: "16px" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                showSizeChanger
                pageSizeOptions={["5", "10", "20", "50", "100"]}
                onChange={(page, newPageSize) => {
                  setCurrentPage(page);
                  setPageSize(newPageSize);
                }}
              />
            </div>
          )}


        </Content>
      </Layout>


    </div>
  )
}

export default FilterProduct
