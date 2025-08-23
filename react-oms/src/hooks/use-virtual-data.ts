import { useState, useCallback, useEffect } from 'react';

interface UseVirtualDataOptions<T> {
  initialData?: T[];
  pageSize?: number;
  fetchData?: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>;
  filterFn?: (item: T, searchTerm: string) => boolean;
}

export function useVirtualData<T>({
  initialData = [],
  pageSize = 20,
  fetchData,
  filterFn,
}: UseVirtualDataOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [filteredData, setFilteredData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(initialData.length);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));

  // 处理搜索
  useEffect(() => {
    if (searchTerm && filterFn) {
      const filtered = data.filter(item => filterFn(item, searchTerm));
      setFilteredData(filtered);
      setTotalItems(filtered.length);
      setHasNextPage(false);
    } else {
      setFilteredData(data);
      setHasNextPage(fetchData !== undefined);
    }
  }, [searchTerm, data, filterFn]);

  // 检查项目是否已加载
  const isItemLoaded = useCallback(
    (index: number) => {
      if (searchTerm) return index < filteredData.length;
      
      const page = Math.floor(index / pageSize) + 1;
      return loadedPages.has(page) && index < data.length;
    },
    [data.length, filteredData.length, loadedPages, pageSize, searchTerm]
  );

  // 加载更多项目
  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!fetchData || loading || searchTerm) return;

      const startPage = Math.floor(startIndex / pageSize) + 1;
      const stopPage = Math.floor(stopIndex / pageSize) + 1;
      
      const pagesToLoad = [];
      for (let page = startPage; page <= stopPage; page++) {
        if (!loadedPages.has(page)) {
          pagesToLoad.push(page);
        }
      }

      if (pagesToLoad.length === 0) return;

      setLoading(true);
      try {
        const newLoadedPages = new Set(loadedPages);
        
        for (const page of pagesToLoad) {
          const result = await fetchData(page, pageSize);
          setData(prevData => {
            const newData = [...prevData];
            const startIdx = (page - 1) * pageSize;
            
            for (let i = 0; i < result.data.length; i++) {
              newData[startIdx + i] = result.data[i];
            }
            
            return newData;
          });
          
          setTotalItems(result.total);
          setHasNextPage(page * pageSize < result.total);
          newLoadedPages.add(page);
        }
        
        setLoadedPages(newLoadedPages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    },
    [fetchData, loading, loadedPages, pageSize, searchTerm]
  );

  // 重置数据
  const resetData = useCallback(() => {
    setData(initialData);
    setFilteredData(initialData);
    setSearchTerm('');
    setLoading(false);
    setError(null);
    setHasNextPage(fetchData !== undefined);
    setTotalItems(initialData.length);
    setLoadedPages(new Set([1]));
  }, [initialData, fetchData]);

  return {
    data: searchTerm ? filteredData : data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    hasNextPage,
    totalItems,
    isItemLoaded,
    loadMoreItems,
    resetData,
  };
}