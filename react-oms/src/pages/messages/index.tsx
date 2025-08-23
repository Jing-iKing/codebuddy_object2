import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Mail,
  Bell,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zhCN } from "date-fns/locale"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

// 消息类型枚举
enum MessageType {
  System = "系统通知",
  Order = "订单消息",
  Logistics = "物流消息",
  Promotion = "促销消息",
  Alert = "预警消息"
}

// 消息状态枚举
enum MessageStatus {
  Unread = "未读",
  Read = "已读",
  Archived = "已归档"
}

// 消息优先级枚举
enum MessagePriority {
  Low = "低",
  Medium = "中",
  High = "高",
  Urgent = "紧急"
}

// 消息接口定义
interface Message {
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
const messageTypeConfig = {
  [MessageType.System]: {
    icon: <Info className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [MessageType.Order]: {
    icon: <FileText className="h-4 w-4" />,
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  [MessageType.Logistics]: {
    icon: <Send className="h-4 w-4" />,
    badgeClass: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  },
  [MessageType.Promotion]: {
    icon: <Bell className="h-4 w-4" />,
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  },
  [MessageType.Alert]: {
    icon: <AlertTriangle className="h-4 w-4" />,
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-200"
  }
}

// 消息状态图标和样式映射
const messageStatusConfig = {
  [MessageStatus.Unread]: {
    icon: <Mail className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [MessageStatus.Read]: {
    icon: <CheckCircle className="h-4 w-4" />,
    badgeClass: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  },
  [MessageStatus.Archived]: {
    icon: <XCircle className="h-4 w-4" />,
    badgeClass: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  }
}

// 消息优先级图标和样式映射
const messagePriorityConfig = {
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

// 生成大量模拟消息数据
const generateMockMessages = (count: number): Message[] => {
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
const mockMessages = generateMockMessages(300);

// 获取消息类型徽章
const getMessageTypeBadge = (type: MessageType) => {
  const { icon, badgeClass } = messageTypeConfig[type]
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{type}</span>
      </div>
    </Badge>
  )
}

// 获取消息状态徽章
const getMessageStatusBadge = (status: MessageStatus) => {
  const { icon, badgeClass } = messageStatusConfig[status]
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{status}</span>
      </div>
    </Badge>
  )
}

// 获取消息优先级徽章
const getMessagePriorityBadge = (priority: MessagePriority) => {
  const { badgeClass } = messagePriorityConfig[priority]
  
  return (
    <Badge className={badgeClass}>
      <span>{priority}</span>
    </Badge>
  )
}

export default function MessagesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [sendDate, setSendDate] = useState<Date | undefined>(new Date())
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    type: MessageType.System,
    priority: MessagePriority.Medium,
    sendTime: new Date(),
    sender: "系统管理员",
    recipients: [] as string[],
    relatedOrderId: ""
  })
  
  const itemsPerPage = 5

  // 过滤和分页逻辑
  const filteredMessages = mockMessages.filter(message => 
    message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.relatedOrderId && message.relatedOrderId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage)

  // 模拟用户列表
  const usersList = [
    "张三", "李四", "王五", "赵六", "钱七", "孙八", "所有用户", "所有会员用户"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMessage(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewMessage(prev => ({ ...prev, [name]: value }))
  }

  const handleRecipientChange = (checked: boolean, recipient: string) => {
    if (checked) {
      setSelectedRecipients(prev => [...prev, recipient])
      setNewMessage(prev => ({ ...prev, recipients: [...prev.recipients, recipient] }))
    } else {
      setSelectedRecipients(prev => prev.filter(r => r !== recipient))
      setNewMessage(prev => ({ ...prev, recipients: prev.recipients.filter(r => r !== recipient) }))
    }
  }

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新消息
    console.log("保存新消息:", newMessage)
    setIsDialogOpen(false)
    // 重置表单
    setNewMessage({
      title: "",
      content: "",
      type: MessageType.System,
      priority: MessagePriority.Medium,
      sendTime: new Date(),
      sender: "系统管理员",
      recipients: [],
      relatedOrderId: ""
    })
    setSelectedRecipients([])
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建消息
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新建消息</DialogTitle>
              <DialogDescription>
                创建一个新的消息。请填写以下信息，完成后点击发送。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  消息标题
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newMessage.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 系统维护通知"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">消息类型</Label>
                <Select 
                  value={newMessage.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择消息类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MessageType.System}>{MessageType.System}</SelectItem>
                    <SelectItem value={MessageType.Order}>{MessageType.Order}</SelectItem>
                    <SelectItem value={MessageType.Logistics}>{MessageType.Logistics}</SelectItem>
                    <SelectItem value={MessageType.Promotion}>{MessageType.Promotion}</SelectItem>
                    <SelectItem value={MessageType.Alert}>{MessageType.Alert}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">优先级</Label>
                <Select 
                  value={newMessage.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MessagePriority.Low}>{MessagePriority.Low}</SelectItem>
                    <SelectItem value={MessagePriority.Medium}>{MessagePriority.Medium}</SelectItem>
                    <SelectItem value={MessagePriority.High}>{MessagePriority.High}</SelectItem>
                    <SelectItem value={MessagePriority.Urgent}>{MessagePriority.Urgent}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">发送时间</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !sendDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {sendDate ? format(sendDate, "PPP HH:mm", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={sendDate}
                        onSelect={setSendDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">接收人</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  {usersList.map((user) => (
                    <div key={user} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`user-${user}`} 
                        checked={selectedRecipients.includes(user)}
                        onCheckedChange={(checked) => handleRecipientChange(checked as boolean, user)}
                      />
                      <Label htmlFor={`user-${user}`}>{user}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedOrderId" className="text-right">
                  关联订单号
                </Label>
                <Input
                  id="relatedOrderId"
                  name="relatedOrderId"
                  value={newMessage.relatedOrderId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: ORD-12345（可选）"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  消息内容
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={newMessage.content}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="请输入消息内容..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-black hover:bg-gray-800" onClick={handleSubmit}>
                发送
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索消息标题、内容或订单号..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="mb-4 text-sm font-medium">筛选条件</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>消息类型</Label>
                <Select defaultValue={MessageType.System}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择消息类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value={MessageType.System}>{MessageType.System}</SelectItem>
                    <SelectItem value={MessageType.Order}>{MessageType.Order}</SelectItem>
                    <SelectItem value={MessageType.Logistics}>{MessageType.Logistics}</SelectItem>
                    <SelectItem value={MessageType.Promotion}>{MessageType.Promotion}</SelectItem>
                    <SelectItem value={MessageType.Alert}>{MessageType.Alert}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>消息状态</Label>
                <Select defaultValue={MessageStatus.Unread}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择消息状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value={MessageStatus.Unread}>{MessageStatus.Unread}</SelectItem>
                    <SelectItem value={MessageStatus.Read}>{MessageStatus.Read}</SelectItem>
                    <SelectItem value={MessageStatus.Archived}>{MessageStatus.Archived}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>优先级</Label>
                <Select defaultValue={MessagePriority.Medium}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部优先级</SelectItem>
                    <SelectItem value={MessagePriority.Low}>{MessagePriority.Low}</SelectItem>
                    <SelectItem value={MessagePriority.Medium}>{MessagePriority.Medium}</SelectItem>
                    <SelectItem value={MessagePriority.High}>{MessagePriority.High}</SelectItem>
                    <SelectItem value={MessagePriority.Urgent}>{MessagePriority.Urgent}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">重置</Button>
              <Button className="bg-black hover:bg-gray-800">应用筛选</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="rounded-md border w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">消息标题</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>优先级</TableHead>
              <TableHead>发送人</TableHead>
              <TableHead>发送时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMessages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.title}</TableCell>
                <TableCell>{getMessageTypeBadge(message.type)}</TableCell>
                <TableCell>{getMessageStatusBadge(message.status)}</TableCell>
                <TableCell>{getMessagePriorityBadge(message.priority)}</TableCell>
                <TableCell>{message.sender}</TableCell>
                <TableCell>{format(message.sendTime, "yyyy-MM-dd HH:mm")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              
              if (pageNumber <= 0 || pageNumber > totalPages) return null;
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>消息详情</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedMessage.title}</h3>
                  <div className="flex items-center gap-2">
                    {getMessageTypeBadge(selectedMessage.type)}
                    {getMessageStatusBadge(selectedMessage.status)}
                    {getMessagePriorityBadge(selectedMessage.priority)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>发送人：{selectedMessage.sender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>接收人：{selectedMessage.recipients.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>发送时间：{selectedMessage.sendTime.toLocaleString()}</span>
                  </div>
                  {selectedMessage.relatedOrderId && (
                    <div className="flex items-center gap-1">
                      <span>关联订单：{selectedMessage.relatedOrderId}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-md border p-4 bg-gray-50">
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
