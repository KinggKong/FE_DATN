
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message, Select, Space, Typography, DatePicker, TimePicker, Dropdown, Menu, Tabs, Table, Button, Input } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';

import DemoChangeData from './BieuDoTron';

import { getThongKeApi, getThongKeDoanhThu, getThongKeDoanhThuSanPham, getThongKeSanPhamBanChayDoanhThu } from '../../../api/ThongKeApi';
import DemoLine from './BieuDoDuong';
import { getSanPhamChiTietSoLuongApi } from '../../../api/SanPhamChiTietAPI';
import { exportToExcelWithMultipleSheets } from './exportToExcelWithMultipleSheets ';
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const onChange = (date) => {
  if (date) {
    console.log('Date: ', date);
  } else {
    console.log('Clear');
  }
};
const onRangeChange = (dates, dateStrings) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  } else {
    console.log('Clear');
  }
};
const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: 'Last 14 Days',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
  {
    label: 'Last 90 Days',
    value: [dayjs().add(-90, 'd'), dayjs()],
  },
];
const dataSource = [
  {
    key: '1',
    tenSanPham: 'Mike',
    thuHang: 1,
    doanhSo: 9384222,
  },
  {
    key: '2',
    tenSanPham: 'John',
    thuHang: 2,
    doanhSo: 982622,
  },
];



const ThongKe = () => {
  const [thongKes, setThongKes] = useState({
    tongDoanhThu: 0, tongSanPhamBan: 0, donThanhCong: 0, donHuy: 0, traHang: 0, choXacNhan: 0

  });
  const [doanhThu, setDoanhThu] = useState([]);

  const [data, setData] = useState([]);

  React.useEffect(() => {
    const mappedData = [
      { type: 'Đơn thành công', value: thongKes.donThanhCong },
      { type: 'Đơn hủy', value: thongKes.donHuy },
      { type: 'Trả hàng', value: thongKes.traHang },
      { type: 'Chờ xác nhận', value: thongKes.choXacNhan },

    ];

    setData(mappedData);
  }, [thongKes]);

  const [type, setType] = useState('date');
  const [dateValue, setDateValue] = useState(null);
  const [ngayBatDau, setNgayBatDau] = useState(moment().format('DD/MM/YYYY'));
  const [ngayKetThuc, setNgayKetThuc] = useState(moment().format('DD/MM/YYYY'));
  const [xAxisType, setXAxisType] = useState('date'); // Kiểu trục x (ngày, tháng, năm).
  const [salesType, setSalesType] = useState('');
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [sanPhamBanChayDoanhSo, setSanPhamBanChayDoanhSo] = useState([]);
  const [sanPhamHetHang, setSanPhamHetHang] = useState([]);
  const [soLuong, setSoLuong] = useState(5);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const columns = [
    {
      title: 'Thứ hạng',
      dataIndex: 'thuHang',
      key: 'thuHang',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'tongDoanhThuFormatted',
      key: 'tongDoanhThu',
    },
  ];
  const columns2 = [
    {
      title: 'Thứ hạng',
      dataIndex: 'thuHang',
      key: 'thuHang',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Số sản phẩm bán',
      dataIndex: 'tongSoLuongBan',
      key: 'tongSoLuongBan',
    },
  ];
  const columnsSanPhamHetHang = [

    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      render: (text, record) => (
        <>
          <div><strong>Tên sản phẩm:</strong> {record.tenSanPham}</div>
          <div><strong>Kích thước:</strong> {record.tenKichThuoc}</div>
          <div><strong>Màu sắc:</strong> {record.tenMauSac}</div>
        </>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
  ];

  const itemTabs = [
    {
      key: '1',
      label: 'Theo doanh số',
      children: <Table dataSource={sanPhamBanChay} columns={columns} pagination={false} />,
    },
    {
      key: '2',
      label: 'Theo số sản phẩm bán',
      children: <Table dataSource={sanPhamBanChayDoanhSo} columns={columns2} pagination={false} />,
    },

  ];







  const renderSingleStatisticCard = (title, value, color, precision = 0, prefix = '') => (
    <Card
      bordered={false}
      style={{
        border: `2px solid #f0f0f0`, // Màu viền tùy chỉnh
        textAlign: 'center',
        flex: 1, // Đảm bảo card lấp đầy khoảng trống còn lại
        minWidth: '180px', // Đảm bảo card không quá nhỏ
        maxWidth: '240px', // Giới hạn kích thước tối đa
        height: '120px', // Chiều cao cố định
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Statistic
        value={value}
        precision={precision}
        prefix={prefix}
        valueStyle={{
          marginBottom: "10px", color: "#1890ff"
        }}
      />

      <Text>{title}</Text>
    </Card>
  );



  const DashboardStatistics = ({ thongKes }) => (
    <div style={{
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'space-between', // Căn đều khoảng cách giữa các card
    }}>
      {renderSingleStatisticCard("Doanh thu", thongKes.tongDoanhThu, '#00EE00', 0, '₫')}
      {renderSingleStatisticCard("Sản phẩm bán", thongKes.tongSanPhamBan, '#00EE00', 0, '')}
      {renderSingleStatisticCard("Đơn thành công", thongKes.donThanhCong, '#00EE00', 0, '')}
      {renderSingleStatisticCard("Đơn hủy", thongKes.donHuy, '#FF0000', 0, '')}
      {/* {renderSingleStatisticCard("Đơn trả", thongKes.traHang, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '')} */}
      {renderSingleStatisticCard("Chờ xác nhận", thongKes.choXacNhan, '#FF9900', 0, '')}
    </div>
  );

  const PickerWithType = ({ type, onChange }) => {
    if (type === 'time') return <TimePicker onChange={onChange} />;
    if (type === 'date') return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
  };

  // const handleTypeChange = (value) => {
  //   setType(value);
  //   let start, end;

  //   switch (value) {
  //     case 'today':
  //       start = end = dayjs();
  //       break;
  //     case 'yesterday':
  //       start = end = dayjs().subtract(1, 'day');
  //       break;
  //     case 'lastWeek':
  //       start = dayjs().subtract(7, 'day');
  //       end = dayjs();
  //       break;
  //     case 'lastMonth':
  //       start = dayjs().subtract(1, 'month');
  //       end = dayjs();
  //       break;
  //     default:
  //       start = end = null; // Xóa giá trị khi chọn kiểu khác
  //   }

  //   setDateValue(start);
  //   if (start && end) {
  //     setNgayBatDau(start.format('DD/MM/YYYY'));
  //     setNgayKetThuc(end.format('DD/MM/YYYY'));
  //   }
  //   console.log('ngayBatDau', ngayBatDau, 'ngayKetThuc', ngayKetThuc);
  // };
  const handleTypeChange = (value) => {
    setType(value);

    let xAxisTypeValue = 'date'; // Mặc định theo ngày.
    if (value === 'week') xAxisTypeValue = 'week';
    if (value === 'month') xAxisTypeValue = 'month';
    if (value === 'quarter') xAxisTypeValue = 'quarter';
    if (value === 'year') xAxisTypeValue = 'year';

    setXAxisType(xAxisTypeValue); // Cập nhật kiểu trục x.

    // Tính ngày bắt đầu và kết thúc.
    let start, end;
    switch (value) {
      case 'today':
        start = end = dayjs();
        break;
      case 'yesterday':
        start = end = dayjs().subtract(1, 'day');
        break;
      case 'lastWeek':
        start = dayjs().subtract(7, 'day');
        end = dayjs();
        break;
      case 'lastMonth':
        start = dayjs().subtract(1, 'month');
        end = dayjs();
        break;
      default:
        start = end = null;
    }

    setDateValue(start);
    if (start && end) {
      setNgayBatDau(start.format('DD/MM/YYYY'));
      setNgayKetThuc(end.format('DD/MM/YYYY'));
    }
  };


  const handleDateChange = (value) => {
    setDateValue(value);

  };
  useEffect(() => {
    if (dateValue) {
      let formattedDate, formattedDate2;
      if (type === 'date') {
        formattedDate = dateValue.format('DD/MM/YYYY');
        setNgayBatDau(formattedDate);
        setNgayKetThuc(formattedDate);
      } else if (type === 'week') {
        formattedDate = dateValue.startOf('week').format('DD/MM/YYYY');
        setNgayBatDau(formattedDate);
        formattedDate2 = dateValue.endOf('week').format('DD/MM/YYYY');
        setNgayKetThuc(formattedDate2);
      } else if (type === 'month') {
        formattedDate = dateValue.startOf('month').format('DD/MM/YYYY');
        setNgayBatDau(formattedDate);
        formattedDate2 = dateValue.endOf('month').format('DD/MM/YYYY');
        setNgayKetThuc(formattedDate2);
      } else if (type === 'quarter') {
        const startOfQuarter = dateValue.startOf('quarter');  // Ngày bắt đầu quý
        const endOfQuarter = dateValue.endOf('quarter');      // Ngày kết thúc quý

        formattedDate = startOfQuarter.format('DD/MM/YYYY');
        setNgayBatDau(formattedDate);

        formattedDate2 = endOfQuarter.format('DD/MM/YYYY');
        setNgayKetThuc(formattedDate2);

        console.log('ngayBatDau', formattedDate, 'ngayKetThuc', formattedDate2);
      } else if (type === 'year') {
        formattedDate = dateValue.startOf('year').format('DD/MM/YYYY');
        setNgayBatDau(formattedDate);
        formattedDate2 = dateValue.endOf('year').format('DD/MM/YYYY');
        setNgayKetThuc(formattedDate2);
      }



      console.log('ngayBatDau', formattedDate, 'ngayKetThuc', formattedDate);
    }
  }, [dateValue]);

  const renderPicker = () => {
    switch (type) {
      case 'week':
        return <DatePicker picker="week" value={dateValue} onChange={handleDateChange} />;
      case 'month':
        return <DatePicker picker="month" value={dateValue} onChange={handleDateChange} />;
      // case 'quarter':
      //   return <DatePicker picker="quarter" value={dateValue} onChange={handleDateChange} />;
      case 'year':
        return <DatePicker picker="year" value={dateValue} onChange={handleDateChange} />;
      default:
        return <DatePicker value={dateValue} onChange={handleDateChange} />;
    }
  };





  const fetchData = useCallback(async () => {
    try {

      const params = {
        ngayBatDau,
        ngayKetThuc,
        typeSale: salesType,
      };
      const res = await getThongKeApi(params);
      if (res) {
        setThongKes(res.data);
        console.log(res);
        console.log('thong ke', thongKes);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Failed to fetch data");
    }
  }, [ngayBatDau, ngayKetThuc, salesType]);

  // const fetchDoanhThu = useCallback(async () => {
  //   try {
  //     const params = {
  //       ngayBatDau,
  //       ngayKetThuc
  //     };
  //     const res = await getThongKeDoanhThu(params);
  //     const mappedData = res.data.map((item) => ({
  //       date: item.ngay, // Ngày dạng ISO string (VD: 2024-11-26).
  //       value: item.doanhThu, // Giá trị doanh số hoặc sản phẩm bán.
  //     }));
  //     console.log('mappedData', mappedData);
  //     if (res) {
  //       setDoanhThu(mappedData);
  //       console.log('doanh thu', doanhThu);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch data", error);
  //     message.error("Failed to fetch data");
  //   }
  // }, [ngayBatDau, ngayKetThuc]);
  // const  fetchDoanhThuSanPham = useCallback(async () => {
  //   try {
  //     const params = {
  //       ngayBatDau,
  //       ngayKetThuc
  //     };
  //     const res = await getThongKeDoanhThuSanPham(params);
  //     const mappedData = res.data.map((item) => ({
  //       ngay: item.ngay, // Ngày dạng ISO string (VD: 2024-11-26).
  //       doanhThu: item.doanhThu, // Giá trị doanh số hoặc sản phẩm bán.
  //       ten_san_pham: item.ten_san_pham
  //     }));
  //     const data = doanhThu.map((item) => ({
  //       ...item,
  //       mappedData: mappedData.find((item2) => item2.ngay === item.date)?.doanhThu || 0,}));
  //     console.log('mappedData', data);
  //     if (res) {
  //       setDoanhThu(data);
  //       console.log('doanh thu', doanhThu);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch data", error);
  //     message.error("Failed to fetch data");
  //   }
  // }, [ngayBatDau, ngayKetThuc]);

  const fetchDoanhThuVaSanPham = useCallback(async () => {
    try {
      const params = {
        ngayBatDau,
        ngayKetThuc,
        filter: xAxisType,
        typeSale: salesType
      };

      // Lấy dữ liệu doanh thu tổng
      const resDoanhThu = await getThongKeDoanhThu(params);
      const doanhThuData = resDoanhThu.data.map((item) => ({
        ngay: item.ngay,
        doanhThuTong: item.doanhThu,
      }));

      // Lấy dữ liệu doanh thu từng sản phẩm
      const resDoanhThuSanPham = await getThongKeDoanhThuSanPham(params);
      const doanhThuTungSanPham = resDoanhThuSanPham.data.map((item) => ({
        ngay: item.ngay,
        doanhThu: item.doanhThu,
        ten_san_pham: item.ten_san_pham,
      }));

      // Gộp dữ liệu doanh thu tổng và doanh thu từng sản phẩm theo ngày
      const combinedData = doanhThuData.map((item) => {
        const sanPhamDataForDate = doanhThuTungSanPham.filter((item2) => item2.ngay === item.ngay);
        return {
          ngay: item.ngay,
          doanhThuTong: item.doanhThuTong,
          sanPhamDoanhThu: sanPhamDataForDate.map((sanPham) => ({
            ten_san_pham: sanPham.ten_san_pham,
            doanhThu: sanPham.doanhThu,
          }))
        };
      });

      console.log('gốc', combinedData);

      // Cập nhật trạng thái
      setDoanhThu(combinedData);
      console.log('doanh thu', combinedData);

    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Failed to fetch data");
    }
  }, [ngayBatDau, ngayKetThuc, xAxisType, salesType]);

  const fetchSanPhamBanChay = useCallback(async () => {
    try {
      const params = {
        ngayBatDau,
        ngayKetThuc,
        typeSale: salesType
      };
      const res = await getThongKeSanPhamBanChayDoanhThu(params);


      if (res) {
        // Thêm thứ hạng và định dạng tiền cho mỗi sản phẩm
        const dataWithRanking = res.data.map((item, index) => {
          // Định dạng tổng doanh thu thành tiền Việt Nam
          const formattedDoanhThu = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(item.tongDoanhThu);

          // Thêm thứ hạng vào sản phẩm
          return {
            ...item,
            thuHang: index + 1, // Thứ hạng dựa trên thứ tự trong mảng
            tongDoanhThuFormatted: formattedDoanhThu, // Định dạng doanh thu
          };
        });

        setSanPhamBanChay(dataWithRanking.slice(0, 10)); // Lưu dữ liệu vào state
        const sortedData = res.data.sort((a, b) => b.tongSoLuongBan - a.tongSoLuongBan);
        const dataWithRanking2 = sortedData.map((item, index) => {


          return {
            ...item,
            thuHang: index + 1, // Thứ hạng dựa trên thứ tự sau khi sắp xếp

          };
        });

        setSanPhamBanChayDoanhSo(dataWithRanking2.slice(0, 10)); // Lưu dữ liệu vào state
        console.log('san pham ban chay', dataWithRanking); // Kiểm tra kết quả
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Failed to fetch data");
    }
  }, [ngayBatDau, ngayKetThuc, salesType]);


  const fetchSanPhamHetHang = useCallback(async () => {
    try {
      const params = {
        soLuong,
        pageNumber: page - 1,
        pageSize,
      };
      const res = await getSanPhamChiTietSoLuongApi(params);
      console.log('san pham het hang', res);
      if (res) {
        const dataWithKey = res.data.content.map((item) => ({
          ...item,
          key: item.id,
        }));
        setSanPhamHetHang(dataWithKey);
        setTotalItems(res.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Failed to fetch data");
    }
  }, [soLuong, page, pageSize]);
  useEffect(() => {
    fetchData();
    fetchDoanhThuVaSanPham();
    fetchSanPhamBanChay();
    fetchSanPhamHetHang();
  }, [fetchData, fetchDoanhThuVaSanPham, fetchSanPhamBanChay, fetchSanPhamHetHang]);


  //Hàm xuất file Excel thống kê tổng hợp
  const handleExportAllData = () => {
    // Chuẩn bị dữ liệu doanh thu
    const flattenedDoanhThu = doanhThu.map((item) => {
      const { ngay, doanhThuTong, sanPhamDoanhThu } = item;
      return sanPhamDoanhThu.map((sp) => ({
        Ngày: ngay,
        "Doanh thu tổng": doanhThuTong,
        "Tên sản phẩm": sp.ten_san_pham,
        "Doanh thu sản phẩm": sp.doanhThu,
      }));
    }).flat();



    // Chuẩn bị dữ liệu để export
    const dataToExport = {
      "Thống Kê Tổng Hợp": thongKes || [],
      "Doanh Thu": flattenedDoanhThu || [],
      "Sản Phẩm Bán Chạy": sanPhamBanChay || [],
      "Sản Phẩm Hết Hàng": sanPhamHetHang || [],
    };

    // Gọi hàm xuất file Excel
    exportToExcelWithMultipleSheets(dataToExport, "ThongKeTongHop", salesType);
  };





  // Hàm xử lý khi chọn kiểu bán hàng (online hoặc offline).
  const handleSalesTypeChange = (value) => {
    setSalesType(value);
    // Cập nhật dữ liệu hoặc logic liên quan đến loại bán hàng
  };





  return (
    <div>
      <Title level={5}>Trang thống kê</Title>

      <Row gutter={16}>
        <Col span={12}>

          <Space className='mb-2 ms-2' direction="vertical" size={12} >
            <Space>
              <Select value={type} onChange={handleTypeChange} style={{ width: 150 }}>
                <Option value="today">Hôm nay</Option>
                <Option value="yesterday">Hôm qua</Option>
                <Option value="lastWeek">Trong 7 ngày qua</Option>
                <Option value="lastMonth">Trong 30 ngày qua</Option>
                <Option value="date">Theo ngày</Option>
                <Option value="week">Theo tuần</Option>
                <Option value="month">Theo tháng</Option>
                {/* <Option value="quarter">Theo quý</Option> */}
                <Option value="year">Theo năm</Option>
              </Select>
              {renderPicker()}
            </Space>

          </Space>
          <Space className='ms-3'>
            <Select value={salesType} onChange={handleSalesTypeChange} style={{ width: 150 }}>
              <Option value="">Tất cả</Option>
              <Option value="ONLINE">Bán hàng online</Option>
              <Option value="OFFLINE">Bán hàng tại quầy</Option>
            </Select>
          </Space>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button icon={<DownloadOutlined />} onClick={handleExportAllData}>
            Tải dữ liệu
          </Button>
        </Col>
      </Row>





      <Row gutter={16}>
        <Col span={24}>
          <DashboardStatistics thongKes={thongKes} />
        </Col>

      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Biểu đồ đơn hàng" bordered={false}>
            <DemoChangeData data={data} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Biểu đồ doanh thu" bordered={false}>
            <DemoLine data={doanhThu} xAxisType={xAxisType} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={

            <div>
              Top 10 sản phẩm bán tiêu biểu trong khoảng thời gian:
              <strong> {ngayBatDau} </strong>
              đến
              <strong> {ngayKetThuc} </strong>

            </div>
          }
            bordered={true}>
            <Tabs defaultActiveKey="1" items={itemTabs} type="card" size="large" />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Sản phẩm sắp hết hàng"
            bordered={true}
            style={{ borderRadius: 8 }}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Input
                  type="number"
                  placeholder="Nhập số lượng tồn"
                  min={0}
                  value={soLuong}
                  onChange={(e) => setSoLuong(Number(e.target.value))}
                  style={{ borderRadius: 8 }}
                  prefix="🔢"
                />
              </Col>
              <Col span={12}>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#888' }}>
                  Lọc các sản phẩm có số lượng nhỏ hơn hoặc bằng <strong>{soLuong}</strong>.
                </p>
              </Col>
            </Row>
            <Table
              dataSource={sanPhamHetHang}
              columns={columnsSanPhamHetHang}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50", "100"],
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}

              style={{ borderRadius: 8 }}
              bordered
            />
          </Card>

        </Col>
      </Row>


    </div>
  )
}

export default ThongKe
