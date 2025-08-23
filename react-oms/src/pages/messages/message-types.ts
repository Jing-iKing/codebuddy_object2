// 消息类型枚举
export enum MessageType {
  System = "系统通知",
  Order = "订单消息",
  Logistics = "物流消息",
  Promotion = "促销消息",
  Alert = "预警消息"
}

// 消息状态枚举
export enum MessageStatus {
  Unread = "未读",
  Read = "已读",
  Archived = "已归档"
}

// 消息优先级枚举
export enum MessagePriority {
  Low = "低",
  Medium = "中",
  High = "高",
  Urgent = "紧急"
}

// 消息接口定义
export interface Message {
  id: string;
  title: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  priority: MessagePriority;
  sendTime: Date;
  sender: string;
  recipients: string[];
  relatedOrderId: string | null;
}

// 消息类型图标和样式映射
export const messageTypeConfig = {
  [MessageType.System]: {
    icon: "Info",
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [MessageType.Order]: {
    icon: "FileText",
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  [MessageType.Logistics]: {
    icon: "Send",
    badgeClass: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  },
  [MessageType.Promotion]: {
    icon: "Bell",
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  },
  [MessageType.Alert]: {
    icon: "AlertTriangle",
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-200"
  }
}

// 消息状态图标和样式映射
export const messageStatusConfig = {
  [MessageStatus.Unread]: {
    icon: "Mail",
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [MessageStatus.Read]: {
    icon: "CheckCircle",
    badgeClass: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  },
  [MessageStatus.Archived]: {
    icon: "XCircle",
    badgeClass: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  }
}

// 消息优先级图标和样式映射
export const messagePriorityConfig = {
  [MessagePriority.Low]: {
    badgeClass: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  },
  [MessagePriority.Medium]: {
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [MessagePriority.High]: {
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  },
  [MessagePriority.Urgent]: {
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-200"
  }
}