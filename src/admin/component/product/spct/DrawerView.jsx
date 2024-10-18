import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Table, Switch } from 'antd';
import { useFormik } from "formik";
import * as Yup from "yup";
import TextArea from 'antd/es/input/TextArea';
const { Option } = Select;
const DrawerView = ({
  isOpen,
  onClose,
  product,
  productDetails,
}
) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setHasSelected(newSelectedRowKeys.length > 0);
  };
  const formik = useFormik({
    initialValues: {
      tenSanPham: product?.tenSanPham || "",
      tenDanhMuc: product?.danhMuc.tenDanhMuc || "",
      tenThuongHieu: product?.thuongHieu.tenThuongHieu || "",
      tenChatVai: product?.chatLieuVai.tenChatLieuVai || "",
      tenChatDe: product?.chatLieuDe.tenChatLieu || "",
      ngayTao: product?.createdAt || "",
      trangThai: product?.trangThai,
      moTa: product?.moTa || "",

    },
    enableReinitialize: true,

  });

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      render: (text, record) => `${record.tenSanPham} : [${record.tenMauSac} - ${record.tenKichThuoc}]`
    },

    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      
    },
    {
      title: 'Giá',
      dataIndex: 'giaBan',
      
    },
    
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhAnhList', // Hiển thị ảnh
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          {record.hinhAnhList && record.hinhAnhList.length > 0 ? (
            record.hinhAnhList.map((url, index) => (
              <img
                key={index}
                src={url.url}
                alt="product"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
            ))
          ) : (
            <span>Không có ảnh</span>
          )}
        </div>
      )
    }
    



  ];
  return (
    <>

      <Drawer
        title={<span>Thông tin sản phẩm </span>}
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
            
          </Space>
        }
      >
        <Row gutter={16} className="flex justify-between mb-3">
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên sản phẩm
            </label>
            <Input
              id="tenSanPham"
              name="tenSanPham"
              value={formik.values.tenSanPham}

              placeholder=""
              readOnly
            />

          </Col>
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên thương hiệu
            </label>
            <Input
              id="tenThuongHieu"
              name="tenThuongHieu"
              value={formik.values.tenThuongHieu}

              placeholder=""
              readOnly
            />

          </Col>
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên chất liệu vải
            </label>
            <Input
              id="tenChatVai"
              name="tenChatVai"
              value={formik.values.tenChatVai}

              placeholder=""
              readOnly
            />

          </Col>
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên chất liệu đế
            </label>
            <Input
              id="tenChatDe"
              name="tenChatDe"
              value={formik.values.tenChatDe}

              placeholder=""
              readOnly
            />

          </Col>
        </Row>

        <Row gutter={16} className="flex justify-between mb-3">
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Tên danh mục
            </label>
            <Input
              id="tenDanhMuc"
              name="tenDanhMuc"
              value={formik.values.tenDanhMuc}

              placeholder=""
              readOnly
            />

          </Col>
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Ngày tạo
            </label>
            <Input
              id="ngayTao"
              name="ngayTao"
              value={formik.values.ngayTao}

              placeholder=""
              readOnly 
            />

          </Col>
         
          <Col span={6}>
            <label className="text-sm inline-block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Mô tả
            </label>
            <TextArea value={formik.values.moTa} 
            readOnly
            >
              
            </TextArea>

          </Col>
          <Col span={6}>
          <label className="text-sm block mb-2" htmlFor="">
                            Hoạt động
                        </label>
                        <Switch
                           
                            defaultChecked
                            checked={formik.values.trangThai === 1}
                            
                        />

          </Col>
        </Row>
        <Table  columns={columns} dataSource={productDetails} />
      </Drawer>
    </>
  );
};
export default DrawerView;