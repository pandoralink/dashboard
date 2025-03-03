import alasql from 'alasql';
import { Parser } from 'node-sql-parser';
import { getStoredData, saveData } from './dataService';

const parser = new Parser();

// 初始化AlaSQL数据库
const initDatabase = (data) => {
  // 如果表已存在，先删除
  try {
    alasql('DROP TABLE IF EXISTS articles');
  } catch (e) {
    console.log('表不存在，无需删除');
  }
  
  // 创建表
  alasql('CREATE TABLE articles');
  
  // 插入数据
  if (data && data.length > 0) {
    alasql.tables.articles.data = data;
  }
};

// 解析SQL查询中的LIMIT值
export const parseLimitFromQuery = (query) => {
  try {
    const ast = parser.astify(query);
    return ast.limit?.value?.[0]?.value ?? null;
  } catch (error) {
    console.error('解析LIMIT值错误:', error);
    return null;
  }
};

// 解析SQL查询中的列别名
const parseColumnAliases = (query) => {
  try {
    const ast = parser.astify(query);
    const aliases = {};
    
    if (ast.columns === '*') return null;
    
    ast.columns.forEach(col => {
      if (col.expr.type === 'column_ref' && col.as) {
        aliases[col.as] = col.expr.column;
      }
    });
    
    return Object.keys(aliases).length > 0 ? aliases : null;
  } catch (error) {
    console.error('解析列别名错误:', error);
    return null;
  }
};

// 执行SQL查询
export const executeQuery = async (query) => {
  try {
    // 获取存储的数据
    const data = await getStoredData();
    
    // 初始化数据库
    initDatabase(data);
    
    // 解析列别名
    const columnAliases = parseColumnAliases(query);
    
    // 执行查询
    const result = alasql(query);
    
    // 解析查询中的LIMIT值并添加到结果中
    result.limitValue = parseLimitFromQuery(query);
    result.columnAliases = columnAliases;
    
    return result;
  } catch (error) {
    console.error('执行查询错误:', error);
    throw new Error(`查询执行失败: ${error.message}`);
  }
};

// 添加新数据
export const addNewData = async (newData) => {
  try {
    // 获取现有数据
    const existingData = await getStoredData();
    
    // 合并数据
    const mergedData = [...existingData, ...newData];
    
    // 保存合并后的数据
    await saveData(mergedData);
    
    return mergedData;
  } catch (error) {
    console.error('添加数据错误:', error);
    throw new Error(`添加数据失败: ${error.message}`);
  }
};