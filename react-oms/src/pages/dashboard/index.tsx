import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { ArrowUpRight, Package, Truck, Users, Clock } from "lucide-react"

// 模拟数据
const orderTrendData = [
  { name: '1月', 订单量: 400 },
  { name: '2月', 订单量: 300 },
  { name: '3月', 订单量: 600 },
  { name: '4月', 订单量: 800 },
  { name: '5月', 订单量: 500 },
  { name: '6月', 订单量: 900 },
  { name: '7月', 订单量: 1000 },
]

const orderStatusData = [
  { name: '待处理', value: 400, color: '#FF9800' },
  { name: '处理中', value: 300, color: '#2196F3' },
  { name: '已完成', value: 800, color: '#4CAF50' },
  { name: '已取消', value: 100, color: '#F44336' },
]

const recentOrders = [
  { id: 'ORD-001', customer: '上海电子有限公司', amount: '¥2,300', status: '已完成', date: '2025-08-20' },
  { id: 'ORD-002', customer: '北京科技集团', amount: '¥1,500', status: '处理中', date: '2025-08-21' },
  { id: 'ORD-003', customer: '广州贸易有限公司', amount: '¥3,200', status: '待处理', date: '2025-08-22' },
  { id: 'ORD-004', customer: '深圳电子科技', amount: '¥800', status: '已取消', date: '2025-08-22' },
  { id: 'ORD-005', customer: '杭州网络科技', amount: '¥4,500', status: '已完成', date: '2025-08-23' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '已完成':
      return 'bg-green-100 text-green-800'
    case '处理中':
      return 'bg-blue-100 text-blue-800'
    case '待处理':
      return 'bg-yellow-100 text-yellow-800'
    case '已取消':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
      
      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总订单数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +18% <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
              <span className="ml-1">较上月</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃客户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +5% <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
              <span className="ml-1">较上月</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运输中</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-500 flex items-center">
                -2% <ArrowUpRight className="ml-1 h-3 w-3 rotate-90" />
              </span>
              <span className="ml-1">较上周</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均处理时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 天</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12% <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
              <span className="ml-1">效率提升</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>订单趋势</CardTitle>
            <CardDescription>
              近7个月订单量变化趋势
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Tabs defaultValue="line" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="line">折线图</TabsTrigger>
                <TabsTrigger value="bar">柱状图</TabsTrigger>
              </TabsList>
              <TabsContent value="line" className="w-full">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={orderTrendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="订单量"
                      stroke="#1976D2"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="bar" className="w-full">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={orderTrendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="订单量" fill="#1976D2" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>订单状态分布</CardTitle>
            <CardDescription>
              当前订单状态占比
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 最近订单 */}
      <Card>
        <CardHeader>
          <CardTitle>最近订单</CardTitle>
          <CardDescription>
            最近处理的5个订单
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left font-medium">订单号</th>
                  <th className="py-3 px-4 text-left font-medium">客户</th>
                  <th className="py-3 px-4 text-left font-medium">金额</th>
                  <th className="py-3 px-4 text-left font-medium">状态</th>
                  <th className="py-3 px-4 text-left font-medium">日期</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}