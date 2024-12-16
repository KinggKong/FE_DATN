import React, { useState } from 'react';

import { Modal, Flex, Form, Select, Row, Col, Space, Button, Table, Input, Upload, notification, Drawer, Image, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { createMauSacApi, getAllMauSacApi, getMauSacByIdApi } from '../../../../api/MauSacApi';
import { createKichThuocApi, getAllKichThuocApi, getKichThuocByIdApi } from '../../../../api/KichThuocApi';
import { createSanPhamApi, getAllSanPhamApi, getAllSanPhamMoiApi, getSanPhamByIdApi } from '../../../../api/SanPhamApi';
import { useEffect } from 'react';
import '../../../../assets/style/cssAddPlusFlash.css';
import { getAllDanhMucApi } from '../../../../api/DanhMucService';
import { getAllThuongHieuApi } from '../../../../api/ThuongHieuService';
import { getAllChatLieuDeApi } from '../../../../api/ChatLieuDeApi';
import { getAllChatLieuVaiApi } from '../../../../api/ChatLieuVaiApi';
import ModalThemMoiSanPham from "../sanpham/ModalThemMoiSanPham";
import ModalThemMoi from '../ModalThemMoi';
import { FaPercent } from 'react-icons/fa6';

const { Option } = Select;
const DrawerAdd = ({
  isOpen,
  handleClose,
  handleAddProduct,
  loadingDrawer,
}) => {
  const [colors, setColors] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState([]);  // Khởi tạo với mảng rỗng để tránh lỗi
  const [size, setSize] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [commonQuantity, setCommonQuantity] = useState(0);
  const [commonPrice, setCommonPrice] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  //Data của thuộc tính sản phảm trong modal thêm nhanh sản phẩm
  const [dataDanhMuc, setDataDanhMuc] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataChatLieuVai, setDatChatLieuVai] = useState([]);
  const [dataChatLieuDe, setDataChatLieuDe] = useState([]);
  // State quản lý hiển thị modal
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [isColorModalVisible, setColorModalVisible] = useState(false);
  const [isSizeModalVisible, setSizeModalVisible] = useState(false);

  const handleProductModalOpen = () => setProductModalVisible(true);
  const handleProductModalClose = () => setProductModalVisible(false);

  const handleColorModalOpen = () => setColorModalVisible(true);
  const handleColorModalClose = () => setColorModalVisible(false);

  const handleSizeModalOpen = () => setSizeModalVisible(true);
  const handleSizeModalClose = () => setSizeModalVisible(false);

  //hàm thêm sản phẩm nhanh
  const handleConfirmAddProduct = async (newProduct) => {
    setLoading(true);
    try {
      await createSanPhamApi(newProduct);
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm sản phẩm thành công!`,
      });
      setProductModalVisible(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create sản phẩm", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };
  //hàm thêm màu sắc


  const handleConfirmAddColor = async (newColorName) => {
    setLoading(true);
    try {
      await createMauSacApi({ tenMau: newColorName, trangThai: 1 });
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm màu sắc ${newColorName} thành công!`,
      });
      setColorModalVisible(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new color", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to create new color",
      });
    } finally {
      setLoading(false);
    }
  };
  //hàm them kích thước nhanh
  const checkKichThuocExists = async (tenKichThuoc) => {
    const params = { tenKichThuoc };
    const res = await getAllKichThuocApi(params);
    return res.data.content.some(item => item.tenKichThuoc === tenKichThuoc);
  };
  const validateKichThuoc = (value) => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue >= 35 && numberValue <= 47;
  };
  const handleConfirmAddSize = async (newKichThuocName) => {
    if (!validateKichThuoc(newKichThuocName)) {
      notification.error({
        message: "Error",
        description: "Kích thước phải là số và nằm trong khoảng từ 35 đến 47!",
      });
      return;
    }

    const exists = await checkKichThuocExists(newKichThuocName);
    if (exists) {
      notification.error({
        message: "Error",
        description: "Kích thước này đã tồn tại!",
      });
      return;
    }

    try {
      await createKichThuocApi({ tenKichThuoc: newKichThuocName , trangThai: 1});
      notification.success({
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        message: "Success",
        description: `Thêm kích thước ${newKichThuocName} thành công!`,
      });
      setSizeModalVisible(false);
      // setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Failed to create new size", error);
    }
  };


  const fetchDataDanhMuc = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllDanhMucApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content
        .filter((item) => item.trangThai === 1)
        .map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataDanhMuc(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data danh muc", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data danh muc",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataThuongHieu = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllThuongHieuApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content
        .filter((item) => item.trangThai === 1)
        .map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataThuongHieu(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data thuong hieu", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data thuong hieu",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuDe = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuDeApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content
        .filter((item) => item.trangThai === 1)
        .map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataChatLieuDe(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu de", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu de",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataChatLieuVai = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const res = await getAllChatLieuVaiApi(params);
      if (res && res.data) {
        const dataWithKey = res.data.content
        .filter((item) => item.trangThai === 1)
        .map((item) => ({
          ...item,
          key: item.id,
        }));
        setDatChatLieuVai(dataWithKey);
      }
    } catch (error) {
      console.error("Failed to fetch data chat lieu vai", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data chat lieu vai",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataDanhMuc();
    fetchDataThuongHieu();
    fetchDataChatLieuDe();
    fetchDataChatLieuVai();

  }, []);



  const start = () => {
    setIsModalVisible(true);
  };
  const onClose = () => {
    setColor([]);
    setSize([]);
    setProduct([]);
    setTableData([]);

    form.resetFields();

    handleClose();
  };



  const fetchData = async () => {
    try {
      // Gọi cả ba API đồng thời
      const params = {
        pageNumber: 0,
        pageSize: 100,
      };
      const [sizesResponse, colorsResponse, productsResponse] = await Promise.all([
        getAllKichThuocApi(params),
        getAllMauSacApi(params),
        getAllSanPhamMoiApi()
      ]);
      console.log('san pham', productsResponse);
  
      // Kiểm tra và lọc kích thước với trạng thái == 1
      if (Array.isArray(sizesResponse.data.content)) {
        const filteredSizes = sizesResponse.data.content.filter(size => size.trangThai === 1);
        setSizes(filteredSizes);
        console.log('Kích thước (trạng thái == 1):', filteredSizes);
      } else {
        console.error('API phản hồi kích thước không phải là mảng:', sizesResponse.data);
      }
  
      // Kiểm tra và lọc màu sắc với trạng thái == 1
      if (Array.isArray(colorsResponse.data.content)) {
        const filteredColors = colorsResponse.data.content.filter(color => color.trangThai === 1);
        setColors(filteredColors);
        console.log('Màu sắc (trạng thái == 1):', filteredColors);
      } else {
        console.error('API phản hồi màu sắc không phải là mảng:', colorsResponse.data);
      }
  
      // Kiểm tra và lọc sản phẩm với trạng thái == 1
      if (Array.isArray(productsResponse.data)) {
        const filteredProducts = productsResponse.data.filter(product => product.trangThai === 1);
        setProducts(filteredProducts);
        console.log('Sản phẩm (trạng thái == 1):', filteredProducts);
      } else {
        console.error('API phản hồi sản phẩm không phải là mảng:', productsResponse.data);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };
  
  useEffect(() => {
    let isMounted = true;


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
    setCommonPrice(0); // Đặt giá chung về 0
    setCommonQuantity(0); // Đặt số lượng chung về 0
    setSelectedRowKeys([]); // Bỏ chọn tất cả các dòng
    setHasSelected(false); // Bỏ chọn tất cả các dòng
    setIsModalVisible(false); // Đóng modal
  };

  const handleModalCancel = () => {
    setCommonPrice(0); // Đặt giá chung về 0
    setCommonQuantity(0); // Đặt số lượng chung về 0
    setSelectedRowKeys([]); // Bỏ chọn tất cả các dòng
    setHasSelected(false); // Bỏ chọn tất cả các dòng
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


  const resetFrom = () => {
    form.resetFields();
    generateTableData(color, size, product);
    setTableData([]);
  }



  // const productOptions = products.map((product) => ({
  //   value: product.id, // Hoặc giá trị mà bạn muốn lấy khi chọn sản phẩm
  //   label: product.tenSanPham, // Hiển thị tên sản phẩm
  // }));
  const productOptions = products
    .map((product) => ({
      value: product.id, // Giá trị của tùy chọn
      label: product.tenSanPham, // Tên sản phẩm hiển thị
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
          suffix={<span>Đôi</span>}
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
          suffix={<span>VNĐ</span>}
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
              multiple
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
    <div>


      {/* <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm mới sản phẩm chi tiết
      </Button> */}
      <Drawer
        title="Thêm mới sản phẩm chi tiết"
        width={1130}
        onClose={onClose}
        open={isOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={async () => {
              await handleAddProduct(tableData);
              resetFrom();
            }} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        {loadingDrawer ? (
          <Spin size="large" />
        ) : (
        <>
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
              {/* <Row>
            <Col span={24}>
              <Form.Item
                name="select-multiple-product"
                label="Sản phẩm"

              >
                <Select
                  showSearch
                  onChange= {handleProductChange}
                  placeholder="Chọn sản phẩm"
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
                rules={[{ required: true, message: 'Vui lòng chọn màu của sản phẩm!', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Chọn màu của chi tiết sản phẩm" onChange={handleColorChange}>
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
                rules={[{ required: true, message: 'Vui lòng chọn kích thước của sản phẩm!', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Chọn kích thước của chi tiết sản phẩm" onChange={handleSizeChange}>
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
          </Row> */}
              <Row>
                <Col span={24}>
                  <Form.Item name="select-multiple-product" label="Sản phẩm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Select
                        showSearch
                        onChange={handleProductChange}
                        placeholder="Chọn sản phẩm"
                        optionFilterProp="label"
                        // filterSort={(optionA, optionB) =>
                        //   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        // }
                        options={productOptions}
                        style={{ flex: 1 }}
                      />
                      <Button
                        type="text"
                        icon={<PlusOutlined className='icon-lightning' />}
                        onClick={handleProductModalOpen}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item
                    name="select-multiple-color"
                    label="Màu sắc"
                    rules={[{ required: true, message: 'Vui lòng chọn màu của sản phẩm!', type: 'array' }]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Select
                        mode="multiple"
                        placeholder="Chọn màu của chi tiết sản phẩm"
                        onChange={handleColorChange}
                        style={{ flex: 1 }}
                      >
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
                      <Button
                        type="text"
                        icon={<PlusOutlined className='icon-lightning' />}
                        onClick={handleColorModalOpen}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="select-multiple-size"
                    label="Kích thước"
                    rules={[{ required: true, message: 'Vui lòng chọn kích thước của sản phẩm!', type: 'array' }]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Select
                        mode="multiple"
                        placeholder="Chọn kích thước của chi tiết sản phẩm"
                        onChange={handleSizeChange}
                        style={{ flex: 1 }}
                      >
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

                      <Button
                        type="text"
                        icon={<PlusOutlined className='icon-lightning' />}
                        onClick={handleSizeModalOpen}
                      />
                    </div>
                  </Form.Item>
                </Col>
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
            <Table rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        </>


  
        )}



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
              suffix={<span>Đôi</span>}
            />
          </Form.Item>
          <Form.Item label="Giá chung">
            <Input
              type="number"
              min={0}
              value={commonPrice}
              onChange={(e) => setCommonPrice(e.target.value)}
              suffix={<span>VNĐ</span>}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm nhanh sản phẩm */}
      <ModalThemMoiSanPham
        isOpen={isProductModalVisible}
        handleClose={() => setProductModalVisible(false)}
        title={"sản phẩm"}
        handleSubmit={handleConfirmAddProduct}
        dataDanhMuc={dataDanhMuc}
        dataThuongHieu={dataThuongHieu}
        dataChatLieuVai={dataChatLieuVai}
        dataChatLieuDe={dataChatLieuDe}
      />

      {/* Modal thêm nhanh màu sắc */}
      <ModalThemMoi
        isOpen={isColorModalVisible}
        handleClose={() => setColorModalVisible(false)}
        title={"Màu sắc"}
        handleSubmit={handleConfirmAddColor}
      />

      {/* Modal thêm nhanh kích thước */}
      <ModalThemMoi
        isOpen={isSizeModalVisible}
        handleClose={() => setSizeModalVisible(false)}
        title={"Kích thước"}
        handleSubmit={handleConfirmAddSize}
      />



    </div>

  );
};
export default DrawerAdd;