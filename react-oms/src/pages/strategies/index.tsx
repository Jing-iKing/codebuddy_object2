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
  Settings,
  DollarSign,
  Bell
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟策略数据
const strategies = [
  {
    id: "STR-001",
    name: "标准配送策略",
    alias: "STD-DEL",
    groupCode: "DEL-GROUP-A",
    currency: "CNY",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向上取整", amountRoundingMethod: "四舍五入" },
      { name: "配送路径规划", billingType: "按次计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" }
    ],
    priceSettings: {
      basePrice: 20,
      perKmPrice: 2,
      minPrice: 20
    },
    overLimitSettings: {
      weightLimit: 50,
      overWeightPrice: 5,
      volumeLimit: 1,
      overVolumePrice: 10
    },
    minConsumption: 20,
    notificationMethod: ["短信", "邮件"]
  },
  {
    id: "STR-002",
    name: "加急配送策略",
    alias: "EXP-DEL",
    groupCode: "DEL-GROUP-A",
    currency: "CNY",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向上取整", amountRoundingMethod: "四舍五入" },
      { name: "配送路径规划", billingType: "按次计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" }
    ],
    priceSettings: {
      basePrice: 50,
      perKmPrice: 5,
      minPrice: 50
    },
    overLimitSettings: {
      weightLimit: 30,
      overWeightPrice: 10,
      volumeLimit: 0.8,
      overVolumePrice: 20
    },
    minConsumption: 50,
    notificationMethod: ["短信", "邮件", "电话"]
  },
  {
    id: "STR-003",
    name: "经济配送策略",
    alias: "ECO-DEL",
    groupCode: "DEL-GROUP-B",
    currency: "CNY",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向下取整", amountRoundingMethod: "向下取整" }
    ],
    priceSettings: {
      basePrice: 15,
      perKmPrice: 1,
      minPrice: 15
    },
    overLimitSettings: {
      weightLimit: 20,
      overWeightPrice: 3,
      volumeLimit: 0.5,
      overVolumePrice: 5
    },
    minConsumption: 15,
    notificationMethod: ["短信"]
  },
  {
    id: "STR-004",
    name: "冷链配送策略",
    alias: "COLD-DEL",
    groupCode: "DEL-GROUP-C",
    currency: "CNY",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向上取整", amountRoundingMethod: "四舍五入" },
      { name: "库存检查节点", billingType: "按时计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" }
    ],
    priceSettings: {
      basePrice: 60,
      perKmPrice: 3,
      minPrice: 60
    },
    overLimitSettings: {
      weightLimit: 30,
      overWeightPrice: 8,
      volumeLimit: 0.6,
      overVolumePrice: 15
    },
    minConsumption: 60,
    notificationMethod: ["短信", "邮件"]
  },
  {
    id: "STR-005",
    name: "大件配送策略",
    alias: "LARGE-DEL",
    groupCode: "DEL-GROUP-D",
    currency: "CNY",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向上取整", amountRoundingMethod: "四舍五入" },
      { name: "配送路径规划", billingType: "按次计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" }
    ],
    priceSettings: {
      basePrice: 100,
      perKmPrice: 8,
      minPrice: 100
    },
    overLimitSettings: {
      weightLimit: 100,
      overWeightPrice: 15,
      volumeLimit: 2,
      overVolumePrice: 30
    },
    minConsumption: 100,
    notificationMethod: ["短信", "邮件", "电话"]
  },
  {
    id: "STR-006",
    name: "国际配送策略",
    alias: "INT-DEL",
    groupCode: "DEL-GROUP-E",
    currency: "USD",
    nodes: [
      { name: "订单处理节点", billingType: "按次计费", roundingMethod: "向上取整", amountRoundingMethod: "四舍五入" },
      { name: "配送路径规划", billingType: "按次计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" },
      { name: "数据同步节点", billingType: "按时计费", roundingMethod: "四舍五入", amountRoundingMethod: "四舍五入" }
    ],
    priceSettings: {
      basePrice: 200,
      perKmPrice: 0.5,
      minPrice: 200
    },
    overLimitSettings: {
      weightLimit: 50,
      overWeightPrice: 10,
      volumeLimit: 1,
      overVolumePrice: 20
    },
    minConsumption: 200,
    notificationMethod: ["邮件", "电话"]
  }
]

export default function StrategiesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const strategiesPerPage = 5

  // 过滤和分页逻辑
  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.groupCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastStrategy = currentPage * strategiesPerPage
  const indexOfFirstStrategy = indexOfLastStrategy - strategiesPerPage
  const currentStrategies = filteredStrategies.slice(indexOfFirstStrategy, indexOfLastStrategy)
  const totalPages = Math.ceil(filteredStrategies.length / strategiesPerPage)

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建策略
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>新建策略</DialogTitle>
              <DialogDescription>
                创建一个新的配送策略。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="nodes">节点配置</TabsTrigger>
                <TabsTrigger value="price">价格设置</TabsTrigger>
                <TabsTrigger value="notification">通知方式</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">策略名称</Label>
                    <Input id="name" placeholder="输入策略名称" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alias">策略别名</Label>
                    <Input id="alias" placeholder="输入策略别名" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupCode">分组代码</Label>
                    <Input id="groupCode" placeholder="输入分组代码" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">币种</Label>
                    <Select>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="选择币种" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                        <SelectItem value="USD">美元 (USD)</SelectItem>
                        <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                        <SelectItem value="JPY">日元 (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="nodes" className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">节点配置</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      添加节点
                    </Button>
                  </div>
                  <div className="rounded-md border w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>节点名称</TableHead>
                          <TableHead>计费类型</TableHead>
                          <TableHead>计量取整方式</TableHead>
                          <TableHead>金额取整方式</TableHead>
                          <TableHead className="w-[100px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="选择节点" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="node1">订单处理节点</SelectItem>
                                <SelectItem value="node2">库存检查节点</SelectItem>
                                <SelectItem value="node3">配送路径规划</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="计费类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="per-use">按次计费</SelectItem>
                                <SelectItem value="per-time">按时计费</SelectItem>
                                <SelectItem value="monthly">包月计费</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="计量取整方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="up">向上取整</SelectItem>
                                <SelectItem value="down">向下取整</SelectItem>
                                <SelectItem value="round">四舍五入</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="金额取整方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="up">向上取整</SelectItem>
                                <SelectItem value="down">向下取整</SelectItem>
                                <SelectItem value="round">四舍五入</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="price" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">价格设置</h3>
                    <div className="space-y-2">
                      <Label htmlFor="basePrice">基础价格</Label>
                      <Input id="basePrice" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perKmPrice">每公里价格</Label>
                      <Input id="perKmPrice" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPrice">最低价格</Label>
                      <Input id="minPrice" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">超限设置</h3>
                    <div className="space-y-2">
                      <Label htmlFor="weightLimit">重量限制 (kg)</Label>
                      <Input id="weightLimit" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overWeightPrice">超重价格 (每kg)</Label>
                      <Input id="overWeightPrice" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volumeLimit">体积限制 (m³)</Label>
                      <Input id="volumeLimit" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overVolumePrice">超体积价格 (每m³)</Label>
                      <Input id="overVolumePrice" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="minConsumption">低消设置</Label>
                    <Input id="minConsumption" type="number" placeholder="0.00" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notification" className="py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">通知方式</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="sms">短信通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="email">邮件通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="phone" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="phone">电话通知</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button className="bg-black hover:bg-gray-800">保存</Button>
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
                placeholder="搜索策略..."
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
                <h4 className="text-sm font-medium">分组代码</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分组" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="DEL-GROUP-A">DEL-GROUP-A</SelectItem>
                    <SelectItem value="DEL-GROUP-B">DEL-GROUP-B</SelectItem>
                    <SelectItem value="DEL-GROUP-C">DEL-GROUP-C</SelectItem>
                    <SelectItem value="DEL-GROUP-D">DEL-GROUP-D</SelectItem>
                    <SelectItem value="DEL-GROUP-E">DEL-GROUP-E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">币种</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择币种" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                    <SelectItem value="USD">美元 (USD)</SelectItem>
                    <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                    <SelectItem value="JPY">日元 (JPY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1 flex items-end space-x-2">
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
                <TableHead className="w-[200px]">策略名称</TableHead>
                <TableHead>策略别名</TableHead>
                <TableHead>分组代码</TableHead>
                <TableHead>币种</TableHead>
                <TableHead>节点数量</TableHead>
                <TableHead>价格设置</TableHead>
                <TableHead>通知方式</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStrategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-xs text-gray-500">{strategy.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{strategy.alias}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{strategy.groupCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      {strategy.currency}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{strategy.nodes.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>基础价: {strategy.priceSettings.basePrice}</div>
                      <div>每公里: {strategy.priceSettings.perKmPrice}</div>
                      <div>最低价: {strategy.priceSettings.minPrice}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.notificationMethod.map((method, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Bell className="h-3 w-3 text-gray-500" />
                          <span className="text-xs">{method}</span>
                        </div>
                      ))}
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