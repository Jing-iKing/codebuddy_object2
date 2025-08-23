// 通知类型定义

// 通知优先级
export enum NotificationPriority {
  Low = "低",
  Medium = "中",
  High = "高"
}

// 通知类型
export enum NotificationType {
  System = "系统通知",
  Order = "订单通知",
  Task = "任务通知",
  Alert = "警报通知"
}

// 通知状态
export enum NotificationStatus {
  Unread = "未读",
  Read = "已读",
  Archived = "已归档"
}

// 通知接口
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  targetUrl?: string; // 点击通知后跳转的目标URL
  sender?: string; // 发送者信息
  recipient: string; // 接收者ID
}

// 通知过滤选项
export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  startDate?: Date;
  endDate?: Date;
}

// 通知分页请求参数
export interface NotificationParams {
  page: number;
  limit: number;
  filter?: NotificationFilter;
}

// 通知分页响应
export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}