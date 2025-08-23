import { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Trash2,
  Archive,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  setCurrentPage,
  setPageSize,
  setFilter
} from "@/store/slices/notification-slice";
import { 
  NotificationPriority, 
  NotificationType, 
  NotificationStatus,
  NotificationFilter
} from "@/types/notification";

// 通知类型图标映射
const notificationTypeIcons = {
  [NotificationType.System]: <Bell className="h-4 w-4" />,
  [NotificationType.Order]: <Bell className="h-4 w-4" />,
  [NotificationType.Task]: <Bell className="h-4 w-4" />,
  [NotificationType.Alert]: <Bell className="h-4 w-4 text-red-500" />
};

// 通知优先级样式映射
const priorityStyles = {
  [NotificationPriority.Low]: "",
  [NotificationPriority.Medium]: "font-medium",
  [NotificationPriority.High]: "font-bold text-red-500"
};

// 通知状态徽章映射
const statusBadges = {
  [NotificationStatus.Unread]: <Badge className="bg-blue-100 text-blue-800">未读</Badge>,
  [NotificationStatus.Read]: <Badge className="bg-gray-100 text-gray-800">已读</Badge>,
  [NotificationStatus.Archived]: <Badge className="bg-yellow-100 text-yellow-800">已归档</Badge>
};

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { 
    notifications, 
    loading, 
    total, 
    currentPage, 
    pageSize, 
    filter 
  } = useAppSelector((state) => state.notifications);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tempFilter, setTempFilter] = useState<NotificationFilter | null>(filter);

  // 组件挂载时获取通知列表
  useEffect(() => {
    loadNotifications();
  }, [dispatch, currentPage, pageSize, filter]);

  // 加载通知
  const loadNotifications = () => {
    dispatch(fetchNotifications({ 
      page: currentPage, 
      limit: pageSize,
      filter: filter || undefined
    }));
  };

  // 处理标记为已读
  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  // 处理标记所有为已读
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // 处理归档通知
  const handleArchive = (id: string) => {
    dispatch(archiveNotification(id));
  };

  // 处理删除通知
  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // 处理每页条数变化
  const handlePageSizeChange = (size: string) => {
    dispatch(setPageSize(parseInt(size)));
    dispatch(setCurrentPage(1));
  };

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    let newFilter: NotificationFilter | null = null;
    
    switch (value) {
      case "unread":
        newFilter = { status: NotificationStatus.Unread };
        break;
      case "read":
        newFilter = { status: NotificationStatus.Read };
        break;
      case "archived":
        newFilter = { status: NotificationStatus.Archived };
        break;
      case "system":
        newFilter = { type: NotificationType.System };
        break;
      case "order":
        newFilter = { type: NotificationType.Order };
        break;
      case "task":
        newFilter = { type: NotificationType.Task };
        break;
      case "alert":
        newFilter = { type: NotificationType.Alert };
        break;
      default:
        newFilter = null;
    }
    
    dispatch(setFilter(newFilter));
    dispatch(setCurrentPage(1));
  };

  // 处理筛选条件变化
  const handleFilterChange = (field: keyof NotificationFilter, value: any) => {
    setTempFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 应用筛选条件
  const applyFilter = () => {
    dispatch(setFilter(tempFilter));
    dispatch(setCurrentPage(1));
    setIsFilterOpen(false);
  };

  // 重置筛选条件
  const resetFilter = () => {
    setTempFilter(null);
    dispatch(setFilter(null));
    dispatch(setCurrentPage(1));
    setIsFilterOpen(false);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return format(new Date(date), "yyyy-MM-dd HH:mm", { locale: zhCN });
  };

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">通知中心</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadNotifications}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          {notifications.some(n => n.status === NotificationStatus.Unread) && (
            <Button 
              className="bg-black hover:bg-gray-800" 
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <Check className="mr-2 h-4 w-4" />
              全部标为已读
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="grid grid-cols-4 md:grid-cols-8">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="unread">未读</TabsTrigger>
            <TabsTrigger value="read">已读</TabsTrigger>
            <TabsTrigger value="archived">已归档</TabsTrigger>
            <TabsTrigger value="system">系统通知</TabsTrigger>
            <TabsTrigger value="order">订单通知</TabsTrigger>
            <TabsTrigger value="task">任务通知</TabsTrigger>
            <TabsTrigger value="alert">警报通知</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索通知..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="mr-2 h-4 w-4" />
              高级筛选
              {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
          <CollapsibleContent>
            <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">通知类型</h4>
                <Select 
                  value={tempFilter?.type || ""} 
                  onValueChange={(value) => handleFilterChange("type", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部</SelectItem>
                    <SelectItem value={NotificationType.System}>{NotificationType.System}</SelectItem>
                    <SelectItem value={NotificationType.Order}>{NotificationType.Order}</SelectItem>
                    <SelectItem value={NotificationType.Task}>{NotificationType.Task}</SelectItem>
                    <SelectItem value={NotificationType.Alert}>{NotificationType.Alert}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">优先级</h4>
                <Select 
                  value={tempFilter?.priority || ""} 
                  onValueChange={(value) => handleFilterChange("priority", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部</SelectItem>
                    <SelectItem value={NotificationPriority.Low}>{NotificationPriority.Low}</SelectItem>
                    <SelectItem value={NotificationPriority.Medium}>{NotificationPriority.Medium}</SelectItem>
                    <SelectItem value={NotificationPriority.High}>{NotificationPriority.High}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">状态</h4>
                <Select 
                  value={tempFilter?.status || ""} 
                  onValueChange={(value) => handleFilterChange("status", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部</SelectItem>
                    <SelectItem value={NotificationStatus.Unread}>{NotificationStatus.Unread}</SelectItem>
                    <SelectItem value={NotificationStatus.Read}>{NotificationStatus.Read}</SelectItem>
                    <SelectItem value={NotificationStatus.Archived}>{NotificationStatus.Archived}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 flex items-end space-x-2">
                <Button className="bg-black hover:bg-gray-800" onClick={applyFilter}>应用筛选</Button>
                <Button variant="outline" onClick={resetFilter}>重置</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <TabsContent value={activeTab} className="mt-0">
          <div className="rounded-md border w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">标题</TableHead>
                  <TableHead>内容</TableHead>
                  <TableHead className="w-[100px]">类型</TableHead>
                  <TableHead className="w-[80px]">优先级</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[150px]">时间</TableHead>
                  <TableHead className="text-right w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      暂无通知
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => (
                    <TableRow 
                      key={notification.id}
                      className={notification.status === NotificationStatus.Unread ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {notificationTypeIcons[notification.type]}
                          <div className={priorityStyles[notification.priority]}>
                            {notification.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          {notification.content}
                        </div>
                      </TableCell>
                      <TableCell>{notification.type}</TableCell>
                      <TableCell>{notification.priority}</TableCell>
                      <TableCell>{statusBadges[notification.status]}</TableCell>
                      <TableCell>{formatTime(notification.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {notification.status === NotificationStatus.Unread && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleArchive(notification.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>每页显示</span>
              <Select 
                value={pageSize.toString()} 
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>条，共 {total} 条</span>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // 显示当前页附近的页码
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}