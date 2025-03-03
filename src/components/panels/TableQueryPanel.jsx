import React, { useEffect } from 'react';
import { Card, TextArea, Button, Typography, Toast } from '@douyinfe/semi-ui';
import { IconRefresh, IconPlay } from '@douyinfe/semi-icons';

const { Title } = Typography;

const DEFAULT_QUERY = `SELECT articles.article_info.title AS \`标题\`, 
articles.article_info.brief_content AS \`摘要\`, 
articles.article_info.view_count, 
articles.article_info.digg_count, 
articles.article_info.comment_count, 
articles.author_user_info.user_name, 
articles.author_user_info.company 
FROM articles 
ORDER BY articles.article_info.digg_count DESC 
LIMIT 10`;

// 表格查询面板组件
const TableQueryPanel = ({
  query,
  setQuery,
  isLoading,
  executeQueryAction,
  refreshData
}) => {
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
    const result = await refreshData();
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
              loading={isLoading}
              style={{ marginRight: 8 }}
              theme="light"
              size='small'
            >
              刷新数据
            </Button>
            <Button
              icon={<IconPlay />}
              onClick={handleExecuteQuery}
              loading={isLoading}
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
          placeholder="输入SQL查询语句，例如: SELECT article_info.title, author_user_info.user_name FROM articles ORDER BY article_info.digg_count DESC LIMIT 10"
          autosize
          showClear
          rows={1}
        />
        <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
          提示：表格视图适合展示详细数据，建议使用SELECT语句选择特定列进行查询
        </div>
      </div>
    </Card>
  );
};

export default TableQueryPanel;