import { React, useEffect, useState } from 'react'
import { Flex, Layout, Row, Col, Breadcrumb } from 'antd';
import FilterSidebar from './filterPage/filterSidebar';
import { getAllSanPhamByCustomerApi } from '../../../api/SanPhamApi';
import CardItem from '../card/CardItem';
const { Header, Footer, Sider, Content } = Layout;
import { Link } from "react-router-dom";



const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  // color: '#fff',
  backgroundColor: 'white',
};



const FilterProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


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

  useEffect(() => {
    fetchProducts();
  }, []);

  //Lọc theo giá
  const [activeSort, setActiveSort] = useState("Mới nhất");

  const sortOptions = [
    "Mới nhất",
    "Giảm giá",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
  ];

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
          <FilterSidebar onFilter={setFilteredProducts}/>
        </Sider>

        <Content >
          <div style={{textAlign:"start",minHeight:"20px"}}>
           
          
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
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={8}>
                <CardItem product={product} key={product.id} />
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>


    </div>
  )
}

export default FilterProduct
