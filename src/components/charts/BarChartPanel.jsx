import React, { useState, useEffect } from 'react';
import { Card, Typography, Empty, Spin } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { getInitialData } from '../../services/dataService';

const { Title } = Typography;

// 柱状图图表面板组件
const BarChartPanel = ({ queryResult, title = '柱状图', loading = false }) => {
  const [data, setData] = useState([]);
  const [chartOption, setChartOption] = useState({});

  // 当查询结果变化时更新数据
  useEffect(() => {
    if (queryResult && queryResult.length > 0) {
      setData(queryResult);
      generateChartOption(queryResult);
    }
  }, [queryResult]);

  // 生成柱状图配置
  const generateChartOption = (data) => {
    if (!data || data.length === 0) return;

    try {
      // 获取最新的数据
      const latestDate = new Date(Math.max(...data.map(item => new Date(item['article_info']['ctime']))));
      const latestData = data.filter(item => {
        const itemDate = new Date(item['article_info']['ctime']);
        return itemDate.toDateString() === latestDate.toDateString();
      });
      
      // 按综合分数排序（点赞 * 0.6 + 评论 * 0.3 + 收藏 * 0.1）
      const sortedData = [...latestData].map(item => ({
        ...item,
        score: (item['article_info']['digg_count'] * 0.6) + (item['article_info']['comment_count'] * 0.3) + ((item['article_info']['collect_count'] || 0) * 0.1)
      })).sort((a, b) => b.score - a.score);
      
      // 计算得分比例
      const totalTopScore = sortedData.reduce((sum, item) => sum + item.score, 0);
      const barData = sortedData.map(item => ({
        name: item['author_user_info']['user_name'],
        value: (item.score / totalTopScore * 100).toFixed(2)
      }));
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const data = params[0];
            return `${data.name}<br/>得分比例: ${data.value}%`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: barData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '得分比例(%)',
          max: 100
        },
        series: [
          {
            name: '得分比例',
            type: 'bar',
            data: barData.map(item => item.value),
            itemStyle: {
              color: function(params) {
                // 前5名使用渐变色，其他为灰色
                if (params.dataIndex < 5) {
                  const colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'];
                  return colorList[params.dataIndex];
                }
                return '#ccc';
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            }
          }
        ]
      };
      
      setChartOption(option);
    } catch (error) {
      console.error('生成柱状图配置错误:', error);
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

export default BarChartPanel;