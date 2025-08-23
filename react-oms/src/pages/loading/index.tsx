import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Truck,
  Package,
  Calendar,
  Clock,
  User,
  FileText,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
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
import { Progress } from "@/components/ui/progress"

// 装载状态枚举
enum LoadingStatus {
  Pending = "待装载",
  InProgress = "装载中",
  Completed = "已完成",
  Cancelled = "已取消"
}

// 装载状态图标和样式映射
const loadingStatusConfig = {
  [LoadingStatus.Pending]: {
    icon: <AlertCircle className="h-4 w-4" />,
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  },
  [LoadingStatus.InProgress]: {
    icon: <Clock className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [LoadingStatus.Completed]: {
    icon: <CheckCircle className="h-4 w-4" />,
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  [LoadingStatus.Cancelled]: {
    icon: <XCircle className="h-4 w-4" />,
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-200"
  }
}

// 模拟装载数据
const loadingData = [
  {
    id: "LOAD-001",
    loadingNumber: "LD20250823001",
    vehicleInfo: {
      plateNumber: "沪A12345",
      type: "厢式货车",
      capacity: "5吨"
    },
    driver: "张师傅",
    driverPhone: "13812345678",
    loadingTime: new Date("2025-08-23T08:30:00"),
    estimatedCompletionTime: new Date("2025-08-23T10:30:00"),
    status: LoadingStatus.Completed,
    packageCount: 28,
    completedPackageCount: 28,
    destination: "上海市浦东新区张江高科技园区",
    notes: "优先配送电子产品"
  },
  {
    id: "LOAD-002",
    loadingNumber: "LD20250823002",
    vehicleInfo: {
      plateNumber: "沪B67890",
      type: "冷藏车",
      capacity: "3吨"
    },
    driver: "李师傅",
    driverPhone: "13987654321",
    loadingTime: new Date("2025-08-23T09:15:00"),
    estimatedCompletionTime: new Date("2025-08-23T11:15:00"),
    status: LoadingStatus.InProgress,
    packageCount: 15,
    completedPackageCount: 8,
    destination: "上海市黄浦区南京东路",
    notes: "食品类需保持低温"
  },
  {
    id: "LOAD-003",
    loadingNumber: "LD20250823003",
    vehicleInfo: {
      plateNumber: "沪C54321",
      type: "平板货车",
      capacity: "10吨"
    },
    driver: "王师傅",
    driverPhone: "13567891234",
    loadingTime: new Date("2025-08-23T10:00:00"),
    estimatedCompletionTime: new Date("2025-08-23T13:00:00"),
    status: LoadingStatus.Pending,
    packageCount: 42,
    completedPackageCount: 0,
    destination: "上海市松江区佘山镇",
    notes: "大型设备需要吊装"
  },
  {
    id: "LOAD-004",
    loadingNumber: "LD20250823004",
    vehicleInfo: {
      plateNumber: "沪D98765",
      type: "厢式货车",
      capacity: "8吨"
    },
    driver: "赵师傅",
    driverPhone: "13678901234",
    loadingTime: new Date("2025-08-23T11:30:00"),
    estimatedCompletionTime: new Date("2025-08-23T14:30:00"),
    status: LoadingStatus.Pending,
    packageCount: 35,
    completedPackageCount: 0,
    destination: "上海市嘉定区安亭镇",
    notes: "汽车零部件，小心轻放"
  },
  {
    id: "LOAD-005",
    loadingNumber: "LD20250823005",
    vehicleInfo: {
      plateNumber: "沪E24680",
      type: "厢式货车",
      capacity: "5吨"
    },
    driver: "钱师傅",
    driverPhone: "13456789012",
    loadingTime: new Date("2025-08-23T13:00:00"),
    estimatedCompletionTime: new Date("2025-08-23T15:00:00"),
    status: LoadingStatus.Cancelled,
    packageCount: 20,
    completedPackageCount: 0,
    destination: "上海市青浦区朱家角镇",
    notes: "客户临时取消订单"
  },
  {
    id: "LOAD-006",
    loadingNumber: "LD20250823006",
    vehicleInfo: {
      plateNumber: "沪F13579",
      type: "冷藏车",
      capacity: "4吨"
    },
    driver: "孙师傅",
    driverPhone: "13345678901",
    loadingTime: new Date("2025-08-23T14:15:00"),
    estimatedCompletionTime: new Date("2025-08-23T16:15:00"),
    status: LoadingStatus.Pending,
    packageCount: 18,
    completedPackageCount: 0,
    destination: "上海市宝山区顾村镇",
    notes: "医药产品，需保持恒温"
  },
  {
    id: "LOAD-007",
    loadingNumber: "LD20250823007",
    vehicleInfo: {
      plateNumber: "沪G24680",
      type: "厢式货车",
      capacity: "6吨"
    },
    driver: "周师傅",
    driverPhone: "13234567890",
    loadingTime: new Date("2025-08-23T15:30:00"),
    estimatedCompletionTime: new Date("2025-08-23T17:30:00"),
    status: LoadingStatus.Pending,
    packageCount: 25,
    completedPackageCount: 0,
    destination: "上海市闵行区莘庄镇",
    notes: "电器产品，防潮防震"
  },
  {
    id: "LOAD-008",
    loadingNumber: "LD20250823008",
    vehicleInfo: {
      plateNumber: "沪H13579",
      type: "平板货车",
      capacity: "12吨"
    },
    driver: "吴师傅",
    driverPhone: "13123456789",
    loadingTime: new Date("2025-08-23T16:00:00"),
    estimatedCompletionTime: new Date("2025-08-23T19:00:00"),
    status: LoadingStatus.Pending,
    packageCount: 50,
    completedPackageCount: 0,
    destination: "上海市奉贤区南桥镇",
    notes: "建材类产品，注意堆放顺序"
  }
]

// 获取装载状态徽章
const getLoadingStatusBadge = (status: LoadingStatus) => {
  const { icon, badgeClass } = loadingStatusConfig[status]
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{status}</span>
      </div>
    </Badge>
  )
}

// 获取装载进度
const getLoadingProgress = (completedCount: number, totalCount: number) => {
  if (totalCount === 0) return 0
  return Math.round((completedCount / totalCount) * 100)
}

export default function LoadingPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [newLoading, setNewLoading] = useState({
    loadingNumber: `LD${format(new Date(), "yyyyMMdd")}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    vehicleInfo: {
      plateNumber: "",
      type: "",
      capacity: ""
    },
    driver: "",
    driverPhone: "",
    loadingTime: new Date(),
    estimatedCompletionTime: new Date(),
    status: LoadingStatus.Pending,
    packageCount: 0,
    completedPackageCount: 0,
    destination: "",
    notes: ""
  })
  
  const itemsPerPage = 5

  // 过滤和分页逻辑
  const filteredLoadings = loadingData.filter(loading => 
    loading.loadingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loading.vehicleInfo.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loading.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loading.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLoadings = filteredLoadings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLoadings.length / itemsPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setNewLoading(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setNewLoading(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setNewLoading(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setNewLoading(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value, 10) || 0
    setNewLoading(prev => ({ ...prev, [name]: numValue }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新装载单
    console.log("保存新装载单:", newLoading)
    setIsDialogOpen(false)
    // 重置表单
    setNewLoading({
      loadingNumber: `LD${format(new Date(), "yyyyMMdd")}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      vehicleInfo: {
        plateNumber: "",
        type: "",
        capacity: ""
      },
      driver: "",
      driverPhone: "",
      loadingTime: new Date(),
      estimatedCompletionTime: new Date(),
      status: LoadingStatus.Pending,
      packageCount: 0,
      completedPackageCount: 0,
      destination: "",
      notes: ""
    })
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建装载单
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新建装载单</DialogTitle>
              <DialogDescription>
                创建一个新的装载单。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loadingNumber" className="text-right">
                  装载单号
                </Label>
                <Input
                  id="loadingNumber"
                  name="loadingNumber"
                  value={newLoading.loadingNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleInfo.plateNumber" className="text-right">
                  车牌号
                </Label>
                <Input
                  id="vehicleInfo.plateNumber"
                  name="vehicleInfo.plateNumber"
                  value={newLoading.vehicleInfo.plateNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 沪A12345"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">车辆类型</Label>
                <Select 
                  value={newLoading.vehicleInfo.type} 
                  onValueChange={(value) => handleSelectChange("vehicleInfo.type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择车辆类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="厢式货车">厢式货车</SelectItem>
                    <SelectItem value="冷藏车">冷藏车</SelectItem>
                    <SelectItem value="平板货车">平板货车</SelectItem>
                    <SelectItem value="集装箱车">集装箱车</SelectItem>
                    <SelectItem value="高栏车">高栏车</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">载重</Label>
                <Select 
                  value={newLoading.vehicleInfo.capacity} 
                  onValueChange={(value) => handleSelectChange("vehicleInfo.capacity", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择载重" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1吨">1吨</SelectItem>
                    <SelectItem value="3吨">3吨</SelectItem>
                    <SelectItem value="5吨">5吨</SelectItem>
                    <SelectItem value="8吨">8吨</SelectItem>
                    <SelectItem value="10吨">10吨</SelectItem>
                    <SelectItem value="12吨">12吨</SelectItem>
                    <SelectItem value="15吨">15吨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver" className="text-right">
                  司机姓名
                </Label>
                <Input
                  id="driver"
                  name="driver"
                  value={newLoading.driver}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 张师傅"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driverPhone" className="text-right">
                  司机电话
                </Label>
                <Input
                  id="driverPhone"
                  name="driverPhone"
                  value={newLoading.driverPhone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 13812345678"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">装载时间</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="packageCount" className="text-right">
                  包裹数量
                </Label>
                <Input
                  id="packageCount"
                  name="packageCount"
                  value={newLoading.packageCount.toString()}
                  onChange={(e) => handleNumberChange("packageCount", e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">
                  目的地
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  value={newLoading.destination}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 上海市浦东新区张江高科技园区"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  备注
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newLoading.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 优先配送电子产品"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-black hover:bg-gray-800" onClick={handleSubmit}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索装载单号、车牌号、司机或目的地..."
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
                <Label>装载状态</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="pending">待装载</SelectItem>
                    <SelectItem value="inProgress">装载中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>车辆类型</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择车辆类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="box">厢式货车</SelectItem>
                    <SelectItem value="refrigerated">冷藏车</SelectItem>
                    <SelectItem value="flatbed">平板货车</SelectItem>
                    <SelectItem value="container">集装箱车</SelectItem>
                    <SelectItem value="stake">高栏车</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>装载日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              <TableHead className="w-[180px]">装载单号</TableHead>
              <TableHead>车辆信息</TableHead>
              <TableHead className="hidden md:table-cell">司机</TableHead>
              <TableHead className="hidden md:table-cell">装载时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="hidden md:table-cell">装载进度</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLoadings.map((loading) => (
              <TableRow key={loading.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{loading.loadingNumber}</div>
                      <div className="text-xs text-gray-500">{loading.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>{loading.vehicleInfo.plateNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {loading.vehicleInfo.type} | {loading.vehicleInfo.capacity}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{loading.driver}</span>
                    </div>
                    <div className="text-xs text-gray-500">{loading.driverPhone}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <div>{format(loading.loadingTime, "yyyy-MM-dd")}</div>
                    <div className="text-xs text-gray-500">{format(loading.loadingTime, "HH:mm")}</div>
                  </div>
                </TableCell>
                <TableCell>{getLoadingStatusBadge(loading.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <Progress 
                      value={getLoadingProgress(loading.completedPackageCount, loading.packageCount)} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">
                      {loading.completedPackageCount}/{loading.packageCount} 包裹
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
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
    </div>
  )
}
