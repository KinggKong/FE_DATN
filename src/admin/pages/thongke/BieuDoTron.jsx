import React from 'react';

import { Pie } from '@ant-design/plots';

const DemoChangeData = ({data}) => {
  
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
};
export default DemoChangeData;