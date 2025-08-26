import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  totalItems: number;
  className?: string;
}

/**
 * 智能分页组件，优化显示大量页码的情况
 * 
 * 特点：
 * 1. 始终显示第一页和最后一页
 * 2. 显示当前页附近的页码
 * 3. 使用省略号表示被省略的页码
 * 4. 最多显示5个页码按钮
 * 5. 提供"每页x项"选择器
 */
export function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  totalItems,
  className = "",
}: SmartPaginationProps) {
  // 如果总页数小于等于1且没有页面大小选项，则不显示分页
  if (totalPages <= 0 && pageSizeOptions.length <= 1) {
    return null;
  }

  // 生成要显示的页码
  const getPageNumbers = (): (number | string)[] => {
    // 最多显示5个页码按钮
    const maxVisiblePages = 5;
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 始终显示第一页
      pageNumbers.push(1);
      
      // 计算中间页码的起始和结束
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // 调整以确保显示正确数量的页码
      if (startPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      }
      if (endPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // 添加省略号和中间页码
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // 始终显示最后一页
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // 处理页面大小变化
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      onPageSizeChange(newPageSize);
    }
  };

  return (
    <div className={`flex flex-row items-center justify-end w-full ${className}`}>
      <div className="flex items-center text-sm text-muted-foreground mr-4">
        <span>共 {totalItems} 项</span>
        <span className="mx-2">|</span>
        <div className="flex items-center gap-1">
          <span>每页</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[60px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>项</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages <= 1}
          className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="上一页"
        >
          <span aria-hidden="true">‹</span>
        </button>
        
        {totalPages > 1 ? (
          getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="inline-flex items-center justify-center h-9 w-9 text-sm"
                >
                  …
                </span>
              );
            }
            
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`inline-flex items-center justify-center h-9 w-9 rounded-md text-sm ${
                  currentPage === page 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {page}
              </button>
            );
          })
        ) : (
          <button
            className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-primary text-primary-foreground text-sm"
          >
            1
          </button>
        )}
        
        <button 
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="下一页"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}