import React, { useEffect, useState, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: React.ReactNode;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  tableHeight?: number | string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: (index: number) => string;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T, index: number) => string;
  isItemLoaded?: (index: number) => boolean;
  loadMoreItems?: (startIndex: number, stopIndex: number) => Promise<void>;
  hasNextPage?: boolean;
  itemCount?: number;
  caption?: string;
  footer?: React.ReactNode;
}

export function VirtualTable<T>({
  data,
  columns,
  rowHeight = 56,
  tableHeight = 400,
  tableClassName,
  headerClassName,
  rowClassName,
  onRowClick,
  keyExtractor,
  isItemLoaded = () => true,
  loadMoreItems = async () => {},
  hasNextPage = false,
  itemCount,
  caption,
  footer,
}: VirtualTableProps<T>) {
  const [tableWidth, setTableWidth] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  
  // 如果没有提供itemCount，则使用数据长度
  const totalItemCount = itemCount ?? data.length;

  useEffect(() => {
    const updateTableWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    };

    updateTableWidth();
    window.addEventListener('resize', updateTableWidth);
    
    return () => {
      window.removeEventListener('resize', updateTableWidth);
    };
  }, []);

  // 行渲染器
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    const isLoaded = isItemLoaded(index);
    
    if (!isLoaded || !item) {
      return (
        <div style={style} className="flex items-center justify-center p-4 border-b">
          <div className="h-6 w-full animate-pulse bg-gray-200 rounded"></div>
        </div>
      );
    }

    return (
      <div 
        style={style} 
        className={cn(
          "flex items-center border-b hover:bg-gray-50 transition-colors",
          rowClassName && rowClassName(index),
          onRowClick && "cursor-pointer"
        )}
        onClick={() => onRowClick && onRowClick(item)}
        key={keyExtractor ? keyExtractor(item, index) : index}
      >
        {columns.map((column, colIndex) => {
          // 安全地获取单元格内容
          let cellContent: React.ReactNode;
          
          if (column.cell) {
            cellContent = column.cell(item);
          } else {
            const key = column.accessorKey as keyof T;
            try {
              const value = item[key];
              cellContent = value !== undefined && value !== null ? String(value) : '';
            } catch {
              cellContent = '';
            }
          }
          
          return (
            <div 
              key={`${index}-${colIndex}`} 
              className={cn(
                "px-4 py-2 overflow-hidden flex items-center",
                column.className,
                column.align === 'right' && "text-right justify-end",
                column.align === 'center' && "text-center justify-center"
              )}
              style={getColumnStyle(column, colIndex)}
            >
              {cellContent}
            </div>
          );
        })}
      </div>
    );
  };

  // 计算每列的宽度和样式
  const getColumnStyle = (column: Column<T>, index: number) => {
    // 如果有明确的宽度类名，使用它
    if (column.className?.includes('w-')) {
      return {};
    }
    
    // 否则平均分配宽度
    return {
      width: `${100 / columns.length}%`,
      minWidth: '80px'
    };
  };

  return (
    <div className={cn("rounded-md w-full", tableClassName)} ref={tableRef}>
      {/* 自定义表头，不使用shadcn的Table组件，确保与数据行完全对齐 */}
      <div className={cn("w-full border-b", headerClassName)}>
        <div className="flex w-full">
          {columns.map((column, index) => (
            <div 
              key={index} 
              className={cn(
                "h-12 px-4 py-3 text-left font-medium text-muted-foreground flex items-center",
                column.className,
                column.align === 'right' && "text-right justify-end",
                column.align === 'center' && "text-center justify-center"
              )}
              style={getColumnStyle(column, index)}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>
      
      {tableWidth > 0 && (
        <div className="w-full">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={totalItemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={ref}
                height={typeof tableHeight === 'number' ? tableHeight : 400}
                itemCount={totalItemCount}
                itemSize={() => rowHeight}
                width={tableWidth}
                onItemsRendered={onItemsRendered}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
        </div>
      )}
      
      {caption && (
        <div className="mt-4 text-sm text-muted-foreground px-4">
          {caption}
        </div>
      )}
      
      {footer && (
        <div className="border-t bg-muted/50 font-medium p-4">
          {footer}
        </div>
      )}
    </div>
  );
}
