// 数据服务，负责从database.json获取数据和处理数据
import databaseData from '../mapper/extractedDatabase.json';

// 初始数据
const initialData = databaseData;

// 从localStorage获取数据
export const getStoredData = async () => {
  try {
    const storedData = localStorage.getItem('juejin_articles');
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // 如果没有存储的数据，使用初始数据并保存
      await saveData(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('获取数据错误:', error);
    // 出错时返回初始数据
    return initialData;
  }
};

// 保存数据到localStorage
export const saveData = async (data) => {
  try {
    localStorage.setItem('juejin_articles', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存数据错误:', error);
    throw new Error(`保存数据失败: ${error.message}`);
  }
};

// 获取初始数据（用于图表初始化）
export const getInitialData = async () => {
  const data = await getStoredData();
  // 默认返回按点赞数排序的前10条数据
  return data.sort((a, b) => b.article_info.digg_count - a.article_info.digg_count).slice(0, 10);
};