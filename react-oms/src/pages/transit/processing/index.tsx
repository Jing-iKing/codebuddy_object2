import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Eye,
  Pencil,
  Trash2,
  Package,
  ArrowRightLeft,
  Warehouse,
  MoreHorizontal,
  Settings,
  Ship,
  Truck,
  Plane,
  Train,
  Car,
  Building,
  Globe,
  MapPin,
  Flag,
  Clock,
  Store,
  Boxes,
  Landmark
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// 模拟中转处理数据
const transitItems = [
  {
    id: "ITEM-001",
    productName: "电子元件",
    externalOrderId: "EXT-12345",
    length: 30,
    width: 20,
    height: 15,
    weight: 5.2,
    warehouseArea: "A区-电子产品",
    customer: "上海电子有限公司",
    status: "待处理",
    arrivalTime: "2025-08-15 09:30:45"
  },
  {
    id: "ITEM-002",
    productName: "办公用品",
    externalOrderId: "EXT-23456",
    length: 40,
    width: 30,
    height: 10,
    weight: 2.1,
    warehouseArea: "B区-日用品",
    customer: "北京科技集团",
    status: "处理中",
    arrivalTime: "2025-08-16 10:15:22"
  },
  {
    id: "ITEM-003",
    productName: "服装",
    externalOrderId: "EXT-34567",
    length: 25,
    width: 20,
    height: 10,
    weight: 1.5,
    warehouseArea: "C区-服装",
    customer: "广州贸易有限公司",
    status: "已完成",
    arrivalTime: "2025-08-17 14:45:30"
  },
  {
    id: "ITEM-004",
    productName: "食品",
    externalOrderId: "EXT-45678",
    length: 50,
    width: 40,
    height: 30,
    weight: 8.3,
    warehouseArea: "D区-食品",
    customer: "深圳电子科技",
    status: "待处理",
    arrivalTime: "2025-08-18 08:20:15"
  },
  {
    id: "ITEM-005",
    productName: "电器",
    externalOrderId: "EXT-56789",
    length: 60,
    width: 50,
    height: 40,
    weight: 15.7,
    warehouseArea: "E区-大件",
    customer: "杭州网络科技",
    status: "处理中",
    arrivalTime: "2025-08-19 11:10:05"
  },
  {
    id: "ITEM-006",
    productName: "图书",
    externalOrderId: "EXT-67890",
    length: 30,
    width: 20,
    height: 10,
    weight: 3.2,
    warehouseArea: "F区-轻小件",
    customer: "成都信息技术",
    status: "已完成",
    arrivalTime: "2025-08-20 16:35:40"
  },
  {
    id: "ITEM-007",
    productName: "医疗器械",
    externalOrderId: "EXT-78901",
    length: 35,
    width: 25,
    height: 15,
    weight: 4.5,
    warehouseArea: "G区-特殊物品",
    customer: "武汉医疗设备",
    status: "待处理",
    arrivalTime: "2025-08-21 09:50:25"
  },
  {
    id: "ITEM-008",
    productName: "化妆品",
    externalOrderId: "EXT-89012",
    length: 20,
    width: 15,
    height: 10,
    weight: 1.8,
    warehouseArea: "B区-日用品",
    customer: "南京美容用品",
    status: "已完成",
    arrivalTime: "2025-08-22 13:25:55"
  }
]

// 中转处理选项卡数据
const transitTabs = [
  { 
    id: "nanping-zhongao", 
    label: "南屏中澳", 
    isCommon: true,
    description: "南屏中澳线路的中转处理项目",
    icon: <Ship className="h-4 w-4 mr-2" />,
    color: "text-blue-600"
  },
  { 
    id: "aomen-qingzhou", 
    label: "澳门青洲", 
    isCommon: true,
    description: "澳门青洲线路的中转处理项目",
    icon: <Building className="h-4 w-4 mr-2" />,
    color: "text-green-600"
  },
  { 
    id: "nanping-haiwai", 
    label: "南屏海外", 
    isCommon: true,
    description: "南屏海外线路的中转处理项目",
    icon: <Globe className="h-4 w-4 mr-2" />,
    color: "text-purple-600"
  },
  { 
    id: "aomen-qingzhou-cc", 
    label: "澳门青洲CC", 
    isCommon: true,
    description: "澳门青洲CC线路的中转处理项目",
    icon: <MapPin className="h-4 w-4 mr-2" />,
    color: "text-red-600"
  },
  { 
    id: "baoche", 
    label: "包车", 
    isCommon: true,
    description: "包车服务的中转处理项目",
    icon: <Car className="h-4 w-4 mr-2" />,
    color: "text-yellow-600"
  },
  { 
    id: "ff-gang-98-tuo", 
    label: "FF港98拓", 
    isCommon: true,
    description: "FF港98拓线路的中转处理项目",
    icon: <Truck className="h-4 w-4 mr-2" />,
    color: "text-orange-600"
  },
  { 
    id: "ff-gang-96-mao", 
    label: "FF港96贸", 
    isCommon: true,
    description: "FF港96贸线路的中转处理项目",
    icon: <Package className="h-4 w-4 mr-2" />,
    color: "text-indigo-600"
  },
  { 
    id: "ff-gang-96-tuo", 
    label: "FF港96拓", 
    isCommon: true,
    description: "FF港96拓线路的中转处理项目",
    icon: <Truck className="h-4 w-4 mr-2" />,
    color: "text-cyan-600"
  },
  { 
    id: "ff-ao-96-tuo", 
    label: "FF澳96拓", 
    isCommon: true,
    description: "FF澳96拓线路的中转处理项目",
    icon: <Plane className="h-4 w-4 mr-2" />,
    color: "text-sky-600"
  },
  { 
    id: "ff-ao-96-mao", 
    label: "FF澳96贸", 
    isCommon: true,
    description: "FF澳96贸线路的中转处理项目",
    icon: <Package className="h-4 w-4 mr-2" />,
    color: "text-emerald-600"
  },
  { 
    id: "nanping-oumeng", 
    label: "南屏欧盟", 
    isCommon: false,
    description: "南屏欧盟线路的中转处理项目",
    icon: <Flag className="h-4 w-4 mr-2" />,
    color: "text-teal-600"
  },
  { 
    id: "temp-orders", 
    label: "临时/未确认订单", 
    isCommon: true,
    description: "临时或未确认订单的开设区域",
    icon: <Clock className="h-4 w-4 mr-2" />,
    color: "text-rose-600"
  },
  { 
    id: "direct-warehouse", 
    label: "订单直发仓区", 
    isCommon: true,
    description: "订单直接发往仓库的处理区域",
    icon: <Store className="h-4 w-4 mr-2" />,
    color: "text-amber-600"
  },
  { 
    id: "domestic-transport", 
    label: "国内运输", 
    isCommon: true,
    description: "国内运输线路的中转处理项目",
    icon: <Truck className="h-4 w-4 mr-2" />,
    color: "text-lime-600"
  },
  { 
    id: "yinglong-area", 
    label: "英龙分区操作", 
    isCommon: true,
    description: "英龙分区的操作处理项目",
    icon: <Boxes className="h-4 w-4 mr-2" />,
    color: "text-pink-600"
  },
  { 
    id: "zhonggang-line", 
    label: "中港专线", 
    isCommon: true,
    description: "中港专线的中转处理项目",
    icon: <Landmark className="h-4 w-4 mr-2" />,
    color: "text-violet-600"
  },
  { 
    id: "nanping-zhonggang", 
    label: "南屏中港", 
    isCommon: true,
    description: "南屏中港线路的中转处理项目",
    icon: <Building className="h-4 w-4 mr-2" />,
    color: "text-fuchsia-600"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case '待处理':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>
    case '处理中':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>
    case '已完成':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TransitProcessingPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("nanping-zhongao")
  // 初始化时只选择前10个常用选项卡
  const [commonTabs, setCommonTabs] = useState(
    transitTabs.filter(tab => tab.isCommon).slice(0, 10).map(tab => tab.id)
  )
  const [isTabSettingsOpen, setIsTabSettingsOpen] = useState(false)
  
  const [newItem, setNewItem] = useState({
    productName: "",
    externalOrderId: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    warehouseArea: "",
    customer: "",
    status: "待处理"
  })
  
  const itemsPerPage = 5

  // 过滤和分页逻辑
  const filteredItems = transitItems.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.externalOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新中转处理项
    console.log("保存新中转处理项:", newItem)
    setIsDialogOpen(false)
    // 重置表单
    setNewItem({
      productName: "",
      externalOrderId: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      warehouseArea: "",
      customer: "",
      status: "待处理"
    })
  }

  // 处理选项卡设置
  const toggleTabCommon = (tabId: string) => {
    if (commonTabs.includes(tabId)) {
      // 如果已经是常用选项卡，且不是最后一个常用选项卡，则移除
      if (commonTabs.length > 1) {
        setCommonTabs(commonTabs.filter(id => id !== tabId))
      }
    } else {
      // 如果不是常用选项卡，且常用选项卡数量小于10，则添加
      if (commonTabs.length < 10) {
        setCommonTabs([...commonTabs, tabId])
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      {/* 选项卡区域 */}
      <div className="border-b">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center flex-1">
                <div className="flex items-center flex-wrap">
                  <TabsList className="flex-wrap h-auto py-0.5 gap-0.5">
                    {transitTabs
                      .filter(tab => commonTabs.includes(tab.id))
                      .map(tab => (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id} 
                          className="flex items-center my-0.5 px-2 py-1 text-sm"
                        >
                          <span className={tab.color}>{tab.icon}</span>
                          {tab.label}
                        </TabsTrigger>
                      ))}
                  </TabsList>
                  
                  {/* 如果常用选项卡超过10个，显示选择器 */}
                  {commonTabs.length > 10 && (
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger className="w-[180px] ml-1 h-8">
                        <SelectValue placeholder="更多常用选项卡" />
                      </SelectTrigger>
                      <SelectContent>
                        {transitTabs
                          .filter(tab => commonTabs.includes(tab.id))
                          .slice(10) // 获取第10个之后的常用选项卡
                          .map(tab => (
                            <SelectItem key={tab.id} value={tab.id} className="flex items-center">
                              <div className="flex items-center">
                                <span className={tab.color}>{tab.icon}</span>
                                <span>{tab.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-1 h-8">
                        <MoreHorizontal className="h-4 w-4 mr-1" />
                        更多
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {transitTabs
                        .filter(tab => !commonTabs.includes(tab.id))
                        .map(tab => (
                          <DropdownMenuItem 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className={tab.color}>{tab.icon}</span>
                                <span>{tab.label}</span>
                              </div>
                              <span className="text-xs text-gray-500 ml-6 mt-1">{tab.description}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      <DropdownMenuItem 
                        onClick={() => setIsTabSettingsOpen(true)}
                        className="border-t mt-1 pt-1"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        调整常用选项卡
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* 选项卡内容 */}
            {transitTabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-black hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" />
                        新建中转项
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>新建中转处理项</DialogTitle>
                        <DialogDescription>
                          创建一个新的中转处理项。请填写以下信息，完成后点击保存。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="productName" className="text-right">
                            品名
                          </Label>
                          <Input
                            id="productName"
                            name="productName"
                            value={newItem.productName}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="externalOrderId" className="text-right">
                            外部单号
                          </Label>
                          <Input
                            id="externalOrderId"
                            name="externalOrderId"
                            value={newItem.externalOrderId}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="例如: EXT-12345"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">尺寸 (cm)</Label>
                          <div className="col-span-3 flex items-center gap-2">
                            <Input
                              name="length"
                              value={newItem.length}
                              onChange={handleInputChange}
                              placeholder="长"
                              type="number"
                            />
                            <span>×</span>
                            <Input
                              name="width"
                              value={newItem.width}
                              onChange={handleInputChange}
                              placeholder="宽"
                              type="number"
                            />
                            <span>×</span>
                            <Input
                              name="height"
                              value={newItem.height}
                              onChange={handleInputChange}
                              placeholder="高"
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="weight" className="text-right">
                            重量 (kg)
                          </Label>
                          <Input
                            id="weight"
                            name="weight"
                            value={newItem.weight}
                            onChange={handleInputChange}
                            className="col-span-3"
                            type="number"
                            step="0.1"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">仓区</Label>
                          <Select 
                            value={newItem.warehouseArea} 
                            onValueChange={(value) => handleSelectChange("warehouseArea", value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="选择仓区" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A区-电子产品">A区-电子产品</SelectItem>
                              <SelectItem value="B区-日用品">B区-日用品</SelectItem>
                              <SelectItem value="C区-服装">C区-服装</SelectItem>
                              <SelectItem value="D区-食品">D区-食品</SelectItem>
                              <SelectItem value="E区-大件">E区-大件</SelectItem>
                              <SelectItem value="F区-轻小件">F区-轻小件</SelectItem>
                              <SelectItem value="G区-特殊物品">G区-特殊物品</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">开单客户</Label>
                          <Select 
                            value={newItem.customer} 
                            onValueChange={(value) => handleSelectChange("customer", value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="选择客户" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="上海电子有限公司">上海电子有限公司</SelectItem>
                              <SelectItem value="北京科技集团">北京科技集团</SelectItem>
                              <SelectItem value="广州贸易有限公司">广州贸易有限公司</SelectItem>
                              <SelectItem value="深圳电子科技">深圳电子科技</SelectItem>
                              <SelectItem value="杭州网络科技">杭州网络科技</SelectItem>
                              <SelectItem value="成都信息技术">成都信息技术</SelectItem>
                              <SelectItem value="武汉医疗设备">武汉医疗设备</SelectItem>
                              <SelectItem value="南京美容用品">南京美容用品</SelectItem>
                            </SelectContent>
                          </Select>
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

                <div>
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="搜索中转项..."
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
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        导出
                      </Button>
                    </div>
                  </div>

                  <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
                    <CollapsibleContent>
                      <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">状态</h4>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="选择状态" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">全部</SelectItem>
                              <SelectItem value="pending">待处理</SelectItem>
                              <SelectItem value="processing">处理中</SelectItem>
                              <SelectItem value="completed">已完成</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">仓区</h4>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="选择仓区" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">全部</SelectItem>
                              <SelectItem value="A">A区-电子产品</SelectItem>
                              <SelectItem value="B">B区-日用品</SelectItem>
                              <SelectItem value="C">C区-服装</SelectItem>
                              <SelectItem value="D">D区-食品</SelectItem>
                              <SelectItem value="E">E区-大件</SelectItem>
                              <SelectItem value="F">F区-轻小件</SelectItem>
                              <SelectItem value="G">G区-特殊物品</SelectItem>
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
                              <SelectItem value="hangzhou">杭州网络科技</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-3 flex items-end space-x-2">
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
                          <TableHead className="w-[200px]">品名</TableHead>
                          <TableHead>外部单号</TableHead>
                          <TableHead>尺寸 (cm)</TableHead>
                          <TableHead>重量 (kg)</TableHead>
                          <TableHead>仓区</TableHead>
                          <TableHead>开单客户</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-gray-500" />
                                <div>
                                  <div className="font-medium">{item.productName}</div>
                                  <div className="text-xs text-gray-500">{item.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.externalOrderId}</TableCell>
                            <TableCell>
                              {item.length} × {item.width} × {item.height}
                            </TableCell>
                            <TableCell>{item.weight}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Warehouse className="h-4 w-4 text-gray-500" />
                                <span>{item.warehouseArea}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.customer}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon">
                                  <ArrowRightLeft className="h-4 w-4" />
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* 选项卡设置对话框 */}
      <Dialog open={isTabSettingsOpen} onOpenChange={setIsTabSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>调整常用选项卡</DialogTitle>
            <DialogDescription>
              选择要显示在顶部的常用选项卡（最多10个）。其余选项卡将在"更多"菜单中显示。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-1">
              <div className="mb-4 pb-2 border-b">
                <h3 className="text-sm font-medium mb-2">常用选项卡 ({commonTabs.length}/10)</h3>
                <div className="flex flex-wrap gap-2">
                  {transitTabs
                    .filter(tab => commonTabs.includes(tab.id))
                    .map(tab => (
                      <Badge 
                        key={tab.id} 
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-3"
                      >
                        <span className={tab.color}>{tab.icon}</span>
                        {tab.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:text-red-500"
                          onClick={() => toggleTabCommon(tab.id)}
                          disabled={commonTabs.length <= 1}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2">可添加的选项卡</h3>
              <div className="space-y-3">
                {transitTabs
                  .filter(tab => !commonTabs.includes(tab.id))
                  .map(tab => (
                    <div key={tab.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className={tab.color}>{tab.icon}</span>
                          <span className="font-medium">{tab.label}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-6 mt-1">{tab.description}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTabCommon(tab.id)}
                        disabled={commonTabs.length >= 10}
                      >
                        添加到常用
                      </Button>
                    </div>
                  ))}
                
                {transitTabs.filter(tab => !commonTabs.includes(tab.id)).length === 0 && (
                  <div className="text-center text-gray-500 py-2">
                    所有选项卡已添加到常用
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTabSettingsOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
