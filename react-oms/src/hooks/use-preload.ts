import { useEffect } from 'react';

/**
 * 预加载组件钩子
 * 
 * 用于在用户可能需要访问某些页面之前预加载这些页面的组件
 * 这可以减少用户点击导航时的等待时间
 * 
 * @param preloadFunctions 要预加载的组件导入函数数组
 * @param delay 延迟预加载的时间（毫秒），默认为2000ms
 */
export function usePreload(
  preloadFunctions: (() => Promise<any>)[],
  delay: number = 2000
) {
  useEffect(() => {
    // 延迟预加载，让主要内容先加载完成
    const timer = setTimeout(() => {
      // 使用 requestIdleCallback 在浏览器空闲时间执行预加载
      // 如果浏览器不支持 requestIdleCallback，则使用 setTimeout 作为降级方案
      const preload = () => {
        preloadFunctions.forEach(importFunc => {
          // 使用 catch 忽略可能的加载错误，不影响用户体验
          importFunc().catch(() => {});
        });
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preload);
      } else {
        setTimeout(preload, 100);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [preloadFunctions, delay]);
}