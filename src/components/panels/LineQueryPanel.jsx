import React from 'react';
import { Card, TextArea, Button, Typography, Toast } from '@douyinfe/semi-ui';
import { IconRefresh, IconPlay } from '@douyinfe/semi-icons';
import { useQueryContext } from '../../context/QueryContext';

const { Title } = Typography;

// 折线图查询面板组件
const LineQueryPanel = () => {
  const { query, setQuery, isLineLoading, executeQueryAction, refreshLineData } = useQueryContext();

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      Toast.warning('请输入查询语句');
      return;
    }

    const result = await executeQueryAction();
    if (result.success) {
      Toast.success('查询成功');
    } else {
      Toast.error(`查询错误: ${result.error}`);
    }
  };

  const handleRefreshData = async () => {
    const result = await refreshLineData();
    if (result.success) {
      Toast.info('正在刷新数据...');
    } else {
      Toast.error(`刷新数据错误: ${result.error}`);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <Button 
              icon={<IconRefresh />} 
              onClick={handleRefreshData} 
              loading={isLineLoading}
              style={{ marginRight: 8 }}
              theme="light"
              size='small'
            >
              刷新数据
            </Button>
            <Button 
              icon={<IconPlay />} 
              onClick={handleExecuteQuery} 
              loading={isLineLoading}
              type="primary"
              size='small'
            >
              执行查询
            </Button>
          </div>
        </div>
        <TextArea
          value={query}
          onChange={handleQueryChange}
          placeholder="输入SQL查询语句，例如: SELECT author, likes, crawlTime FROM articles ORDER BY crawlTime DESC"
          autosize
          showClear
          rows={1}
        />
        <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
          提示：折线图适合展示数据随时间的变化趋势，请确保查询结果包含时间字段和需要展示的数值字段
        </div>
      </div>
    </Card>
  );
};

export default LineQueryPanel;