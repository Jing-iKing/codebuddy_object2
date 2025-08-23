import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  FileText, 
  Send, 
  Bell, 
  AlertTriangle,
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  Message, 
  MessageType, 
  MessageStatus, 
  MessagePriority,
  messageTypeConfig,
  messageStatusConfig,
  messagePriorityConfig
} from "./message-types";

// 获取消息类型徽章
export const getMessageTypeBadge = (type: MessageType) => {
  const { badgeClass } = messageTypeConfig[type];
  let icon;
  
  switch(messageTypeConfig[type].icon) {
    case "Info":
      icon = <Info className="h-4 w-4" />;
      break;
    case "FileText":
      icon = <FileText className="h-4 w-4" />;
      break;
    case "Send":
      icon = <Send className="h-4 w-4" />;
      break;
    case "Bell":
      icon = <Bell className="h-4 w-4" />;
      break;
    case "AlertTriangle":
      icon = <AlertTriangle className="h-4 w-4" />;
      break;
    default:
      icon = <Info className="h-4 w-4" />;
  }
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{type}</span>
      </div>
    </Badge>
  );
};

// 获取消息状态徽章
export const getMessageStatusBadge = (status: MessageStatus) => {
  const { badgeClass } = messageStatusConfig[status];
  let icon;
  
  switch(messageStatusConfig[status].icon) {
    case "Mail":
      icon = <Mail className="h-4 w-4" />;
      break;
    case "CheckCircle":
      icon = <CheckCircle className="h-4 w-4" />;
      break;
    case "XCircle":
      icon = <XCircle className="h-4 w-4" />;
      break;
    default:
      icon = <Mail className="h-4 w-4" />;
  }
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{status}</span>
      </div>
    </Badge>
  );
};

// 获取消息优先级徽章
export const getMessagePriorityBadge = (priority: MessagePriority) => {
  const { badgeClass } = messagePriorityConfig[priority];
  
  return (
    <Badge className={badgeClass}>
      <span>{priority}</span>
    </Badge>
  );
};

// 消息详情组件
export const MessageDetail: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{message.title}</h3>
          <div className="flex items-center gap-2">
            {getMessageTypeBadge(message.type)}
            {getMessageStatusBadge(message.status)}
            {getMessagePriorityBadge(message.priority)}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>发送人：{message.sender}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>接收人：{message.recipients.join(", ")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>发送时间：{message.sendTime.toLocaleString()}</span>
          </div>
          {message.relatedOrderId && (
            <div className="flex items-center gap-1">
              <span>关联订单：{message.relatedOrderId}</span>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-md border p-4 bg-gray-50">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};