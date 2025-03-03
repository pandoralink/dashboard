import React, { useState, useEffect } from 'react';
import { Card, Typography, Empty, Spin } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { getInitialData } from '../../services/dataService';

const { Title } = Typography;

// 折线图图表面板组件
const LineChartPanel = ({ queryResult, title = '折线图', loading = false }) => {
  const [data, setData] = useState([]);
  const [chartOption, setChartOption] = useState({});

  // 当查询结果变化时更新数据
  useEffect(() => {
    if (queryResult && queryResult.length > 0) {
      setData(queryResult);
      generateChartOption(queryResult);
    }
  }, [queryResult]);

  // 生成折线图配置
  const generateChartOption = (data) => {
    if (!data || data.length === 0) return;

    try {
      // 尝试找出时间字段和数值字段
      const firstItem = data[0];
      const keys = Object.keys(firstItem);
      
      // 尝试识别时间字段（包含time、date等关键词的字段）
      let timeField = keys.find(key => 
        /time|date|day|month|year/i.test(key)
      ) || keys[0]; // 如果没找到，使用第一个字段
      
      const valueFields = ['aValue'];
      
      // 获取所有时间点并排序
      const timePoints = [...new Set(data.map(item => item[timeField]))].sort();
      
      // 为每个数值字段创建一个系列
      const series = valueFields.map(field => {
        // 为每个时间点找到对应的值
        const seriesData = timePoints.map(time => {
          const matchItem = data.find(item => item[timeField] === time);
          return matchItem ? matchItem : null;
        });
        
        return {
          name: field,
          type: 'line',
          data: seriesData,
          smooth: true,
          emphasis: {
            focus: 'series'
          }
        };
      });
      
      const option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: valueFields,
          type: 'scroll',
          orient: 'horizontal',
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timePoints
        },
        yAxis: {
          type: 'value'
        },
        series: series
      };
      
      setChartOption(option);
    } catch (error) {
      console.error('生成折线图配置错误:', error);
      setChartOption({});
    }
  };

  // 初始加载数据
  useEffect(() => {
    if (!queryResult || queryResult.length === 0) {
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const initialData = await getInitialData();
      setData(initialData);
      generateChartOption(initialData);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  return (
    <Card>
      <Title heading={4} style={{ marginBottom: 16 }}>{title}</Title>
      <Spin spinning={loading}>
        {data && data.length > 0 && Object.keys(chartOption).length > 0 ? (
          <ReactECharts option={chartOption} style={{ height: 400 }} />
        ) : (
          <Empty description="暂无数据，请执行查询或刷新数据" />
        )}
      </Spin>
    </Card>
  );
};

export default LineChartPanel;