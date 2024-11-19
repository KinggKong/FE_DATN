
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message, Select, Space, Typography, DatePicker, TimePicker, Dropdown, Menu, Tabs, Table, Button } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';

import DemoChangeData from './BieuDoTron';

import { getThongKeApi } from '../../../api/ThongKeApi';
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
    title: 'Doanh số',
    dataIndex: 'doanhSo',
    key: 'doanhSo',
  },
];
const columnsSanPhamHetHang = [

  {
    title: 'Tên sản phẩm',
    dataIndex: 'tenSanPham',
    key: 'tenSanPham',
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
    children: <Table dataSource={dataSource} columns={columns} />,
  },
  {
    key: '2',
    label: 'Theo số sản phẩm bán',
    children: 'Content of Tab Pane 2',
  },

];

const ThongKe = () => {
  const [thongKes, setThongKes] = useState({
    tongDoanhThu: 0, tongSanPhamBan: 0, donThanhCong: 0, donHuy: 0, traHang: 0

  });

  const [data, setData] = useState([]);

React.useEffect(() => {
  const mappedData = [
    { type: 'Đơn thành công', value: thongKes.donThanhCong },
    { type: 'Đơn hủy', value: thongKes.donHuy },
    { type: 'Trả hàng', value: thongKes.traHang },
   
  ];

  setData(mappedData);
}, [thongKes]);

  const [type, setType] = useState('date');
  const [dateValue, setDateValue] = useState(null);
  const [ngayBatDau, setNgayBatDau] = useState(moment().format('DD/MM/YYYY'));
  const [ngayKetThuc, setNgayKetThuc] = useState(moment().format('DD/MM/YYYY'));


  const renderSingleStatisticCard = (title, value, color, precision, prefix) => (
    <Card bordered={false} style={{ background: color, color: 'white', marginBottom: '24px', textAlign: 'center', minWidth: '200px', height: '100px' }}>
      <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>{title}</h3>
      <Statistic
        value={value}
        precision={precision}
        prefix={prefix}
        valueStyle={{ fontSize: '1.5em', fontWeight: 'bold', color: 'white' }}
      />
    </Card>
  );

  const DashboardStatistics = ({ thongKes }) => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {renderSingleStatisticCard("Doanh thu", thongKes.tongDoanhThu, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '₫')}
      {renderSingleStatisticCard("Sản phẩm bán", thongKes.tongSanPhamBan, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '')}
      {renderSingleStatisticCard("Đơn thành công", thongKes.donThanhCong, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '')}
      {renderSingleStatisticCard("Đơn hủy", thongKes.donHuy, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '')}
      {renderSingleStatisticCard("Đơn trả", thongKes.traHang, 'linear-gradient(to right, #59c173, #a17fe0, #5d26c1)', 0, '')}
    </div>
  );

  const PickerWithType = ({ type, onChange }) => {
    if (type === 'time') return <TimePicker onChange={onChange} />;
    if (type === 'date') return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
  };

  const handleTypeChange = (value) => {
    setType(value);
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
        start = end = null; // Xóa giá trị khi chọn kiểu khác
    }

    setDateValue(start);
    if (start && end) {
      setNgayBatDau(start.format('DD/MM/YYYY'));
      setNgayKetThuc(end.format('DD/MM/YYYY'));
    }
    console.log('ngayBatDau', ngayBatDau, 'ngayKetThuc', ngayKetThuc);
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
      case 'quarter':
        return <DatePicker picker="quarter" value={dateValue} onChange={handleDateChange} />;
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
        ngayKetThuc
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
  }, [ngayBatDau, ngayKetThuc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);






  return (
    <div>
      <h1>Trang thống kê</h1>
      <Row gutter={16}>
        <Col span={12}>

          <Space className='mb-2 ms-2' direction="vertical" size={12}>
            <Space>
              <Select value={type} onChange={handleTypeChange} style={{ width: 150 }}>
                <Option value="today">Hôm nay</Option>
                <Option value="yesterday">Hôm qua</Option>
                <Option value="lastWeek">Trong 7 ngày qua</Option>
                <Option value="lastMonth">Trong 30 ngày qua</Option>
                <Option value="date">Theo ngày</Option>
                <Option value="week">Theo tuần</Option>
                <Option value="month">Theo tháng</Option>
                <Option value="quarter">Theo quý</Option>
                <Option value="year">Theo năm</Option>
              </Select>
              {renderPicker()}
            </Space>
          </Space>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button icon={<DownloadOutlined />} >
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
        <Col span={12}>
          <Card title="Biểu đồ đơn hàng" bordered={false}>
            <DemoChangeData data={data} />
          </Card>
        </Col>
        {/* <Col span={12}>
          <Card title="Biểu đồ doanh thu" bordered={false}>
            <DemoLine />
          </Card>
        </Col> */}
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Thứ hạng sản phẩm" bordered={true}>
            <Tabs defaultActiveKey="1" items={itemTabs} type="card" size="large" />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Sản phẩm sắp hết hàng" bordered={true}>
            <input type="number" placeholder="Số lượng sản phẩm tồn" min={0} />
            <Table dataSource={dataSource} columns={columnsSanPhamHetHang} />
          </Card>
        </Col>
      </Row>


    </div>
  )
}

export default ThongKe
