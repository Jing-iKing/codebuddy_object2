import { useState, useEffect, useCallback } from 'react';
import { TransitItem, TransitTab, TransitFilter, NewTransitItemForm } from '../types/transit';
import { transitService } from '../services/transit-service';

export const useTransitItems = (initialFilter?: TransitFilter) => {
  const [items, setItems] = useState<TransitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<TransitFilter | undefined>(initialFilter);
  
  // 加载数据
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transitService.getTransitItems(filter);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载中转处理项失败'));
    } finally {
      setLoading(false);
    }
  }, [filter]);
  
  // 创建新项
  const createItem = useCallback(async (newItem: NewTransitItemForm) => {
    try {
      const createdItem = await transitService.createTransitItem(newItem);
      setItems(prev => [...prev, createdItem]);
      return createdItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error('创建中转处理项失败');
    }
  }, []);
  
  // 更新项
  const updateItem = useCallback(async (id: string, item: Partial<TransitItem>) => {
    try {
      const updatedItem = await transitService.updateTransitItem(id, item);
      setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
      return updatedItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error('更新中转处理项失败');
    }
  }, []);
  
  // 删除项
  const deleteItem = useCallback(async (id: string) => {
    try {
      const success = await transitService.deleteTransitItem(id);
      if (success) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('删除中转处理项失败');
    }
  }, []);
  
  // 应用筛选
  const applyFilter = useCallback((newFilter: TransitFilter) => {
    setFilter(newFilter);
  }, []);
  
  // 重置筛选
  const resetFilter = useCallback(() => {
    setFilter(undefined);
  }, []);
  
  // 初始加载和筛选变化时重新加载
  useEffect(() => {
    loadItems();
  }, [loadItems]);
  
  return {
    items,
    loading,
    error,
    filter,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    applyFilter,
    resetFilter
  };
};

export const useTransitTabs = () => {
  const [tabs, setTabs] = useState<TransitTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // 初始化为空数组，避免在数据加载前使用undefined
  const [commonTabs, setCommonTabs] = useState<string[]>([]);
  
  // 加载选项卡数据
  const loadTabs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transitService.getTransitTabs();
      setTabs(data);
      
      // 初始化常用选项卡
      if (data && data.length > 0) {
        const initialCommonTabs = data
          .filter(tab => tab.isCommon)
          .slice(0, 10)
          .map(tab => tab.id);
        
        setCommonTabs(initialCommonTabs);
      }
    } catch (err) {
      console.error('加载中转处理选项卡失败:', err);
      setError(err instanceof Error ? err : new Error('加载中转处理选项卡失败'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 切换选项卡是否为常用
  const toggleTabCommon = useCallback((tabId: string) => {
    setCommonTabs(prev => {
      if (prev.includes(tabId)) {
        // 如果已经是常用选项卡，且不是最后一个常用选项卡，则移除
        if (prev.length > 1) {
          return prev.filter(id => id !== tabId);
        }
        return prev;
      } else {
        // 如果不是常用选项卡，且常用选项卡数量小于10，则添加
        if (prev.length < 10) {
          return [...prev, tabId];
        }
        return prev;
      }
    });
  }, []);
  
  // 初始加载
  useEffect(() => {
    loadTabs();
  }, [loadTabs]);
  
  return {
    tabs,
    loading,
    error,
    commonTabs,
    loadTabs,
    toggleTabCommon
  };
};

export const usePagination = <T,>(items: T[], itemsPerPage: number = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage
  };
};