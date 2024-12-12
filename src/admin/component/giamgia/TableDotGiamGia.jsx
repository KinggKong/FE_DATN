import { Input, Col, Row, Button, DatePicker, Select, Space, Table, Tag, notification } from 'antd';
import { CiSquarePlus } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { TbEyeEdit } from "react-icons/tb";
import { getAllSaleApi, updateStatusSaleApi } from '../../../api/SaleApi';
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { Link } from "react-router-dom";

const TableDotGiamGia = () => {
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState('');
    const [statusSearch, setStatusSearch] = useState('');
    const [thoiGianSearch, setThoiGianSearch] = useState([]);
    const [ngayBatDauSearch, setNgayBatDauSearch] = useState('');
    const [ngayKetThucSearch, setNgayKetThucSearch] = useState('');






    const fetchData = async () => {

        try {

            // Định dạng ngày trực tiếp từ thoiGianSearch
            const formattedDates = {
                thoiGianBatDau: thoiGianSearch && thoiGianSearch[0] ? thoiGianSearch[0].format('YYYY-MM-DDTHH:mm:ss') : null,
                thoiGianKetThuc: thoiGianSearch && thoiGianSearch[1] ? thoiGianSearch[1].format('YYYY-MM-DDTHH:mm:ss') : null,
            };
            console.log(formattedDates);

            const params = {
                pageNumber: currentPage - 1,
                pageSize,
                tenChienDich: search || undefined,  // Không gửi nếu search rỗng
                ngayBatDau: formattedDates.thoiGianBatDau || '',  // Không gửi nếu không có giá trị
                ngayKetThuc: formattedDates.thoiGianKetThuc || '',
                trangThai: statusSearch !== '' ? statusSearch : '',  // Không gửi nếu trạng thái rỗng

            };
            const res = await getAllSaleApi(params);
            if (res && res.data) {
                const dataWithKey = res.data.content.map((item,index) => ({
                    ...item,
                    key: item.id,
                    stt: currentPage === 1 ? index + 1 : (currentPage - 1) * pageSize + index + 1,
                }));
                console.log(dataWithKey);
                setDataSource(dataWithKey);
                setTotalItems(res.data.totalElements);
                const dotGiamGiaHetHan = dataWithKey.filter((item) => {
                    if (item.trangThai === 1) {
                        if (new Date(item.thoiGianKetThuc) < new Date()) {
                            return item.id;
                        }
                    }
                });
                if (dotGiamGiaHetHan.length > 0) {
                    dotGiamGiaHetHan.forEach(async (item) => {
                        await updateStatusSaleApi(item.id);
                    });
                    console.log(dotGiamGiaHetHan);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch data",
            });
        } finally {

        }
    }



    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, search, statusSearch, thoiGianSearch]);
    const handEdit = (record) => {
        console.log(record);
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'stt',
            key: 'stt',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên đợt giảm giá',
            dataIndex: 'tenChienDich',
            key: 'tenChienDich',
        },
        {
            title: 'Giá trị',
            dataIndex: 'giaTriGiam',
            key: 'giaTriGiam',
            render: (_, { giaTriGiam }) => {

                return (
                    <Tag color={"gold"} key={giaTriGiam}>
                        {giaTriGiam} %
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'trangThai',
            dataIndex: 'trangThai',
            render: (_, { trangThai }) => {
                let color = trangThai == 1 ? 'green' : 'volcano';
                return (
                    <Tag color={color} key={trangThai}>
                        {trangThai === 1 ? 'ĐANG DIỄN RA' : 'KHÔNG HOẠT ĐỘNG'}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'thoiGianBatDau',
            key: 'thoiGianBatDau',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'thoiGianKetThuc',
            key: 'thoiGianKetThuc',
        },
        {
            title: 'Hoạt động',
            key: 'action',
            render: (_, record) => (
                <Link to={`/admin/sale/edit/${record.id}`}>
                    <Button >
                        <TbEyeEdit />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <>
            <div>

                <Row justify="space-between">
                    <Col span={12} >

                        <Input placeholder="Tìm kiếm theo tên đợt giảm giá"
                            onChange={(e) => setSearch(e.target.value)}
                            prefix={<FaSearch />} />
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Link to={"/admin/sale/add"}><Button style={{
                            borderColor: 'orange',
                            color: 'orange'
                        }} variant="outlined">
                            <CiSquarePlus />  THÊM MỚI
                        </Button>
                        </Link>
                    </Col>
                </Row>
                <Row className='mt-2' justify="space-between">
                    <Col span={12} >
                        <Row>
                            <Col span={14} >
                                <RangePicker className='me-3'
                                    showTime={{
                                        format: 'HH:mm',
                                    }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                    onChange={(value) => {
                                        if (!value) {
                                            // Khi xóa sạch thời gian
                                            setThoiGianSearch(null); // Hoặc giá trị mặc định
                                            console.log('Thoi Gian Search: Xóa sạch, trả về tất cả kết quả');
                                            // Gọi API trả về tất cả hoặc cập nhật lại dữ liệu
                                            fetchData();
                                        } else {
                                            // Khi có giá trị thời gian
                                            setThoiGianSearch(value);
                                            console.log('Thoi Gian Search: ', value);
                                        }
                                    }}
                                // onOk={(value) => {
                                //     setThoiGianSearch(value); // Cập nhật thoiGianSearch khi nhấn nút OK
                                //     console.log('Thoi Gian Search: ', value);
                                // }}
                                />
                            </Col>
                            <Col span={8} >
                                <Select
                                    defaultValue="Trạng thái"
                                    style={{
                                        width: 220,
                                    }}
                                    onChange={(value) => setStatusSearch(value)}

                                    options={[
                                        {
                                            value: '',
                                            label: 'Trạng thái',
                                        },
                                        {
                                            value: '1',
                                            label: 'Đang hoạt động',
                                        },
                                        {
                                            value: '0',
                                            label: 'Ngừng hoạt động',
                                        },

                                    ]}
                                />
                            </Col>

                        </Row>


                    </Col>
                </Row>
                <Table className='mt-4'
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "50", "100"],
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                />

            </div>

        </>
    )
}
export default TableDotGiamGia;