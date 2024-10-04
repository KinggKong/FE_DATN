import React, { useState } from 'react';
import { createSanPhamChiTietApi } from '../../../../api/SanPhamChiTietAPI';
import { Modal, Flex, Form, Select, Row, Col, Space, Button, Table, Input, Upload, notification, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getAllMauSacApi, getMauSacByIdApi } from '../../../../api/MauSacApi';
import { getAllKichThuocApi, getKichThuocByIdApi } from '../../../../api/KichThuocApi';
import { useEffect } from 'react';
import { storage } from "./firebaseConfig"; // Import tệp cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
const { Option } = Select;
const DrawerAdd = () => {
  const [colors, setColors] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
  const [size, setSize] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [productTitle, setProductTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [commonQuantity, setCommonQuantity] = useState(0);
  const [commonPrice, setCommonPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setIsModalVisible(true);
  };



  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Gọi cả hai API đồng thời
        const [sizesResponse, colorsResponse] = await Promise.all([
          getAllKichThuocApi(),
          getAllMauSacApi(),
        ]);

        // Kiểm tra và cập nhật kích thước
        if (Array.isArray(sizesResponse.data.content)) {
          setSizes(sizesResponse.data.content);
          console.log('Kích thước:', sizesResponse.data.content);
        } else {
          console.error('API phản hồi kích thước không phải là mảng:', sizesResponse.data);
        }

        // Kiểm tra và cập nhật màu sắc
        if (Array.isArray(colorsResponse.data.content)) {
          setColors(colorsResponse.data.content);
          console.log('Màu sắc:', colorsResponse.data.content);
        } else {
          console.error('API phản hồi màu sắc không phải là mảng:', colorsResponse.data);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Đặt biến thành false khi component unmount
    };
  }, []);


  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/products')
      .then(response => {
        if (Array.isArray(response.data)) {
          const newProduct = response.data.map(product => ({
            value: product.id,
            label: product.title,
          }));
          setProducts(newProduct);  // Đảm bảo rằng response là mảng                             
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching colors:', error);
      });
  }, []);


  const [tableData, setTableData] = useState([]);

  const handleColorChange = (selectedColors) => {
    setColor(selectedColors);
    generateTableData(selectedColors, size, product);
  };

  const handleSizeChange = (selectedSizes) => {
    setSize(selectedSizes);
    generateTableData(color, selectedSizes, product);
  };
  const handleProductChange = (productId) => {
    axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`)
      .then(response => {
        const selectedProduct = response.data; // Giả sử API trả về thông tin sản phẩm
        setProduct(selectedProduct);
        setProductTitle(selectedProduct.title);
        generateTableData(color, size, selectedProduct);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  };
  const handleDelete = (key) => {
    const updatedData = tableData.filter((item) => item.key !== key); // Lọc bỏ dòng có key tương ứng
    setTableData(updatedData); // Cập nhật lại dữ liệu
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const generateTableData = (selectedColors, selectedSizes, selectedProduct) => {
    const newData = [];

    selectedColors.forEach((color) => {
      const colorItem = colors.find((item) => item.id === color);

      const variants = selectedSizes.map((size) => {
        const sizeItem = sizes.find((item) => item.id === size); // Sửa lỗi

        return {
          key: `${color}-${size}`,
          id_mauSac: color,
          id_kichThuoc: size,
          maSanPham: generateProductCode(selectedProduct.title),
          id_sanPham: 1,//selectedProduct.id,
          name: `${selectedProduct.title}: ${sizeItem.tenKichThuoc}-${colorItem.tenMau}`, // Lấy tên từ sizeItem và colorItem
          soLuong: 0,
          giaBan: 0,
          hinhanh: '',
          tenKichThuoc: sizeItem.tenKichThuoc, // Lấy thông tin kích thước từ sizeItem
          tenMau: colorItem.tenMau, // Lấy thông tin màu sắc từ colorItem
          trangThai: 1,
        };
      });

      newData.push(...variants);
    });

    setTableData(newData);
  };


  const handleInputChange = (key, dataIndex, value) => {
    const updatedData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setTableData(updatedData);
  };

  const handleModalOk = () => {
    // Cập nhật giá và số lượng chung cho các dòng được chọn
    const updatedData = tableData.map((item) => {
      if (selectedRowKeys.includes(item.key)) {
        return { ...item, soLuong: commonQuantity, giaBan: commonPrice };
      }
      return item;
    });
    setTableData(updatedData);
    setIsModalVisible(false); // Đóng modal
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Đóng modal mà không thay đổi gì
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setHasSelected(newSelectedRowKeys.length > 0);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // const handleUploadChange = (color, fileList) => {
  //   // Cập nhật tất cả các biến thể có cùng màu
  //   const updatedTableData = tableData.map((item) => {
  //     // Kiểm tra nếu biến thể có cùng màu
  //     if (item.color === color) {
  //       return {
  //         ...item,
  //         image: fileList, // Cập nhật danh sách file ảnh cho tất cả biến thể cùng màu
  //       };
  //     }
  //     return item;
  //   });

  //   // Cập nhật lại state tableData
  //   setTableData(updatedTableData);
  // };
  const handleUploadChange = (color, file) => {
    setTableData((prevTableData) =>
      prevTableData.map((item) => {
        if (item.color === color) {
          // Lưu file vào trường `image` cho dòng có cùng color
          return {
            ...item,
            image: item.image ? [...item.image, file] : [file], // Thêm ảnh vào danh sách
          };
        }
        return item;
      })
    );
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  const generateProductCode = (productTitle) => {
    const timestamp = Date.now().toString(36);  // Chuyển đổi timestamp thành chuỗi base-36
    const randomStr = Math.random().toString(36).substring(2, 7);  // Chuỗi ngẫu nhiên từ 5 ký tự
    const productCode = `${productTitle.substring(0, 3).toUpperCase()}-${timestamp}-${randomStr}`;
    return productCode;
  }

  const uploadImageToFirebase = async (image) => {
    const imgRef = ref(storage, `images/${uuidv4()}`);
    await uploadBytes(imgRef, image);
    return await getDownloadURL(imgRef);
  };

  const handleAddProduct = async () => {
    if (!tableData || tableData.length === 0) {
      notification.error({
        duration: 4,
        pauseOnHover: false,
        message: "Error",
        description: "Không có dữ liệu để thêm sản phẩm!",
      });
      return;
    }
    try {



      const uploadPromises = tableData.map(async (item) => {
        const uploadedImageUrls = await Promise.all(
          item.image.map(uploadImageToFirebase) // Tải từng ảnh lên Firebase
        );
        return {
          ...item,
          hinhanh: uploadedImageUrls, // Thêm các URL ảnh vào sản phẩm
        };
      });
      

      const updatedTableData = await Promise.all(uploadPromises); // Đợi tất cả các ảnh được tải lên
      console.log(updatedTableData);
      await createSanPhamChiTietApi(updatedTableData);

      notification.success({
        duration: 4,
        pauseOnHover: false,
        message: "Success",
        showProgress: true,
        description: "Thêm sản phẩm thành công!",
      });
      setTableData([]); // Xóa dữ liệu sau khi thêm thành công
      setOpen(false);
      // Nếu cần đóng modal sau khi thêm thành công
      //setIsModalAddOpen(false);

      // Nếu cần reset dữ liệu hoặc reload trang
      //setCurrentPage(1);
      //await fetchData();

    } catch (error) {
      console.error("Failed to add product", error);

      notification.error({
        duration: 4,
        pauseOnHover: false,
        message: "Error",
        description: "Thêm sản phẩm thất bại!",
      });
    }
    console.log(tableData);
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },

    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          value={record.soLuong}
          defaultValue={text}
          onChange={(e) => handleInputChange(record.key, 'soLuong', e.target.value)}
        />
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'giaBan',
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          defaultValue={text}
          value={record.giaBan}
          onChange={(e) => handleInputChange(record.key, 'giaBan', e.target.value)}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      render: (text, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          Xóa
        </Button>
      ),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'color', // Sử dụng color để nhóm các dòng
      render: (text, record) => {
        const isFirst = tableData.findIndex((item) => item.color === record.color) === tableData.findIndex((item) => item.key === record.key);

        return isFirst ? (
          <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              listType="picture-card"
              fileList={record.image || []}
              beforeUpload={(file) => {
                // Kiểm tra số lượng ảnh
                if (record.image && record.image.length >= 6) {
                  alert('Bạn chỉ có thể tải lên tối đa 6 ảnh.');
                  return Upload.LIST_IGNORE;
                }

                // Lưu file vào trạng thái của React khi người dùng chọn file
                handleUploadChange(record.color, file); // Cập nhật file vào trạng thái của color

                // Ngăn chặn Ant Design upload tự động file
                return false;
              }}
            >
              {record.image && record.image.length >= 6 ? null : (
                <button
                  style={{
                    border: 0,
                    background: 'none',
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              )}
            </Upload>
          </Form.Item>
        ) : null; // Ẩn chỗ upload ảnh cho các dòng khác cùng màu
      }
    }

    // },{
    //   title: 'Hình ảnh',
    //   dataIndex: 'color', // Sử dụng color để nhóm các dòng
    //   render: (text, record) => {
    //     const isFirst = tableData.findIndex((item) => item.color === record.color) === tableData.findIndex((item) => item.key === record.key);

    //     return isFirst ? (
    //       <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile}>
    //         <Upload
    //           // action="/upload.do"
    //           listType="picture-card"
    //           fileList={record.image || []}
    //           onChange={({ fileList }) => handleUploadChange(record.color, fileList)} // Group by color
    //           beforeUpload={(file) => {
    //             if (record.image && record.image.length >= 6) {
    //               alert('Bạn chỉ có thể tải lên tối đa 6 ảnh.');
    //               return Upload.LIST_IGNORE;
    //             }
    //             return true;
    //           }}
    //         >
    //           {record.image && record.image.length >= 6 ? null : (
    //             <button
    //               style={{
    //                 border: 0,
    //                 background: 'none',
    //               }}
    //               type="button"
    //             >
    //               <PlusOutlined />
    //               <div style={{ marginTop: 8 }}>Upload</div>
    //             </button>
    //           )}
    //         </Upload>
    //       </Form.Item>
    //     ) : null; // Ẩn chỗ upload ảnh cho các dòng khác cùng màu


    //   }
    // }

  ];
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm mới sản phẩm chi tiết
      </Button>
      <Drawer
        title="Thêm mới sản phẩm chi tiết"
        width={1130}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddProduct} type="primary">
              Submit
            </Button>
          </Space>
        }
      >


        <Form
          name="validate_other"
          // {...formItemLayout}
          onFinish={onFinish}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
            'color-picker': null,
          }}
          style={{ maxWidth: 1000 }}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="select-multiple-product"
                label="Sản phẩm"

              >
                <Select
                  showSearch
                  onChange={(value, option) => handleProductChange(option.value)}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={products}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                name="select-multiple-color"
                label="Màu sắc"
                rules={[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Please select favourite colors" onChange={handleColorChange}>
                  {Array.isArray(colors) && colors.length > 0 ? (
                    colors.map(color => (
                      <Option key={color.id} value={color.id}>
                        {color.tenMau}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No colors available</Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="select-multiple-size"
                label="Kích thước"
                rules={[{ required: true, message: 'Please select your favourite sizes!', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Please select favourite sizes" onChange={handleSizeChange}>
                  {Array.isArray(sizes) && sizes.length > 0 ? (
                    sizes.map(size => (
                      <Option key={size.id} value={size.id}>
                        {size.tenKichThuoc}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No sizes available</Option>
                  )}
                </Select>
              </Form.Item></Col>
          </Row>
          <Form.Item >
            <Space>

              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>



        </Form>
        <Flex align="center" gap="middle">
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Set số lượng và giá chung
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>
        <Table rowSelection={rowSelection} columns={columns} dataSource={tableData}

        />



      </Drawer>
      {/* Modal nhập giá và số lượng chung */}
      <Modal
        title="Set số lượng và giá chung"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Số lượng chung">
            <Input
              type="number"
              min={0}
              value={commonQuantity}
              onChange={(e) => setCommonQuantity(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Giá chung">
            <Input
              type="number"
              min={0}
              value={commonPrice}
              onChange={(e) => setCommonPrice(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default DrawerAdd;