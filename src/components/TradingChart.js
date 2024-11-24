import React, { useMemo } from 'react';
import EChart from 'echarts-for-react';
import dayjs from 'dayjs';

const getTimeFormatter = (period) => {
  const formatMap = {
    '1D': 'HH:mm',      
    '1W': 'MMM DD',     
    '1M': 'MMM DD',     
    '3M': 'MMM DD',     
    '6M': 'MMM DD',     
    '12M': 'MMM DD',    
    '3Y': 'MMM YYYY',   
    '5Y': 'MMM YYYY',   
    'MAX': 'MMM YYYY',  
    'YTD': 'MMM DD',    
    'MTD': 'MMM DD',    
    'WTD': 'MMM DD',    
  };
  
  const format = formatMap[period] || 'MMM DD';
  return (date) => dayjs(date).format(format);
};

const formatPrice = (value) => {
  return `$${value.toFixed(2)}`;
};

const TradingChart = ({ chartData, period }) => {
  const processedData = useMemo(() => {
    if (!chartData || !chartData[period]) return [];
    
    const periodData = Array.isArray(chartData[period]) ? chartData[period] : [];
    return periodData.map(item => ({
      date: item.date,
      value: item.value
    }));
  }, [chartData, period]);

  const chartOptions = useMemo(() => {
    const timeFormatter = getTimeFormatter(period);
    
    const firstValue = processedData[0]?.value || 0;
    const lastValue = processedData[processedData.length - 1]?.value || 0;
    const isPositive = lastValue >= firstValue;
    
    const lineColor = isPositive ? '#00C805' : '#FF4D4F';

    return {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params[0]) return '';
          const date = params[0].data[0];
          return `${timeFormatter(date)}<br/>
                  Value: ${formatPrice(params[0].data[1])}`;
        }
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value) => timeFormatter(value)
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          lineStyle: {
            color: '#f5f5f5'
          }
        },
        axisLabel: {
          formatter: (value) => formatPrice(value)
        }
      },
      series: [{
        data: processedData.map(item => [item.date, item.value]),
        type: 'line',
        smooth: false,
        itemStyle: {
          color: lineColor
        },
        lineStyle: {
          color: lineColor
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: lineColor + '20'
            }, {
              offset: 1,
              color: lineColor + '00'
            }]
          }
        }
      }]
    };
  }, [processedData, period]);

  if (!processedData.length) {
    return <div>No data available</div>;
  }

  return (
    <EChart
      option={chartOptions}
      style={{ height: 300, width: '100%' }}
    />
  );
};

export default TradingChart;