import React from 'react';
import { Card, Row, Col } from '@douyinfe/semi-ui';
import BarQueryPanel from './panels/BarQueryPanel';
import HeatmapQueryPanel from './panels/HeatmapQueryPanel';
import TableChartPanel from './charts/TableChartPanel';
import BarChartPanel from './charts/BarChartPanel';
import HeatmapChartPanel from './charts/HeatmapChartPanel';
import TableQueryPanel from './panels/TableQueryPanel';
import ChartQueryWrapper from './ChartQueryWrapper';

const QueryPanel = () => {
  return (
    <Card>
      <Row gutter={[16, 16]} style={{ margin: '0 -8px', height: '100vh' }}>
        <Col span={8} style={{ height: '50vh', marginBottom: '2vh' }}>
          <ChartQueryWrapper
            chartComponent={TableChartPanel}
            queryComponent={TableQueryPanel}
            defaultQuery={`SELECT articles.author_user_info.user_name AS name,
       group_concat(articles.article_info.ctime) AS time
FROM articles
GROUP BY articles.author_user_info.user_name
ORDER BY time`}
            title="阳光普照奖"
          />
        </Col>
        <Col span={8} style={{ height: '50vh', marginBottom: '2vh' }}>
          <ChartQueryWrapper
            chartComponent={TableChartPanel}
            queryComponent={TableQueryPanel}
            defaultQuery={`SELECT articles.article_info.title AS title,
       articles.author_user_info.user_name AS user_name,
       articles.article_info.read_time AS \`阅读时长\`
FROM articles
ORDER BY articles.article_info.content_count DESC
LIMIT 30`}
            title="Trae 使用成就奖"
          />
        </Col>
        <Col span={8} style={{ height: '50vh', marginBottom: '2vh' }}>
          <ChartQueryWrapper
            chartComponent={TableChartPanel}
            queryComponent={TableQueryPanel}
            defaultQuery={`SELECT articles.article_info.title AS title,
       articles.author_user_info.user_name AS \`用户名\`
FROM articles
ORDER BY articles.article_info.view_count DESC
LIMIT 1`}
            title="Trae 独步天下奖"
          />
        </Col>
        <Col span={12} style={{ height: '64vh', marginBottom: '2vh' }}>
          <ChartQueryWrapper
            chartComponent={BarChartPanel}
            queryComponent={BarQueryPanel}
            defaultQuery={`SELECT *
FROM articles
LIMIT 30`}
            title="排名分析"
          />
        </Col>
        <Col span={12} style={{ height: '64vh' }}>
          <ChartQueryWrapper
            chartComponent={HeatmapChartPanel}
            queryComponent={HeatmapQueryPanel}
            defaultQuery={`SELECT articles.article_info.title AS \`标题\`,
       articles.article_info.brief_content AS \`摘要\`,
       articles.article_info.view_count,
       articles.article_info.digg_count,
       articles.article_info.collect_count,
       articles.article_info.comment_count,
       articles.author_user_info.user_name,
       articles.author_user_info.company
FROM articles
LIMIT 20`}
            title="热力分析"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default QueryPanel;