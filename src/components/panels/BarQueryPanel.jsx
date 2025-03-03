import React, { useEffect } from 'react';
import { Card, TextArea, Button, Toast } from '@douyinfe/semi-ui';
import { IconRefresh, IconPlay } from '@douyinfe/semi-icons';
import { useQueryContext } from '../../context/QueryContext';

// 柱状图查询面板组件
const BarQueryPanel = () => {
  const { query, setQuery, isBarLoading, executeQueryAction, refreshBarData } = useQueryContext();

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
    const result = await refreshBarData();
    if (result.success) {
      Toast.info('正在刷新数据...');
    } else {
      Toast.error(`刷新数据错误: ${result.error}`);
    }
  };

  useEffect(() => {
    executeQueryAction();
  }, []);

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <Button
              icon={<IconRefresh />}
              onClick={handleRefreshData}
              loading={isBarLoading}
              style={{ marginRight: 8 }}
              theme="light"
              size='small'
            >
              刷新数据
            </Button>
            <Button
              icon={<IconPlay />}
              onClick={handleExecuteQuery}
              loading={isBarLoading}
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
          placeholder="输入SQL查询语句，例如: SELECT author, likes FROM articles ORDER BY likes DESC LIMIT 10"
          autosize
          showClear
          rows={1}
        />
        <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
          提示：柱状图适合比较不同类别之间的数值大小，请确保查询结果包含类别字段和对应的数值字段
        </div>
      </div>
    </Card>
  );
};

export default BarQueryPanel;