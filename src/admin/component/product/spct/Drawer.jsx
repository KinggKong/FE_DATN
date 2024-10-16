import React, { useState } from 'react';

import { Modal, Flex, Form, Select, Row, Col, Space, Button, Table, Input, Upload, notification, Drawer,Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getAllMauSacApi, getMauSacByIdApi } from '../../../../api/MauSacApi';
import { getAllKichThuocApi, getKichThuocByIdApi } from '../../../../api/KichThuocApi';
import { getAllSanPhamApi, getSanPhamByIdApi } from '../../../../api/SanPhamApi';
import { useEffect } from 'react';

const { Option } = Select;
const DrawerAdd = ({
  isOpen,
  handleClose,
  handleAddProduct,
}) => {
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
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

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
        const [sizesResponse, colorsResponse, productsResponse] = await Promise.all([
          getAllKichThuocApi(),
          getAllMauSacApi(),
          getAllSanPhamApi(),
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
        if (Array.isArray(productsResponse.data.content)) {
          setProducts(productsResponse.data.content);
          console.log('Sản phẩm:', productsResponse.data.content);
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


 


  

  const handleColorChange = (selectedColors) => {
    setColor(selectedColors);
    generateTableData(selectedColors, size, product);
  };

  const handleSizeChange = (selectedSizes) => {
    setSize(selectedSizes);
    generateTableData(color, selectedSizes, product);
  };
  const handleProductChange = (selectedProduct) => {
    setProduct(selectedProduct);
    generateTableData(color, size, selectedProduct);
    console.log(selectedProduct);
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
      const productItem = products.find((item) => item.id === selectedProduct);
      const variants = selectedSizes.map((size) => {
        const sizeItem = sizes.find((item) => item.id === size); // Sửa lỗi

        return {
          key: `${color}-${size}`,
          id_mauSac: color,
          id_kichThuoc: size,
          maSanPham: generateProductCode(productItem.tenSanPham),
          id_sanPham: product,//selectedProduct.id,
          name: `${productItem.tenSanPham} [ ${sizeItem.tenKichThuoc}-${colorItem.tenMau} ]`, // Lấy tên từ sizeItem và colorItem
          soLuong: 0,
          giaBan: 0,
          hinhAnh: '',
          tenKichThuoc: sizeItem.tenKichThuoc, // Lấy thông tin kích thước từ sizeItem
          tenMau: colorItem.tenMau, // Lấy thông tin màu sắc từ colorItem
          trangThai: 1,
          color: color, // Thêm trường color để nhóm các dòng cùng màu
          
        };
      });
      console.log(tableData);
      newData.push(...variants);
    });

    setTableData(newData);
  };


  const handleInputChange = (key, dataIndex, value) => {
    const numericValue = parseFloat(value);

    // Kiểm tra nếu giá trị âm
    if (numericValue < 0) {
      notification.error({
        message: 'Lỗi nhập liệu',
        description: `${dataIndex === 'soLuong' ? 'Số lượng' : 'Giá'} không được nhỏ hơn 0`,
        duration: 3,
      });
      return; // Dừng xử lý khi phát hiện giá trị âm
    }
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
  // hàm thêm ảnh
  
  
  const handleUploadChange = (color, file) => {
    setTableData((prevTableData) =>
      prevTableData.map((item) => {
        if (item.color === color) {
          // Lưu file vào trường `image` cho dòng có cùng color
          const fileWithUrl = {
            uid: file.uid || `rc-upload-${Date.now()}`, // Tạo uid nếu không có
            name: file.name,
            status: 'done', // Có thể là 'done' nếu bạn đã upload thành công
            url: URL.createObjectURL(file), // URL để hiển thị
          };
          return {
            ...item,
            image: item.image ? [...item.image, file] : [file], // Thêm ảnh vào danh sách
            reviewImage: item.reviewImage ? [...item.reviewImage, fileWithUrl] : [fileWithUrl], // Thêm file có URL vào reviewImage
          };
        }
        return item;
      })
    );
  };
  // hàm xóa ảnh
  const handleRemoveImage = (color, file) => {
    // Cập nhật lại danh sách ảnh sau khi xóa
    const updatedTableData = tableData.map((item) => {
      if (item.color === color) {
        const updatedImages = item.image.filter((img) => img.uid !== file.uid);
        const updatedReviewImages = item.reviewImage.filter((img) => img.uid !== file.uid);
        return {
          ...item,
          image: updatedImages,
          reviewImage: updatedReviewImages,
        };
      }
      return item;
    });
  
    setTableData(updatedTableData);
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

 
  const resetFrom =()=>{
    form.resetFields();
    generateTableData(color, size, product);
    setTableData([]);
  }


  
  const productOptions = products.map((product) => ({
    value: product.id, // Hoặc giá trị mà bạn muốn lấy khi chọn sản phẩm
    label: product.tenSanPham, // Hiển thị tên sản phẩm
  }));

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
              fileList={record.reviewImage || []}
              beforeUpload={(file) => {
                // Kiểm tra số lượng ảnh
                if (record.image && record.image.length >= 6) {
                  alert('Bạn chỉ có thể tải lên tối đa 6 ảnh.');
                  return Upload.LIST_IGNORE;
                }

                // Lưu file vào trạng thái của React khi người dùng chọn file
                handleUploadChange(record.color, file); // Cập nhật file vào trạng thái của color
                console.log(record.image);
                // Ngăn chặn Ant Design upload tự động file
                return false;
              }}
              onPreview={(file) => {
                // Thiết lập ảnh xem trước
                setPreviewImage(file.url || file.preview); // Sử dụng preview nếu không có url
                setPreviewOpen(true);
            }}
              onRemove={(file) => handleRemoveImage(record.color, file)}
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
            {previewImage && (
                        <Image
                            wrapperStyle={{
                                display: 'none',
                            }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
          </Form.Item>
        ) : null; // Ẩn chỗ upload ảnh cho các dòng khác cùng màu
      }
    }

   

  ];
  return (
    <>
      {/* <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm mới sản phẩm chi tiết
      </Button> */}
      <Drawer
        title="Thêm mới sản phẩm chi tiết"
        width={1130}
        onClose={handleClose}
        open={isOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={async()=>{ 
              await handleAddProduct(tableData);
              resetFrom();} } type="primary">
              Submit
            </Button>
          </Space>
        }
      >


        <Form
          form={form}
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
                  onChange= {handleProductChange}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={productOptions}
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

              <Button htmlType="reset" onClick={resetFrom}>Reset</Button>
            </Space>
          </Form.Item>



        </Form>
        <Flex align="center" gap="middle">
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Set số lượng và giá chung
          </Button>
          {/* {hasSelected ? `Selected ${selectedRowKeys.length} items` : null} */}
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