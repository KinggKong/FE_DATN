
// import React, { useState, useEffect } from 'react';
// import { Form, Select, Row, Col, Space, Button, Table, Input, Upload, notification  } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import { getAllMauSacApi, getMauSacByIdApi } from '../../../../api/MauSacApi';
// import { getAllKichThuocApi, getKichThuocByIdApi } from '../../../../api/KichThuocApi';
// import { createSanPhamChiTietApi } from '../../../../api/SanPhamChiTietAPI';
// const { Option } = Select;

// const FormWithColors = () => {
//   const [colors, setColors] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
//   const [sizes, setSizes] = useState([]);
//   const [color, setColor] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
//   const [size, setSize] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [productTitle, setProductTitle] = useState('');
//   useEffect(() => {
//     try {
//       const fetchData = async () => {
//         const response = await getAllKichThuocApi();
//         if (Array.isArray(response.data.content)) {
//           setSizes(response.data.content);  // Đảm bảo rằng response là mảng
//           console.log(response.data.content);
//         } else {
//           console.error('API response is not an array:', response.data);
//         }
//       };
//       fetchData();
//     } catch (error) {
//       console.error('Error fetching sizes:', error);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       const fetchData = async () => {
//         const response = await getAllMauSacApi();
//         if (Array.isArray(response.data.content)) {
//           setColors(response.data.content);  // Đảm bảo rằng response là mảng
//         } else {
//           console.error('API response is not an array:', response.data);
//         }
//       };
//       fetchData();
//     } catch (error) {
//       console.error('Error fetching colors:', error);
//     }
//   }, []);

//   useEffect(() => {
//     axios.get('https://api.escuelajs.co/api/v1/products')
//       .then(response => {
//         if (Array.isArray(response.data)) {
//           const newProduct = response.data.map(product => ({
//             value: product.id,
//             label: product.title,
//           }));
//           setProducts(newProduct);  // Đảm bảo rằng response là mảng                             
//         } else {
//           console.error('API response is not an array:', response.data);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching colors:', error);
//       });
//   }, []);

//   // const formItemLayout = {
//   //     labelCol: { span: 0 },
//   //     wrapperCol: { span: 24 },
//   //   };
//   const [tableData, setTableData] = useState([]);

//   const handleColorChange = (selectedColors) => {
//     setColor(selectedColors);
//     generateTableData(selectedColors, size, product);
//   };

//   const handleSizeChange = (selectedSizes) => {
//     setSize(selectedSizes);
//     generateTableData(color, selectedSizes, product);
//   };
//   const handleProductChange = (productId) => {
//     axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`)
//       .then(response => {
//         const selectedProduct = response.data; // Giả sử API trả về thông tin sản phẩm
//         setProduct(selectedProduct);
//         setProductTitle(selectedProduct.title);
//         generateTableData(color, size, selectedProduct);
//       })
//       .catch(error => {
//         console.error('Error fetching product:', error);
//       });
//   };
//   const handleDelete = (key) => {
//     const updatedData = tableData.filter((item) => item.key !== key); // Lọc bỏ dòng có key tương ứng
//     setTableData(updatedData); // Cập nhật lại dữ liệu
//   };
//   const normFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };
//   //   const generateTableData = (selectedColors, selectedSizes,selectedProduct) => {
//   //     const newData = [];
//   //     selectedColors.forEach((color) => {
//   //       selectedSizes.forEach((size) => {
//   //         newData.push({
//   //           key: `${color}-${size}`,
//   //           name: `${productTitle}: ${size}-${color}`,

//   //           soluong: 0,
//   //           gia: 0,
//   //           hinhanh: '',
//   //         });
//   //       });
//   //     });
//   //     setTableData(newData);
//   //   };
//   const generateTableData = (selectedColors, selectedSizes, selectedProduct) => {
//     const newData = [];

//     selectedColors.forEach((color) => {
//       const colorItem = colors.find((item) => item.id === color);

//       const variants = selectedSizes.map((size) => {
//         const sizeItem = sizes.find((item) => item.id === size); // Sửa lỗi

//         return {
//           key: `${color}-${size}`,
//           id_mauSac: color,
//           id_kichThuoc: size,
//           maSanPham: generateProductCode(selectedProduct.title),
//           id_sanPham: selectedProduct.id,
//           name: `${selectedProduct.title}: ${sizeItem.tenKichThuoc}-${colorItem.tenMau}`, // Lấy tên từ sizeItem và colorItem
//           soluong: 0,
//           giaBan: 0,
//           hinhanh: '',
//           tenKichThuoc: sizeItem.tenKichThuoc, // Lấy thông tin kích thước từ sizeItem
//           tenMau: colorItem.tenMau, // Lấy thông tin màu sắc từ colorItem
//         };
//       });

//       newData.push(...variants);
//     });

//     setTableData(newData);
//   };


//   const handleInputChange = (key, dataIndex, value) => {
//     const updatedData = tableData.map((item) => {
//       if (item.key === key) {
//         return { ...item, [dataIndex]: value };
//       }
//       return item;
//     });
//     setTableData(updatedData);
//   };
//   //   const handleUploadChange = (key, fileList) => {
//   //     const updatedData = tableData.map((item) => {
//   //       if (item.key === key) {
//   //         return {
//   //           ...item, image: fileList.map(file => ({
//   //             ...file,
//   //             url: file.response ? file.response.url : file.url, // Đảm bảo rằng file có URL
//   //           }))
//   //         };
//   //       }
//   //       return item;
//   //     });
//   //     setTableData(updatedData);
//   //   };
//   // const handleUploadChange = (color, fileList) => {
//   //   // Cập nhật tất cả các biến thể có cùng màu
//   //   const updatedTableData = tableData.map((item) => {
//   //     // Kiểm tra nếu biến thể có cùng màu
//   //     if (item.color === color) {
//   //       return {
//   //         ...item,
//   //         image: fileList, // Cập nhật danh sách file ảnh cho tất cả biến thể cùng màu
//   //       };
//   //     }
//   //     return item;
//   //   });

//   //   // Cập nhật lại state tableData
//   //   setTableData(updatedTableData);
//   // };

//   const handleUploadChange = (color, file) => {
//     setTableData((prevTableData) => 
//       prevTableData.map((item) => {
//         if (item.color === color) {
//           // Lưu file vào trường `image` cho dòng có cùng color
//           return {
//             ...item,
//             image: item.image ? [...item.image, file] : [file], // Thêm ảnh vào danh sách
//           };
//         }
//         return item;
//       })
//     );
//   };

//   const generateProductCode=(productTitle)=> {
//     const timestamp = Date.now().toString(36);  // Chuyển đổi timestamp thành chuỗi base-36
//     const randomStr = Math.random().toString(36).substring(2, 7);  // Chuỗi ngẫu nhiên từ 5 ký tự
//     const productCode = `${productTitle.substring(0, 3).toUpperCase()}-${timestamp}-${randomStr}`;
//     return productCode;
//   }

//   const handleAddProduct = async() => {
//     // try {
     
//     //   await createSanPhamChiTietApi(tableData);
  
//     //   notification.success({
//     //     duration: 4,
//     //     pauseOnHover: false,
//     //     message: "Success",
//     //     showProgress: true,
//     //     description: "Thêm sản phẩm thành công!",
//     //   });
  
//     //   // Nếu cần đóng modal sau khi thêm thành công
//     //   //setIsModalAddOpen(false);
  
//     //   // Nếu cần reset dữ liệu hoặc reload trang
//     //   //setCurrentPage(1);
//     //   //await fetchData();
  
//     // } catch (error) {
//     //   console.error("Failed to add product", error);
  
//     //   notification.error({
//     //     duration: 4,
//     //     pauseOnHover: false,
//     //     message: "Error",
//     //     description: "Thêm sản phẩm thất bại!",
//     //   });
//     // }
//     console.log(tableData);
//   };

//   const columns = [
//     {
//       title: 'Tên sản phẩm',
//       dataIndex: 'name',
//     },

//     {
//       title: 'Số lượng',
//       dataIndex: 'soluong',
//       render: (text, record) => (
//         <Input
//           type="number"
//           defaultValue={text}
//           onChange={(e) => handleInputChange(record.key, 'soluong', e.target.value)}
//         />
//       ),
//     },
//     {
//       title: 'Giá',
//       dataIndex: 'gia',
//       render: (text, record) => (
//         <Input
//           type="number"
//           defaultValue={text}
//           onChange={(e) => handleInputChange(record.key, 'gia', e.target.value)}
//         />
//       ),
//     },
//     {
//       title: 'Action',
//       dataIndex: '',
//       render: (text, record) => (
//         <Button type="primary" danger onClick={() => handleDelete(record.key)}>
//           Xóa
//         </Button>
//       ),
//     },
//     // {
//     //   title: 'Hình ảnh',
//     //   dataIndex: 'color', // Sử dụng color để nhóm các dòng
//     //   render: (text, record) => {
//     //     const isFirst = tableData.findIndex((item) => item.color === record.color) === tableData.findIndex((item) => item.key === record.key);

//     //     return isFirst ? (
//     //       <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile}>
//     //         <Upload
//     //           // action="/upload.do"
//     //           listType="picture-card"
//     //           fileList={record.image || []}
//     //           onChange={({ fileList }) => handleUploadChange(record.color, fileList)} // Group by color
//     //           beforeUpload={(file) => {
//     //             if (record.image && record.image.length >= 6) {
//     //               alert('Bạn chỉ có thể tải lên tối đa 6 ảnh.');
//     //               return Upload.LIST_IGNORE;
//     //             }
//     //             return true;
//     //           }}
//     //         >
//     //           {record.image && record.image.length >= 6 ? null : (
//     //             <button
//     //               style={{
//     //                 border: 0,
//     //                 background: 'none',
//     //               }}
//     //               type="button"
//     //             >
//     //               <PlusOutlined />
//     //               <div style={{ marginTop: 8 }}>Upload</div>
//     //             </button>
//     //           )}
//     //         </Upload>
//     //       </Form.Item>
//     //     ) : null; // Ẩn chỗ upload ảnh cho các dòng khác cùng màu
//     //   },
//     // }
//     {
//       title: 'Hình ảnh',
//       dataIndex: 'color', // Sử dụng color để nhóm các dòng
//       render: (text, record) => {
//         const isFirst = tableData.findIndex((item) => item.color === record.color) === tableData.findIndex((item) => item.key === record.key);
    
//         return isFirst ? (
//           <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile}>
//             <Upload
//               listType="picture-card"
//               fileList={record.image || []}
//               beforeUpload={(file) => {
//                 // Kiểm tra số lượng ảnh
//                 if (record.image && record.image.length >= 6) {
//                   alert('Bạn chỉ có thể tải lên tối đa 6 ảnh.');
//                   return Upload.LIST_IGNORE;
//                 }
                
//                 // Lưu file vào trạng thái của React khi người dùng chọn file
//                 handleUploadChange(record.color, file); // Cập nhật file vào trạng thái của color
    
//                 // Ngăn chặn Ant Design upload tự động file
//                 return false;
//               }}
//             >
//               {record.image && record.image.length >= 6 ? null : (
//                 <button
//                   style={{
//                     border: 0,
//                     background: 'none',
//                   }}
//                   type="button"
//                 >
//                   <PlusOutlined />
//                   <div style={{ marginTop: 8 }}>Upload</div>
//                 </button>
//               )}
//             </Upload>
//           </Form.Item>
//         ) : null; // Ẩn chỗ upload ảnh cho các dòng khác cùng màu
//       }
//     }
    

//   ];

//   const onFinish = (values) => {
//     console.log('Received values of form: ', values);
//   };
//   return (
//     <>
//       <Form
//         name="validate_other"
//         // {...formItemLayout}
//         onFinish={onFinish}
//         initialValues={{
//           'input-number': 3,
//           'checkbox-group': ['A', 'B'],
//           rate: 3.5,
//           'color-picker': null,
//         }}
//         style={{ maxWidth: 1000 }}
//       >
//         <Row>
//           <Col span={24}>
//             <Form.Item
//               name="select-multiple-product"
//               label="Sản phẩm"

//             >
//               <Select
//                 showSearch
//                 onChange={(value, option) => handleProductChange(option.value)}
//                 placeholder="Search to Select"
//                 optionFilterProp="label"
//                 filterSort={(optionA, optionB) =>
//                   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
//                 }
//                 options={products}
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={10}>
//           <Col span={12}>
//             <Form.Item
//               name="select-multiple-color"
//               label="Màu sắc"
//               rules={[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]}
//             >
//               <Select mode="multiple" placeholder="Please select favourite colors" onChange={handleColorChange}>
//                 {Array.isArray(colors) && colors.length > 0 ? (
//                   colors.map(color => (
//                     <Option key={color.id} value={color.id}>
//                       {color.tenMau}
//                     </Option>
//                   ))
//                 ) : (
//                   <Option disabled>No colors available</Option>
//                 )}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="select-multiple-size"
//               label="Kích thước"
//               rules={[{ required: true, message: 'Please select your favourite sizes!', type: 'array' }]}
//             >
//               <Select mode="multiple" placeholder="Please select favourite sizes" onChange={handleSizeChange}>
//                 {Array.isArray(sizes) && sizes.length > 0 ? (
//                   sizes.map(size => (
//                     <Option key={size.id} value={size.id}>
//                       {size.tenKichThuoc}
//                     </Option>
//                   ))
//                 ) : (
//                   <Option disabled>No sizes available</Option>
//                 )}
//               </Select>
//             </Form.Item></Col>
//         </Row>
//         <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
//           <Space>

//             <Button htmlType="reset">reset</Button>
//           </Space>
//         </Form.Item>


//         <Button type="primary" onClick={handleAddProduct}>Test data</Button>
//       </Form>
//       <Table columns={columns} dataSource={tableData} />
//     </>

//   );
// };

// export default FormWithColors;
import React, { useState } from "react";
import { storage } from "./firebaseConfig"; // Import tệp cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function FirebaseImageUpload() {
    const [img, setImg] = useState(null);
    const [imgUrl, setImgUrl] = useState([]);

    const handleUpload = () => {
        if (img) {
            const imgRef = ref(storage, `images/${uuidv4()}`);
            uploadBytes(imgRef, img).then(() => {
                getDownloadURL(imgRef).then(url => {
                    setImgUrl(prevUrls => [...prevUrls, url]);
                });
            });
        }
    };
    return (
        <div>
            <input type="file" onChange={(e) => setImg(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            <div>
                {imgUrl.map(url => (
                    <img key={url} src={url} alt="Uploaded" height="200" />
                ))}
            </div>
        </div>
    );
}

export default FirebaseImageUpload;
