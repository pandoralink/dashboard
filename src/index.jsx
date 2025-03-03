import React from 'react';
import ReactDOM from 'react-dom/client';
import { Layout } from '@douyinfe/semi-ui';
import QueryPanel from './components/QueryPanel';
import { QueryProvider } from './context/QueryContext';
import './index.css';

const { Content } = Layout;

function App() {
  return (
      <Layout className="dashboard-layout">
        <Content className="dashboard-content">
          <QueryPanel />
        </Content>
      </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);