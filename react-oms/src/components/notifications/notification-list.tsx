import { useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Bell, Check, ChevronRight, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  archiveNotification,
  deleteNotification
} from "@/store/slices/notification-slice";
import { 
  NotificationPriority, 
  NotificationType 
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

interface NotificationListProps {
  maxItems?: number;
  showViewAll?: boolean;
}

export function NotificationList({ maxItems = 10, showViewAll = false }: NotificationListProps) {
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount } = useAppSelector((state) => state.notifications);

  // 组件挂载时获取通知列表
  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: maxItems }));
  }, [dispatch, maxItems]);

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

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(new Date(date), "HH:mm", { locale: zhCN });
    } else if (diffInHours < 48) {
      return "昨天";
    } else {
      return format(new Date(date), "MM-dd", { locale: zhCN });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <h3 className="font-medium">通知</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="text-xs h-7"
          >
            <Check className="mr-1 h-3 w-3" />
            全部标为已读
          </Button>
        )}
      </div>
      <Separator />
      
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Bell className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">暂无通知</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[300px]">
          {notifications.map((notification) => (
            <div key={notification.id} className="relative">
              <Link
                to={notification.targetUrl || "/notifications"}
                className={`flex items-start p-3 hover:bg-gray-50 ${
                  notification.status === "未读" ? "bg-blue-50" : ""
                }`}
                onClick={() => notification.status === "未读" && handleMarkAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {notificationTypeIcons[notification.type]}
                </div>
                <div className="flex-grow min-w-0">
                  <div className={`text-sm ${priorityStyles[notification.priority]}`}>
                    {notification.title}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {notification.content}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="absolute right-2 top-2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleArchive(notification.id)}
                >
                  <Archive className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      )}
      
      {showViewAll && (
        <div className="p-2">
          <Link to="/notifications" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              查看全部
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}