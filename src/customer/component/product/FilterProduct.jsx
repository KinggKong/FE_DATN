import React from 'react'
import { Flex, Layout } from 'antd';
import FilterSidebar from './filterPage/filterSidebar';
const { Header, Footer, Sider, Content } = Layout;


const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  // backgroundColor: '#0958d9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  // color: '#fff',
  backgroundColor: 'white',
};

const FilterProduct = () => {

  
  return (
    <div>
       

      <Layout>
        <Sider width="25%" style={siderStyle}>
          <FilterSidebar />
        </Sider>
        
        <Content  style={contentStyle}>Content</Content>
      </Layout>
   
     
    </div>
  )
}

export default FilterProduct
