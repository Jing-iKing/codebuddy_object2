import { format } from "date-fns";
import { Message, MessageType, MessageStatus, MessagePriority } from "./message-types";

// 生成大量模拟消息数据
export const generateMockMessages = (count: number): Message[] => {
  const types = [MessageType.System, MessageType.Order, MessageType.Logistics, MessageType.Promotion, MessageType.Alert];
  const statuses = [MessageStatus.Unread, MessageStatus.Read, MessageStatus.Archived];
  const priorities = [MessagePriority.Low, MessagePriority.Medium, MessagePriority.High, MessagePriority.Urgent];
  const senders = ["系统管理员", "订单系统", "物流部门", "市场部", "系统安全团队"];
  const recipientGroups = [
    ["所有用户"], 
    ["张三"], 
    ["李四"], 
    ["王五", "赵六"], 
    ["钱七"], 
    ["孙八"], 
    ["所有会员用户"]
  ];
  
  const baseMessages = [
    {
      id: "MSG-001",
      title: "系统维护通知",
      content: "尊敬的用户，系统将于2025年8月25日凌晨2:00-4:00进行例行维护，期间系统将暂停服务。给您带来的不便，敬请谅解。",
      type: MessageType.System,
      status: MessageStatus.Unread,
      priority: MessagePriority.Medium,
      sendTime: new Date("2025-08-20T10:30:00"),
      sender: "系统管理员",
      recipients: ["所有用户"],
      relatedOrderId: null
    },
    {
      id: "MSG-002",
      title: "订单已发货通知",
      content: "您的订单 ORD-12345 已于2025年8月21日发货，预计3-5天送达。物流单号：SF1234567890，请注意查收。",
      type: MessageType.Order,
      status: MessageStatus.Read,
      priority: MessagePriority.Medium,
      sendTime: new Date("2025-08-21T14:15:00"),
      sender: "订单系统",
      recipients: ["张三"],
      relatedOrderId: "ORD-12345"
    },
    {
      id: "MSG-003",
      title: "物流延误预警",
      content: "由于天气原因，您的订单 ORD-23456 可能会有1-2天的延误，我们正在积极协调，给您带来的不便，敬请谅解。",
      type: MessageType.Logistics,
      status: MessageStatus.Unread,
      priority: MessagePriority.High,
      sendTime: new Date("2025-08-22T09:45:00"),
      sender: "物流部门",
      recipients: ["李四"],
      relatedOrderId: "ORD-23456"
    },
    {
      id: "MSG-004",
      title: "会员专享优惠活动",
      content: "尊敬的会员用户，8月25日-8月31日期间，所有订单享受9折优惠，优惠码：MEMBER25，欢迎选购。",
      type: MessageType.Promotion,
      status: MessageStatus.Unread,
      priority: MessagePriority.Low,
      sendTime: new Date("2025-08-22T16:30:00"),
      sender: "市场部",
      recipients: ["所有会员用户"],
      relatedOrderId: null
    },
    {
      id: "MSG-005",
      title: "订单异常预警",
      content: "订单 ORD-34567 在处理过程中出现异常，请相关人员尽快处理。",
      type: MessageType.Alert,
      status: MessageStatus.Read,
      priority: MessagePriority.Urgent,
      sendTime: new Date("2025-08-23T08:10:00"),
      sender: "订单系统",
      recipients: ["王五", "赵六"],
      relatedOrderId: "ORD-34567"
    },
    {
      id: "MSG-006",
      title: "新路线开通通知",
      content: "我们新增了上海至成都的物流路线，运输时间缩短至2天，欢迎选择使用。",
      type: MessageType.Logistics,
      status: MessageStatus.Archived,
      priority: MessagePriority.Medium,
      sendTime: new Date("2025-08-19T11:20:00"),
      sender: "物流部门",
      recipients: ["所有用户"],
      relatedOrderId: null
    },
    {
      id: "MSG-007",
      title: "账户安全提醒",
      content: "您的账户于2025年8月22日有异常登录尝试，请及时检查账户安全并修改密码。",
      type: MessageType.System,
      status: MessageStatus.Unread,
      priority: MessagePriority.High,
      sendTime: new Date("2025-08-22T20:05:00"),
      sender: "系统安全团队",
      recipients: ["钱七"],
      relatedOrderId: null
    },
    {
      id: "MSG-008",
      title: "订单已完成",
      content: "您的订单 ORD-45678 已于2025年8月20日完成交付，感谢您的使用，期待再次为您服务。",
      type: MessageType.Order,
      status: MessageStatus.Read,
      priority: MessagePriority.Low,
      sendTime: new Date("2025-08-20T15:40:00"),
      sender: "订单系统",
      recipients: ["孙八"],
      relatedOrderId: "ORD-45678"
    }
  ];
  
  // 如果请求的数量小于等于基础数据量，直接返回基础数据的子集
  if (count <= baseMessages.length) {
    return baseMessages.slice(0, count);
  }
  
  // 否则，生成更多随机数据
  const result = [...baseMessages];
  
  const messageTitles = {
    [MessageType.System]: [
      "系统版本更新通知",
      "账户安全检查提醒",
      "系统功能优化公告",
      "用户协议更新通知",
      "系统临时维护公告",
      "账户异常登录提醒",
      "系统安全升级通知",
      "数据备份完成通知"
    ],
    [MessageType.Order]: [
      "订单已确认通知",
      "订单已发货通知",
      "订单已签收通知",
      "订单已完成通知",
      "订单支付成功通知",
      "订单状态更新通知",
      "订单取消确认通知",
      "订单退款成功通知"
    ],
    [MessageType.Logistics]: [
      "物流状态更新通知",
      "物流延误预警",
      "物流路线变更通知",
      "物流配送安排通知",
      "物流签收确认通知",
      "新物流路线开通通知",
      "物流异常处理通知",
      "物流运费调整通知"
    ],
    [MessageType.Promotion]: [
      "限时促销活动通知",
      "会员专享优惠通知",
      "节日特惠活动预告",
      "新品上市促销通知",
      "积分兑换活动通知",
      "满减优惠活动通知",
      "折扣券发放通知",
      "会员等级升级优惠通知"
    ],
    [MessageType.Alert]: [
      "订单异常预警",
      "库存不足预警",
      "支付异常预警",
      "账户安全预警",
      "系统负载预警",
      "数据异常预警",
      "服务中断预警",
      "物流延迟严重预警"
    ]
  };
  
  for (let i = baseMessages.length; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const sender = senders[Math.floor(Math.random() * senders.length)];
    const recipients = recipientGroups[Math.floor(Math.random() * recipientGroups.length)];
    
    // 生成随机日期（过去30天内）
    const sendTime = new Date();
    sendTime.setDate(sendTime.getDate() - Math.floor(Math.random() * 30));
    sendTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    // 选择对应类型的随机标题
    const titleOptions = messageTitles[type];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    
    // 生成随机订单ID（只有订单和物流类型的消息有关联订单）
    let relatedOrderId = null;
    if (type === MessageType.Order || type === MessageType.Logistics || (type === MessageType.Alert && Math.random() > 0.5)) {
      relatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    }
    
    // 生成随机内容
    let content = "";
    switch (type) {
      case MessageType.System:
        content = `尊敬的用户，${title.replace("通知", "").replace("提醒", "")}将于${format(sendTime, "yyyy年MM月dd日")}进行，请您知悉。如有疑问，请联系系统管理员。`;
        break;
      case MessageType.Order:
        content = `您的订单 ${relatedOrderId} ${title.includes("发货") ? "已于" + format(sendTime, "yyyy年MM月dd日") + "发货，预计3-5天送达。物流单号：SF" + Math.floor(1000000000 + Math.random() * 9000000000) : "状态已更新，请查看详情"}。`;
        break;
      case MessageType.Logistics:
        content = `关于订单 ${relatedOrderId} 的物流信息：${title.includes("延误") ? "由于天气原因，可能会有1-2天的延误，我们正在积极协调" : "物流状态已更新，请查看详情"}。`;
        break;
      case MessageType.Promotion:
        content = `尊敬的${recipients.includes("会员") ? "会员用户" : "用户"}，${format(sendTime, "MM月dd日")}-${format(new Date(sendTime.getTime() + 7 * 24 * 60 * 60 * 1000), "MM月dd日")}期间，${title.replace("通知", "").replace("预告", "")}，欢迎选购。`;
        break;
      case MessageType.Alert:
        content = `系统检测到${title.replace("预警", "")}情况，请相关人员尽快处理。${relatedOrderId ? `相关订单：${relatedOrderId}` : ""}`;
        break;
    }
    
    result.push({
      id: `MSG-${String(i + 1).padStart(3, '0')}`,
      title,
      content,
      type,
      status,
      priority,
      sendTime,
      sender,
      recipients,
      relatedOrderId
    });
  }
  
  return result;
};

// 生成300条模拟数据
export const mockMessages = generateMockMessages(300);