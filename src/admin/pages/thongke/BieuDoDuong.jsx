// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import dayjs from 'dayjs';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const DemoLine = ({ data: rawData, xAxisType }) => {
//   const [chartData, setChartData] = useState(null);
//   const [options, setOptions] = useState(null);

//   useEffect(() => {
//     // Chuyển đổi dữ liệu thành dạng phù hợp
//     if (rawData && rawData.length > 0) {
//       const formattedData = rawData.map((item) => ({
//         ...item,
//         x: dayjs(item.date).format(xAxisType === 'date' ? 'DD/MM/YYYY' : xAxisType === 'month' ? 'MM/YYYY' : 'YYYY'),
//       }));

//       const labels = formattedData.map((item) => item.x);
//       const values = formattedData.map((item) => item.value);

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: 'Doanh số',
//             data: values,
//             borderColor: 'rgba(75, 192, 192, 1)',
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             fill: true,
//             tension: 0.4,
//           },
//         ],
//       });

//       setOptions({
//         responsive: true,
//         plugins: {
//           legend: { position: 'top' },
//           title: { display: true, text: 'Thống kê doanh số' },
//         },
//       });
//     }
//   }, [rawData, xAxisType]);

//   if (!chartData) return null;

//   return <Line data={chartData} options={options} />;
// };

// export default DemoLine;
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DemoLine = ({ data: rawData, xAxisType }) => {
  const [chartData, setChartData] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (rawData && rawData.length > 0) {
      // Tạo đối tượng lưu trữ doanh thu theo ngày và sản phẩm
      const productData = {};
      const allDates = new Set();
      let totalRevenueData = []; // Dữ liệu doanh thu tổng

      rawData.forEach(item => {
        const date = dayjs(item.ngay).format(xAxisType === 'date' ? 'DD/MM/YYYY' : xAxisType === 'month' ? 'DD/MM/YYYY' : xAxisType === 'week' ? 'DD/MM/YYYY' : 'MM/YYYY');
        allDates.add(date);  // Thêm ngày vào set

        totalRevenueData.push({ date, value: item.doanhThuTong });

        item.sanPhamDoanhThu.forEach(product => {
          const productName = product.ten_san_pham || '';

          if (!productData[productName]) {
            productData[productName] = [];
          }

          // Tìm kiếm và cộng dồn doanh thu theo ngày
          const existingData = productData[productName];
          const existingIndex = existingData.findIndex(data => data.x === date);

          if (existingIndex === -1) {
            existingData.push({ x: date, value: product.doanhThu });
          } else {
            existingData[existingIndex].value += product.doanhThu;
          }
        });
      });

      const labels = [...allDates].sort();  // Sắp xếp các ngày theo thứ tự

      // Tạo datasets cho biểu đồ
      const datasets = Object.keys(productData).map(productName => {
        const productValues = labels.map(date => {
          const dataForDate = productData[productName].find(item => item.x === date);
          return dataForDate ? dataForDate.value : 0; // Nếu không có dữ liệu cho ngày đó, trả về 0
        });

        return {
          label: productName,
          data: productValues,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        };
      });

      // Dữ liệu tổng doanh thu
      const totalRevenueValues = labels.map(date => {
        const totalDataForDate = totalRevenueData.find(item => item.date === date);
        return totalDataForDate ? totalDataForDate.value : 0; // Nếu không có tổng doanh thu cho ngày đó, trả về 0
      });

      // Thêm dòng tổng doanh thu vào datasets
      datasets.push({
        label: 'Tổng Doanh Thu',
        data: totalRevenueValues,
        borderColor: 'rgba(255, 99, 132, 1)',  // Màu cho tổng doanh thu
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      });

      setChartData({
        labels,
        datasets,
      });

      // setOptions({
      //   responsive: true,
      //   plugins: {
      //     legend: { position: 'top' },
      //     title: { display: true, text: 'Thống kê doanh thu sản phẩm và tổng doanh thu theo ngày' },
      //   },
      // });
      setOptions({
        responsive: true,
        maintainAspectRatio: true, // Cho phép thay đổi kích thước tự do
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Thống kê doanh thu' },
        },
        scales: {
          y: {
            beginAtZero: true, // Bắt đầu từ 0
            min: 0,            // Điều chỉnh giá trị min nếu cần
            ticks: {
              stepSize: 100000, // Điều chỉnh giá trị bước giữa các ticks
              precision: 0,     // Đảm bảo các giá trị trên trục Y được làm tròn
            },
          },
        },
      });
    }
  }, [rawData, xAxisType]);

  if (!chartData) return null;

  return <Line data={chartData} options={options}  />;
};

export default DemoLine;
