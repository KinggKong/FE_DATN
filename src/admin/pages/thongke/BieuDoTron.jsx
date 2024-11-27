import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const BieuDoTron = ({ data }) => {
  // Chuyển đổi `data` thành định dạng phù hợp với Chart.js
  const chartData = {
    labels: data.map(item => item.type), // Các nhãn (labels) cho biểu đồ
    datasets: [
      {
        data: data.map(item => item.value), // Các giá trị
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ], // Màu sắc
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // Vị trí của chú thích
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = chartData.labels[tooltipItem.dataIndex];
            const value = chartData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: '70%', // Tạo phần rỗng ở giữa (cho Doughnut Chart)
  };

  return <Doughnut data={chartData} options={options} />;
};

export default BieuDoTron;
