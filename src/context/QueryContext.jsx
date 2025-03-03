import React, { createContext, useState, useContext } from 'react';
import { executeQuery } from '../services/queryService';

// 创建查询上下文
const QueryContext = createContext();

// 查询上下文提供者组件
export const QueryProvider = ({ defaultQuery, children }) => {
  // 查询状态
  const [query, setQuery] = useState(defaultQuery);
  const [queryResult, setQueryResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limitValue, setLimitValue] = useState(10); // 默认限制值

  // 解析SQL查询中的LIMIT值
  const parseLimitFromQuery = (queryString) => {
    const limitRegex = /LIMIT\s+(\d+)/i;
    const match = queryString.match(limitRegex);
    
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  };

  // 执行查询
  const executeQueryAction = async () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeQuery(query);
      if (Array.isArray(result) && result.length > 0) {
        setQueryResult(result);
      } else {
        setQueryResult([]);
      }
      
      // 解析并设置LIMIT值
      const limit = parseLimitFromQuery(query);
      setLimitValue(limit);
      
      return { success: true, result };
    } catch (error) {
      console.error('查询错误:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 触发数据刷新事件（保留原有的事件机制，以便兼容）
      const event = new CustomEvent('refresh-data');
      window.dispatchEvent(event);
      return { success: true };
    } catch (error) {
      console.error('刷新数据错误:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 上下文值
  const contextValue = {
    query,
    setQuery,
    queryResult,
    isLoading,
    limitValue,
    executeQueryAction,
    refreshData
  };

  return (
    <QueryContext.Provider value={contextValue}>
      {children}
    </QueryContext.Provider>
  );
};

// 自定义钩子，用于访问查询上下文
export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryContext必须在QueryProvider内部使用');
  }
  return context;
};