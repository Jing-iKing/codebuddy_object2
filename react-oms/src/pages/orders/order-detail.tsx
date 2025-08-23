import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Clock, 
  Package, 
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CircleDashed
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 模拟订单数据
const orderData = {
  id: "ORD-001",
  productName: "电子元件",
  externalOrderId: "EXT-12345",
  weight: "5.2kg",
  length: "30cm",
  width: "20cm",
  height: "15cm",
  quantity: 10,
  arrivalDate: "2025-08-15",
  customer: "上海电子有限公司",
  customerContact: "张经理 (13800138000)",
  strategy: "标准配送",
  recipientName: "张三",
  recipientAddress: "上海市浦东新区张江高科技园区",
  recipientPhone: "13800138000",
  status: "已完成",
  createdAt: "2025-08-10 09:15:23",
  updatedAt: "2025-08-15 14:30:45",
  trackingNumber: "SF1234567890",
  paymentStatus: "已支付",
  paymentAmount: "¥350.00",
  notes: "客户要求在工作日送达，需要提前电话联系",
  history: [
    { time: "2025-08-10 09:15:23", status: "订单创建", operator: "系统", note: "客户通过系统创建订单" },
    { time: "2025-08-10 10:30:45", status: "订单确认", operator: "李客服", note: "电话确认订单信息" },
    { time: "2025-08-12 08:45:12", status: "开始处理", operator: "王仓管", note: "订单进入处理流程" },
    { time: "2025-08-13 14:20:36", status: "打包完成", operator: "赵包装", note: "货物已完成包装" },
    { time: "2025-08-14 09:05:28", status: "开始配送", operator: "钱配送", note: "货物已出库，开始配送" },
    { time: "2025-08-15 14:30:45", status: "配送完成", operator: "孙快递", note: "客户已签收" }
  ],
  documents: [
    { name: "订单确认单", type: "PDF", size: "1.2MB", date: "2025-08-10" },
    { name: "发货单", type: "PDF", size: "0.8MB", date: "2025-08-14" },
    { name: "签收单", type: "JPG", size: "2.5MB", date: "2025-08-15" }
  ]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case '已完成':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case '处理中':
      return <CircleDashed className="h-5 w-5 text-blue-500" />
    case '待处理':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case '已取消':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <CircleDashed className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case '已完成':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>
    case '处理中':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>
    case '待处理':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>
    case '已取消':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>
  }
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [currentStatus, setCurrentStatus] = useState(orderData.status)
  
  // 在实际应用中，这里会根据id从API获取订单数据
  const order = orderData

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">订单详情 #{order.id}</h1>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            打印
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button className="bg-black hover:bg-gray-800">编辑订单</Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>订单信息</CardTitle>
            <CardDescription>订单的基本信息和配送详情</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">基本信息</TabsTrigger>
                <TabsTrigger value="tracking">物流跟踪</TabsTrigger>
                <TabsTrigger value="documents">相关文档</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-semibold">货物信息</h3>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">品名</span>
                        <span>{order.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">外部单号</span>
                        <span>{order.externalOrderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">重量</span>
                        <span>{order.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">尺寸</span>
                        <span>{order.length} × {order.width} × {order.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">件数</span>
                        <span>{order.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">到仓日期</span>
                        <span>{order.arrivalDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-2 font-semibold">客户信息</h3>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">客户名称</span>
                        <span>{order.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">联系方式</span>
                        <span>{order.customerContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">配送策略</span>
                        <span>{order.strategy}</span>
                      </div>
                    </div>
                    
                    <h3 className="mb-2 mt-4 font-semibold">收件人信息</h3>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">收件人</span>
                        <span>{order.recipientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">联系电话</span>
                        <span>{order.recipientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">收货地址</span>
                        <span>{order.recipientAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="mb-2 font-semibold">备注信息</h3>
                    <div className="rounded-md border p-3">
                      <p>{order.notes}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tracking">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">物流单号</p>
                        <p className="text-sm text-gray-500">{order.trackingNumber}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">复制单号</Button>
                  </div>
                  
                  <div className="relative ml-2 space-y-0">
                    {order.history.map((event, index) => (
                      <div key={index} className="relative pb-8">
                        {index < order.history.length - 1 && (
                          <div className="absolute left-[7px] top-[14px] h-full w-[1px] bg-gray-200"></div>
                        )}
                        <div className="flex gap-3">
                          <div className="mt-1 h-3 w-3 rounded-full bg-black"></div>
                          <div className="space-y-1">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-gray-500">{event.time}</p>
                            <p className="text-sm">操作人: {event.operator}</p>
                            <p className="text-sm text-gray-600">{event.note}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="space-y-3">
                  {order.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} · {doc.size} · {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        下载
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>订单状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium">{order.status}</p>
                  <p className="text-sm text-gray-500">最后更新: {order.updatedAt}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">更新状态</label>
                  <Select defaultValue={currentStatus} onValueChange={setCurrentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="待处理">待处理</SelectItem>
                      <SelectItem value="处理中">处理中</SelectItem>
                      <SelectItem value="已完成">已完成</SelectItem>
                      <SelectItem value="已取消">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-black hover:bg-gray-800">更新状态</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>支付信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">支付状态</span>
                  <Badge variant={order.paymentStatus === "已支付" ? "outline" : "destructive"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">支付金额</span>
                  <span className="font-medium">{order.paymentAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>订单时间线</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              <div className="space-y-3">
                {order.history.map((event, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.status}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}