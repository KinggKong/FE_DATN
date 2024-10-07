import React from 'react';
import { Table } from 'antd';
import { getAllSanPhamChiTietApi } from '../../../../api/SanPhamChiTietAPI';
import { useEffect, useState } from 'react';

const TableSanPhamChiTiet = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataSource, setDataSource] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'tenSanPham',
        },
        {
            title:'Hình ảnh',
            dataIndex:'hinhAnhList',
            render: (hinhAnhList) => {
                if (hinhAnhList && hinhAnhList.length > 0) {
                    return <img src={hinhAnhList[0].src} alt="Hình ảnh sản phẩm" style={{ height: '100px', width: 'auto' }} />;
                }
                return <span>Không có hình ảnh</span>; // Hiển thị nếu không có hình ảnh
            },
        },
        {
            title: 'Tên màu',
            dataIndex: 'tenMauSac',
        },
        {
            title: 'Tên kích thước',
            dataIndex: 'tenKichThuoc',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soLuong',
            sorter: {
                compare: (a, b) => a.soLuong - b.soLuong,
                multiple: 3,
            },
        },
        {
            title: 'Giá ',
            dataIndex: 'giaBan',
            sorter: {
                compare: (a, b) => a.giaBan - b.giaBan,
                multiple: 2,
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            
        },
    ];
    const fetchData = async () => {
        const params = {
            pageNumber: currentPage - 1,
            pageSize,
           
        };
    
        const res = await getAllSanPhamChiTietApi(params);
        if (res && res.data) {
            const dataWithKey = res.data.content.map((item) => ({
                ...item,
                key: item.id,
            }));
           
            setDataSource(dataWithKey);
            setTotalItems(res.data.totalElements);
        }
    };
    useEffect(() => {
    
        fetchData();
    }, [fetchData]);
    
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return(<Table columns={columns} dataSource={dataSource} onChange={onChange}
        pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
            },
        }} />)};
export default TableSanPhamChiTiet;