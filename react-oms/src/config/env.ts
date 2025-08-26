/**
 * 环境配置文件
 * 用于集中管理环境变量和配置项
 */

// 检查是否在浏览器环境中，并且是否有环境变量
const isProduction = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

// 安全地访问Vite环境变量
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    // @ts-ignore - 忽略TypeScript错误，因为在运行时这是有效的
    return (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const config = {
  // API基础URL
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', '/api'),
  
  // 是否使用模拟数据
  useMockData: getEnvVar('VITE_USE_MOCK_DATA', !isProduction ? 'true' : 'false') !== 'false',
  
  // 其他环境配置
  debug: getEnvVar('VITE_DEBUG', !isProduction ? 'true' : 'false') === 'true',
    
  // 分页默认配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100]
  }
};

// 添加调试日志
console.log('环境配置加载完成:', {
  apiBaseUrl: config.apiBaseUrl,
  useMockData: config.useMockData,
  debug: config.debug,
  isProduction
});
