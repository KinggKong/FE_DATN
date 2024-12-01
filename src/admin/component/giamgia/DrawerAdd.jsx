import React, { useCallback, useState } from 'react';
import { createStyles } from 'antd-style';
import { CiSearch } from "react-icons/ci";
import { FaPercent } from "react-icons/fa";
import {
    Modal, Flex, Form, Select, Row, Col, Space, Button, Table,
    Input, Upload, notification, Drawer, Image, DatePicker, Breadcrumb,
    Switch, Divider, Card,
    InputNumber, message

} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { getAllSanPhamByTenSanPhamApi } from '../../../api/SanPhamApi';
import { getAllSanPhamChiTietBySanPhamIdApi } from '../../../api/SanPhamChiTietAPI';
import { createSaleApi, getAllTenChienDichApi } from '../../../api/SaleApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `,
    };
});
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 150,
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'tenSanPham',
        width: 150,
    },

];
const columnsTableSPCT = [
    {
        title: 'Mã sản phẩm',
        dataIndex: 'maSanPham',
        width: 150,
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'tenSanPham',
        width: 150,
    },
    {
        title: 'Màu sắc',
        dataIndex: 'tenMauSac',
        width: 150,
    },
    {
        title: 'Kích thước',
        dataIndex: 'tenKichThuoc',
        width: 150,
    },
    {
        title: 'Số lượng',
        dataIndex: 'soLuong',
        width: 150,
    },
    {
        title: 'Giá bán',
        dataIndex: 'giaBan',
        width: 150,
    }

];

const FormAddDotGiamGia = () => {



    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowsKeysSPCT, setSelectedRowsKeysSPCT] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableDataSanPham, setTableDataSanPham] = useState([]);
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { styles } = useStyle();
    const [tenSanPhamSearch, setTenSanPhamSearch] = useState('');
    const [tableDataSPCT, setTableDataSPCT] = useState([]);
    const [exitsTenChienDich, setExitsTenChienDich] = useState([]);
    const navigate = useNavigate();
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const rowSelection = {
        onChange: async (selectedRowKeys, selectedRows) => {

            if (selectedRows.length > 0) {
                try {
                    const allProductDetails = await Promise.all(
                        selectedRows.map(async (row) => {
                            const res = await getAllSanPhamChiTietBySanPhamIdApi(row.id);
                            return res.data;
                        })
                    );
                    const allProductDetailsWithKey = allProductDetails.map((item) => item.map((i) => ({
                        ...i,
                        key: i.id,
                    })));
                    const flattenProductDetails = allProductDetailsWithKey.flat();
                    setTableDataSPCT(flattenProductDetails);
                    console.log(tableDataSPCT);

                } catch (error) {
                    console.error("Failed to fetch product details", error);
                }
            } else {
                setTableDataSPCT([]);
            }
        },
    };
    const rowSelectionSPCT = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            setSelectedRowsKeysSPCT(selectedRowKeys);
        },
    };
    const hasSelectedSPCT = selectedRowsKeysSPCT.length > 0;
    const hasSelected = selectedRowKeys.length > 0;
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
        setIsModalVisible(true);
    };
    
    const fetchTenChienDich = useCallback(async () => {
        try {
            const res = await getAllTenChienDichApi();
            if (res) {
                setExitsTenChienDich(res);
            }
           
            console.log(exitsTenChienDich);
        } catch (error) {
            console.error("Failed to fetch data", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch data",
            });
        }
    }, []);
    useEffect(() => {
        fetchTenChienDich();
    }, [fetchTenChienDich]);

    const checkDuplicateName = (rule, value) => {

        if (exitsTenChienDich.includes(value)) {
            console.log(exitsTenChienDich);
            return Promise.reject('Tên đợt giảm giá đã tồn tại!');
        }
        return Promise.resolve();
    };
    
    const fetchData = useCallback(async () => {
        try {
            const params = {

                tenSanPham: tenSanPhamSearch,
            };
            const res = await getAllSanPhamByTenSanPhamApi(params);
            if (res && res.data) {
                const filteredData = res.data.filter((item) => item.trangThai === 1);

            // Thêm key vào dữ liệu đã lọc
            const dataWithKey = filteredData.map((item) => ({
                ...item,
                key: item.id,
            }));

            setTableDataSanPham(dataWithKey);

            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch data",
            });
        } finally {
            setLoading(false);
        }
    }
        , [tenSanPhamSearch]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async () => {
        try {
            const formValues = await form.validateFields();
            const thoiGianGiamGia = formValues.thoiGianGiamGia || [];

            // Kiểm tra nếu không có đủ dữ liệu cho thời gian
            if (thoiGianGiamGia.length !== 2) {
                throw new Error("Vui lòng chọn đủ thời gian bắt đầu và kết thúc.");
            }

            // Kiểm tra nếu các phần tử là đối tượng moment hợp lệ
            const startDate = thoiGianGiamGia[0];
            const endDate = thoiGianGiamGia[1];

            if (!startDate || !endDate || !startDate.isValid() || !endDate.isValid()) {
                throw new Error("Ngày không hợp lệ.");
            }

            const formattedDates = {
                thoiGianBatDau: startDate.format('YYYY-MM-DDTHH:mm:ss'),
                thoiGianKetThuc: endDate.format('YYYY-MM-DDTHH:mm:ss')
            };
            const requestData = {
                ...formValues,
                ...formattedDates,
                trangThai: formValues.trangThai ? 1 : 0,
                hinhThucGiam: '%',
                idSanPhamChiTiet: selectedRowsKeysSPCT
            }
            console.log(requestData);
            const res = await createSaleApi(requestData);
            if (res && res.data) {
                notification.success({
                    message: "Success",
                    description: "Tạo đợt giảm giá thành công",
                });
                navigate('/admin/sale');
            }

        } catch (error) {
            console.error("Failed to validate form", error);
            notification.error({
                message: "Error",
                description: "Failed to validate form",
            });
        }
    }

    return (

        <>

            <Breadcrumb className="text-xl font-semibold mb-2">
                <Breadcrumb.Item>
                    <Link to={"/admin/sale"} >
                        Đợt giảm giá
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thêm mới đợt giảm giá</Breadcrumb.Item>
            </Breadcrumb>

            <Card bordered={false} style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="Tên đợt giảm giá"
                                name="tenChienDich"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đợt giảm giá!' },
                                    { validator: checkDuplicateName }
                                ]}
                            >
                                <Input placeholder="Nhập tên đợt giảm giá"
                                   
                                />
                            </Form.Item>
                            <Row gutter={16}>

                                <Col span={7}>
                                    <Form.Item
                                        label="Giá trị giảm"
                                        name="giaTriGiam"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                            {
                                                type: 'number',
                                                min: 0,
                                                max: 100,
                                                message: 'Vui lòng nhập trong khoảng từ 0 đến 100!',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá trị giảm"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            type='number'
                                            // min={0}
                                            // max={100}


                                            suffix={<FaPercent />}
                                        />
                                    </Form.Item>
                                </Col>


                                <Col span={17}>
                                    <Form.Item label="Thời gian giảm giá" name="thoiGianGiamGia"
                                        rules={[{ required: true, message: 'Vui lòng chọn thời gian giảm giá!' }]}
                                    >
                                        <RangePicker
                                            showTime={{
                                                format: 'HH:mm',
                                            }}
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                            onChange={(value, dateString) => {
                                                console.log('Selected Time: ', value);
                                                console.log('Formatted Selected Time: ', dateString);
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Form.Item name="trangThai" valuePropName="checked" initialValue={true}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px' }}>Trạng thái:</span>
                                    <Switch
                                        checkedChildren="Đang diễn ra"
                                        unCheckedChildren="Không hoạt động"
                                        defaultChecked={true} // Hoặc false tùy vào trạng thái ban đầu bạn muốn
                                        onChange={(checked) => {
                                            // Cập nhật giá trị vào form
                                            form.setFieldsValue({ trangThai: checked ? 1 : 0 }); // Lưu 1 nếu checked, 0 nếu không
                                        }}
                                    />
                                </div>
                            </Form.Item>

                        </Form>

                    </Col>

                    <Col span={12}>

                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <Input
                                placeholder="Tìm theo tên sản phẩm"
                                prefix={<CiSearch />}
                                style={{ width: '100%' }}
                                onChange={(e) => setTenSanPhamSearch(e.target.value)}
                            />

                            <Table
                                rowSelection={rowSelection}
                                className={styles.customTable}
                                columns={columns}
                                dataSource={tableDataSanPham}
                                pagination={false}
                                scroll={{
                                    y: 55 * 5,
                                }}
                            />
                        </Space>

                    </Col>
                </Row>
            </Card>

            <Card title="Chi tiết sản phẩm áp dụng" bordered={false} style={{ backgroundColor: '#f5f5f5', padding: '20px', marginTop: '20px' }}
                extra={
                    <Button type="primary" onClick={handleSubmit} disabled={!hasSelectedSPCT}>
                        <PlusOutlined /> Tạo mới
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Table
                            rowSelection={rowSelectionSPCT}
                            className={styles.customTable}
                            columns={columnsTableSPCT}
                            dataSource={tableDataSPCT}
                            pagination={false}
                            scroll={{
                                y: 55 * 5,
                            }}
                        />
                    </Col>
                </Row>
            </Card>



        </>
    );
};
export default FormAddDotGiamGia;