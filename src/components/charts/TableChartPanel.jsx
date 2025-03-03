import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Empty, Spin } from '@douyinfe/semi-ui';
import { getInitialData } from '../../services/dataService';
import dayjs from 'dayjs';

const { Title } = Typography;

// 表格图表面板组件
const TableChartPanel = ({ queryResult, title = '数据表格', loading = false }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // 当查询结果变化时更新数据
  useEffect(() => {
    if (queryResult && queryResult.length > 0) {
      setData(queryResult);
      generateColumns(queryResult);
    }
  }, [queryResult]);

  // 生成表格列配置
  const generateColumns = (data) => {
    if (!data || data.length === 0) return;

    // 从第一条数据中获取所有键作为列
    const firstItem = data[0];
    const sensitiveKeys = ['article_id', 'user_id', 'draft_id']; // 定义敏感信息字段

    const newColumns = Object.keys(firstItem)
      .filter(key => !sensitiveKeys.some(sk => key.includes(sk))) // 过滤敏感信息
      .map(key => {
        // 处理嵌套对象的显示
        const getNestedValue = (obj, path) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        return {
          title: key,
          dataIndex: key,
          key: key,
          render: (text) => {
            if (text === null || text === undefined) return '-';
            
            // 处理嵌套对象
            if (typeof text === 'object') {
              return (
                <Typography.Text
                  ellipsis={{ rows: 2, showTooltip: true }}
                  style={{ width: '300px' }}
                >
                  {JSON.stringify(text, null, 2)}
                </Typography.Text>
              );
            }

            // 处理长文本
            if (typeof text === 'string' && text.length > 50) {
              return (
                <Typography.Text
                  ellipsis={{ rows: 2, showTooltip: true }}
                  style={{ width: '300px' }}
                >
                  {text}
                </Typography.Text>
              );
            }

            return text;
          }
        };
      });


    setColumns(newColumns);
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
      generateColumns(initialData);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  return (
    <Card>
      <Title heading={4} style={{ marginBottom: 16 }}>{title}</Title>
      <Spin spinning={loading}>
        {data && data.length > 0 && columns.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={data}
            pagination={{
              pageSize: 10,
              showTotal: true
            }}
            size="small"
            bordered
          />
        ) : (
          <Empty description="暂无数据，请执行查询或刷新数据" />
        )}
      </Spin>
    </Card>
  );
};

export default TableChartPanel;