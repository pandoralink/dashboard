import React, { useState, useEffect } from 'react';
import { Card, Typography, Empty, Spin } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { getInitialData } from '../../services/dataService';

const { Title } = Typography;

// 饼图图表面板组件
const PieChartPanel = ({ queryResult, title = '饼图', loading = false }) => {
  const [data, setData] = useState([]);
  const [chartOption, setChartOption] = useState({});

  // 当查询结果变化时更新数据
  useEffect(() => {
    if (queryResult && queryResult.length > 0) {
      setData(queryResult);
      generateChartOption(queryResult);
    }
  }, [queryResult]);

  // 生成饼图配置
  const generateChartOption = (data) => {
    if (!data || data.length === 0) return;

    try {
      // 尝试找出类别字段和数值字段
      const firstItem = data[0];
      const keys = Object.keys(firstItem);
      
      // 尝试识别数值字段（通常是数字类型）
      const valueField = keys.find(key => typeof firstItem[key] === 'number') || keys[1];
      
      // 尝试识别类别字段（通常是字符串类型，且不是数值字段）
      const categoryField = keys.find(key => key !== valueField && typeof firstItem[key] === 'string') || keys[0];
      
      // 准备饼图数据
      const pieData = data.map(item => ({
        name: String(item[categoryField]),
        value: Number(item[valueField]) || 0
      }));
      
      const option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          type: 'scroll',
          data: pieData.map(item => item.name)
        },
        series: [
          {
            name: valueField,
            type: 'pie',
            radius: '50%',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      
      setChartOption(option);
    } catch (error) {
      console.error('生成饼图配置错误:', error);
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

export default PieChartPanel;