import React, { useState } from 'react';
import { QueryProvider, useQueryContext } from '../context/QueryContext';

const ChartQueryWrapperWithoutProvider = ({ 
  chartComponent: ChartComponent, 
  queryComponent: QueryComponent,
  title
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { executeQueryAction, refreshData, setQuery, query,queryResult, setQueryResult } = useQueryContext();

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await executeQueryAction(query);
      if (result.success) {
        setQueryResult(result.data || []);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const result = await refreshData();
      if (result.success) {
        setQueryResult(result.data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const wrapperProps = {
    query,
    setQuery,
    isLoading,
    executeQueryAction: handleExecuteQuery,
    refreshData: handleRefreshData,
    queryResult,
    setQueryResult
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '67%', overflow: 'auto' }}>
        <ChartComponent queryResult={queryResult} title={title} loading={isLoading} />
      </div>
      <div style={{ height: '33%', overflow: 'auto' }}>
        <QueryComponent {...wrapperProps} />
      </div>
    </div>
  );
};

const ChartQueryWrapper = ({ 
    chartComponent: ChartComponent, 
    queryComponent: QueryComponent,
    defaultQuery,
    title
  }) => {
  return (
    <QueryProvider defaultQuery={defaultQuery}>
      <ChartQueryWrapperWithoutProvider
        chartComponent={ChartComponent}
        queryComponent={QueryComponent}
        title={title}
      />
    </QueryProvider>
  );
};

export default ChartQueryWrapper;