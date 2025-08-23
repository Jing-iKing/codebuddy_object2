import { 
  Notification, 
  NotificationFilter, 
  NotificationParams, 
  NotificationResponse, 
  NotificationPriority, 
  NotificationType, 
  NotificationStatus 
} from "@/types/notification";
import { apiClient } from "./api-client";

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    title: "系统更新通知",
    content: "系统将于今晚22:00-23:00进行例行维护，期间可能无法访问。",
    type: NotificationType.System,
    priority: NotificationPriority.High,
    status: NotificationStatus.Unread,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    recipient: "all"
  },
  {
    id: "NOTIF-002",
    title: "新订单提醒",
    content: "您有一个新的订单(#ORD-20250823-001)需要处理。",
    type: NotificationType.Order,
    priority: NotificationPriority.Medium,
    status: NotificationStatus.Unread,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    targetUrl: "/orders/ORD-20250823-001",
    recipient: "admin"
  },
  {
    id: "NOTIF-003",
    title: "任务分配",
    content: "您被分配了一个新的配送任务，请查看详情。",
    type: NotificationType.Task,
    priority: NotificationPriority.Medium,
    status: NotificationStatus.Read,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5小时前
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小时前
    targetUrl: "/tasks/TASK-001",
    recipient: "admin"
  },
  {
    id: "NOTIF-004",
    title: "库存警报",
    content: "仓库A的商品SKU-12345库存低于安全库存，请及时补货。",
    type: NotificationType.Alert,
    priority: NotificationPriority.High,
    status: NotificationStatus.Read,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23小时前
    targetUrl: "/inventory/SKU-12345",
    recipient: "admin"
  },
  {
    id: "NOTIF-005",
    title: "订单状态更新",
    content: "订单 #ORD-20250822-005 已完成配送。",
    type: NotificationType.Order,
    priority: NotificationPriority.Low,
    status: NotificationStatus.Unread,
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45分钟前
    targetUrl: "/orders/ORD-20250822-005",
    recipient: "admin"
  },
  {
    id: "NOTIF-006",
    title: "系统公告",
    content: "我们将在下周发布新版本，带来更多功能和优化。",
    type: NotificationType.System,
    priority: NotificationPriority.Low,
    status: NotificationStatus.Unread,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8小时前
    recipient: "all"
  },
  {
    id: "NOTIF-007",
    title: "客户反馈提醒",
    content: "客户 张三 提交了一条新的反馈，请及时查看。",
    type: NotificationType.Alert,
    priority: NotificationPriority.Medium,
    status: NotificationStatus.Unread,
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2小时前
    targetUrl: "/feedback/FB-001",
    recipient: "admin"
  },
  {
    id: "NOTIF-008",
    title: "车辆维护提醒",
    content: "车辆 沪A12345 需要进行定期维护，请安排时间。",
    type: NotificationType.Task,
    priority: NotificationPriority.Medium,
    status: NotificationStatus.Archived,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2天前
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47小时前
    targetUrl: "/vehicles/VEH-001",
    recipient: "admin"
  }
];

// 通知服务
class NotificationService {
  // 获取通知列表
  async getNotifications(params: NotificationParams): Promise<NotificationResponse> {
    try {
      // 在实际应用中，这里会调用API
      // const response = await apiClient.get('/notifications', { params });
      // return response.data;

      // 模拟API调用
      const { page, limit, filter } = params;
      let filtered = [...mockNotifications];

      // 应用过滤条件
      if (filter) {
        if (filter.type) {
          filtered = filtered.filter(n => n.type === filter.type);
        }
        if (filter.priority) {
          filtered = filtered.filter(n => n.priority === filter.priority);
        }
        if (filter.status) {
          filtered = filtered.filter(n => n.status === filter.status);
        }
        if (filter.startDate) {
          filtered = filtered.filter(n => n.createdAt >= filter.startDate);
        }
        if (filter.endDate) {
          filtered = filtered.filter(n => n.createdAt <= filter.endDate);
        }
      }

      // 计算分页
      const total = filtered.length;
      const unreadCount = filtered.filter(n => n.status === NotificationStatus.Unread).length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const notifications = filtered.slice(start, end);

      return {
        notifications,
        total,
        unreadCount
      };
    } catch (error) {
      console.error('获取通知失败:', error);
      throw error;
    }
  }

  // 获取未读通知数量
  async getUnreadCount(): Promise<number> {
    try {
      // 在实际应用中，这里会调用API
      // const response = await apiClient.get('/notifications/unread/count');
      // return response.data.count;

      // 模拟API调用
      return mockNotifications.filter(n => n.status === NotificationStatus.Unread).length;
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      throw error;
    }
  }

  // 标记通知为已读
  async markAsRead(id: string): Promise<void> {
    try {
      // 在实际应用中，这里会调用API
      // await apiClient.put(`/notifications/${id}/read`);

      // 模拟API调用
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.status = NotificationStatus.Read;
        notification.readAt = new Date();
      }
    } catch (error) {
      console.error('标记通知为已读失败:', error);
      throw error;
    }
  }

  // 标记所有通知为已读
  async markAllAsRead(): Promise<void> {
    try {
      // 在实际应用中，这里会调用API
      // await apiClient.put('/notifications/read-all');

      // 模拟API调用
      mockNotifications.forEach(notification => {
        if (notification.status === NotificationStatus.Unread) {
          notification.status = NotificationStatus.Read;
          notification.readAt = new Date();
        }
      });
    } catch (error) {
      console.error('标记所有通知为已读失败:', error);
      throw error;
    }
  }

  // 归档通知
  async archiveNotification(id: string): Promise<void> {
    try {
      // 在实际应用中，这里会调用API
      // await apiClient.put(`/notifications/${id}/archive`);

      // 模拟API调用
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.status = NotificationStatus.Archived;
      }
    } catch (error) {
      console.error('归档通知失败:', error);
      throw error;
    }
  }

  // 删除通知
  async deleteNotification(id: string): Promise<void> {
    try {
      // 在实际应用中，这里会调用API
      // await apiClient.delete(`/notifications/${id}`);

      // 模拟API调用
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
      }
    } catch (error) {
      console.error('删除通知失败:', error);
      throw error;
    }
  }

  // 创建新通知（仅用于测试）
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    try {
      // 在实际应用中，这里会调用API
      // const response = await apiClient.post('/notifications', notification);
      // return response.data;

      // 模拟API调用
      const newNotification: Notification = {
        ...notification,
        id: `NOTIF-${String(mockNotifications.length + 1).padStart(3, '0')}`,
        createdAt: new Date()
      };
      mockNotifications.unshift(newNotification);
      return newNotification;
    } catch (error) {
      console.error('创建通知失败:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();