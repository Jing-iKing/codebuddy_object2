import { useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { fetchUnreadCount } from "@/store/slices/notification-slice";
import { NotificationList } from "./notification-list";

interface NotificationIconProps {
  className?: string;
}

export function NotificationIcon({ className }: NotificationIconProps) {
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  // 组件挂载时获取未读通知数量
  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    // 设置定时器，每分钟更新一次未读通知数量
    const intervalId = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList maxItems={5} showViewAll />
      </PopoverContent>
    </Popover>
  );
}