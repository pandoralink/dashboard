import React, { useState, useEffect } from 'react';
import { Card, Typography, Empty, Spin } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { getInitialData } from '../../services/dataService';

const { Title } = Typography;

// 热力图图表面板组件
const HeatmapChartPanel = ({ queryResult, title = '热力图', loading = false }) => {
  const [data, setData] = useState([]);
  const [chartOption, setChartOption] = useState({});

  // 当查询结果变化时更新数据
  useEffect(() => {
    if (queryResult && queryResult.length > 0) {
      setData(queryResult);
      generateChartOption(queryResult);
    }
  }, [queryResult]);

  // 生成热力图配置
  const generateChartOption = (data) => {
    if (!data || data.length === 0) return;

    try {
      // 准备热力图数据
      const heatmapData = data.map(item => [
        item['articles.article_info->digg_count'],  // X轴：点赞数
        item['articles.article_info->comment_count'],  // Y轴：评论数
        item['articles.article_info->collect_count'] || Math.round(item['articles.article_info->digg_count'] * 0.3),  // 值：收藏数（如果没有则估算）
      ]);
      
      const option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return `点赞: ${params.value[0]}<br>评论: ${params.value[1]}<br>收藏: ${params.value[2]}`;
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '15%',
          bottom: '10%'
        },
        xAxis: {
          type: 'value',
          name: '点赞数',
          nameLocation: 'middle',
          nameGap: 30,
          splitLine: {
            show: true
          }
        },
        yAxis: {
          type: 'value',
          name: '评论数',
          nameLocation: 'middle',
          nameGap: 30,
          splitLine: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%'
        },
        series: [{
          name: '收藏数',
          type: 'scatter',
          symbolSize: function (val) {
            return Math.sqrt(val[2]) * 3;
          },
          data: heatmapData,
          itemStyle: {
            color: function(params) {
              // 根据收藏数设置颜色
              const value = params.value[2];
              return `rgba(255, 0, 0, ${Math.min(value / 100, 1)})`;
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      
      setChartOption(option);
    } catch (error) {
      console.error('生成热力图配置错误:', error);
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
          <ReactECharts option={chartOption} />
        ) : (
          <Empty description="暂无数据，请执行查询或刷新数据" />
        )}
      </Spin>
    </Card>
  );
};

export default HeatmapChartPanel;