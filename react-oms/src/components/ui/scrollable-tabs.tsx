import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ScrollableTabs = TabsPrimitive.Root

interface ScrollableTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  className?: string;
  children: React.ReactNode;
}

const ScrollableTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  ScrollableTabsListProps
>(({ className, children, ...props }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  // 检查是否需要显示滚动箭头
  const checkScrollArrows = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // -1 是为了处理小数点舍入
    }
  }, []);

  // 滚动处理
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // 每次滚动的像素数
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // 监听滚动事件和窗口大小变化
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollArrows();
      scrollContainer.addEventListener('scroll', checkScrollArrows);
      window.addEventListener('resize', checkScrollArrows);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollArrows);
        window.removeEventListener('resize', checkScrollArrows);
      };
    }
  }, [checkScrollArrows]);

  // 初始检查和子元素变化时重新检查
  React.useEffect(() => {
    // 使用setTimeout确保DOM完全渲染后再检查
    const timer = setTimeout(() => {
      checkScrollArrows();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [children, checkScrollArrows]);

  return (
    <div className="relative flex items-center">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 h-8 w-8 rounded-full bg-background shadow-md"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">向左滚动</span>
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <TabsPrimitive.List
          ref={ref}
          className={cn(
            "inline-flex min-w-full items-center border-b border-muted bg-transparent",
            className
          )}
          {...props}
        >
          {children}
        </TabsPrimitive.List>
      </div>
      
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 h-8 w-8 rounded-full bg-background shadow-md"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">向右滚动</span>
        </Button>
      )}
    </div>
  );
});
ScrollableTabsList.displayName = "ScrollableTabsList";

const ScrollableTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none",
      className
    )}
    {...props}
  />
));
ScrollableTabsTrigger.displayName = "ScrollableTabsTrigger";

const ScrollableTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
ScrollableTabsContent.displayName = "ScrollableTabsContent";

export { ScrollableTabs, ScrollableTabsList, ScrollableTabsTrigger, ScrollableTabsContent };