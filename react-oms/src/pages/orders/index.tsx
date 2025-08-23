import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download
} from "lucide-react"
import { ExportImportButtons } from "@/components/data/export-import-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
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

// 订单类型定义
interface Order {
  id: string;
  productName: string;
  externalOrderId: string;
  weight: string;
  dimensions: string;
  quantity: number;
  arrivalDate: string;
  customer: string;
  strategy: string;
  recipientInfo: string;
  status: string;
}

// 生成大量模拟订单数据
const generateMockOrders = (count: number): Order[] => {
  const statuses = ['已完成', '处理中', '待处理', '已取消'];
  const strategies = ['标准配送', '加急配送', '经济配送', '冷链配送', '大件配送'];
  const customers = [
    '上海电子有限公司', '北京科技集团', '广州贸易有限公司', 
    '深圳电子科技', '杭州网络科技', '成都信息技术',
    '武汉医疗设备', '南京美容用品', '天津物流集团',
    '重庆食品有限公司', '西安科技有限公司', '青岛海洋科技'
  ];
  const products = [
    '电子元件', '办公用品', '服装', '食品', '电器', '图书',
    '医疗器械', '化妆品', '玩具', '家具', '体育用品', '汽车配件'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const weight = (Math.random() * 20 + 0.5).toFixed(1);
    const width = Math.floor(Math.random() * 50 + 10);
    const height = Math.floor(Math.random() * 40 + 10);
    const depth = Math.floor(Math.random() * 30 + 5);
    
    return {
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      productName: products[Math.floor(Math.random() * products.length)],
      externalOrderId: `EXT-${Math.floor(Math.random() * 90000) + 10000}`,
      weight: `${weight}kg`,
      dimensions: `${width}×${height}×${depth}cm`,
      quantity: Math.floor(Math.random() * 30) + 1,
      arrivalDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      recipientInfo: '收件人信息',
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

// 生成1000条模拟数据
const mockOrders = generateMockOrders(1000);

// 获取状态徽章
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

// 模拟API请求函数
const fetchOrders = async (page: number, pageSize: number) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockOrders.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: mockOrders.length
  };
};

export default function OrdersPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // 搜索状态
  const [searchTerm, setSearchTerm] = useState("");
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 过滤和分页逻辑
  const filteredOrders = mockOrders.filter(order => 
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.externalOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" />
          新建订单
        </Button>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索订单..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="mr-2 h-4 w-4" />
              筛选
              {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <ExportImportButtons 
              data={filteredOrders}
              exportFileName="订单数据"
              exportPermission="data:export"
              importPermission="data:import"
              module="orders"
              onImport={(importedData) => {
                console.log('导入的订单数据:', importedData)
                // 在实际应用中，这里会调用 dispatch 来处理导入的数据
                // 例如: dispatch(importOrders(importedData))
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  批量操作
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>批量更新状态</DropdownMenuItem>
                <DropdownMenuItem>批量分配</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">批量删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
          <CollapsibleContent>
            <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">订单状态</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">客户</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="shanghai">上海电子有限公司</SelectItem>
                    <SelectItem value="beijing">北京科技集团</SelectItem>
                    <SelectItem value="guangzhou">广州贸易有限公司</SelectItem>
                    <SelectItem value="shenzhen">深圳电子科技</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">配送策略</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="standard">标准配送</SelectItem>
                    <SelectItem value="express">加急配送</SelectItem>
                    <SelectItem value="economy">经济配送</SelectItem>
                    <SelectItem value="cold">冷链配送</SelectItem>
                    <SelectItem value="large">大件配送</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">到仓日期</h4>
                <div className="flex items-center space-x-2">
                  <Input type="date" className="w-full" />
                  <span>至</span>
                  <Input type="date" className="w-full" />
                </div>
              </div>
              <div className="md:col-span-2 flex items-end space-x-2">
                <Button className="bg-black hover:bg-gray-800">应用筛选</Button>
                <Button variant="outline">重置</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="rounded-md border w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">订单信息</TableHead>
                <TableHead>外部单号</TableHead>
                <TableHead>重量/尺寸</TableHead>
                <TableHead>件数</TableHead>
                <TableHead>到仓日期</TableHead>
                <TableHead>开单客户</TableHead>
                <TableHead>配送策略</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{order.productName}</div>
                        <div className="text-xs text-gray-500">{order.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.externalOrderId}</TableCell>
                  <TableCell>
                    <div>
                      {order.weight}<br />
                      <span className="text-xs text-gray-500">{order.dimensions}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{order.quantity}</TableCell>
                  <TableCell>{order.arrivalDate}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.strategy}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}