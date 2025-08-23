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
  Network,
  Clock,
  Settings
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// 模拟节点数据
const nodes = [
  {
    id: "NODE-001",
    name: "订单处理节点",
    status: "启用",
    billingType: "按次计费",
    methodClassName: "com.oms.processor.OrderProcessor",
    executionType: "自动",
    schedulingRule: "0 0/30 * * * ?",
    description: "处理新订单并分配到相应的处理队列"
  },
  {
    id: "NODE-002",
    name: "库存检查节点",
    status: "启用",
    billingType: "按时计费",
    methodClassName: "com.oms.inventory.StockChecker",
    executionType: "自动",
    schedulingRule: "0 0 0/1 * * ?",
    description: "定期检查库存状态并更新系统"
  },
  {
    id: "NODE-003",
    name: "配送路径规划",
    status: "启用",
    billingType: "按次计费",
    methodClassName: "com.oms.logistics.RouteOptimizer",
    executionType: "手动",
    schedulingRule: "",
    description: "根据订单地址优化配送路径"
  },
  {
    id: "NODE-004",
    name: "客户通知节点",
    status: "禁用",
    billingType: "按次计费",
    methodClassName: "com.oms.notification.CustomerNotifier",
    executionType: "自动",
    schedulingRule: "0 0/15 * * * ?",
    description: "向客户发送订单状态更新通知"
  },
  {
    id: "NODE-005",
    name: "数据同步节点",
    status: "启用",
    billingType: "按时计费",
    methodClassName: "com.oms.sync.DataSynchronizer",
    executionType: "自动",
    schedulingRule: "0 0 0/2 * * ?",
    description: "与外部系统同步数据"
  },
  {
    id: "NODE-006",
    name: "报表生成节点",
    status: "启用",
    billingType: "按次计费",
    methodClassName: "com.oms.report.ReportGenerator",
    executionType: "自动",
    schedulingRule: "0 0 1 * * ?",
    description: "生成每日运营报表"
  },
  {
    id: "NODE-007",
    name: "异常处理节点",
    status: "启用",
    billingType: "按次计费",
    methodClassName: "com.oms.exception.ExceptionHandler",
    executionType: "自动",
    schedulingRule: "0 0/10 * * * ?",
    description: "处理系统中的异常情况"
  },
  {
    id: "NODE-008",
    name: "账单生成节点",
    status: "启用",
    billingType: "按时计费",
    methodClassName: "com.oms.billing.BillingProcessor",
    executionType: "自动",
    schedulingRule: "0 0 0 1 * ?",
    description: "生成月度账单"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case '启用':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>
    case '禁用':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getExecutionTypeBadge = (type: string) => {
  switch (type) {
    case '自动':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{type}</Badge>
    case '手动':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{type}</Badge>
    default:
      return <Badge>{type}</Badge>
  }
}

export default function NodesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNode, setNewNode] = useState({
    name: "",
    status: "启用",
    billingType: "按次计费",
    methodClassName: "",
    executionType: "自动",
    schedulingRule: "",
    description: ""
  })
  
  const nodesPerPage = 5

  // 过滤和分页逻辑
  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.methodClassName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastNode = currentPage * nodesPerPage
  const indexOfFirstNode = indexOfLastNode - nodesPerPage
  const currentNodes = filteredNodes.slice(indexOfFirstNode, indexOfLastNode)
  const totalPages = Math.ceil(filteredNodes.length / nodesPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewNode(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewNode(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewNode(prev => ({ ...prev, status: checked ? "启用" : "禁用" }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新节点
    console.log("保存新节点:", newNode)
    setIsDialogOpen(false)
    // 重置表单
    setNewNode({
      name: "",
      status: "启用",
      billingType: "按次计费",
      methodClassName: "",
      executionType: "自动",
      schedulingRule: "",
      description: ""
    })
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建节点
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>新建节点</DialogTitle>
              <DialogDescription>
                创建一个新的处理节点。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  节点名称
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newNode.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">状态</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch 
                    checked={newNode.status === "启用"} 
                    onCheckedChange={handleSwitchChange} 
                  />
                  <span>{newNode.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">计费类型</Label>
                <Select 
                  value={newNode.billingType} 
                  onValueChange={(value) => handleSelectChange("billingType", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择计费类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="按次计费">按次计费</SelectItem>
                    <SelectItem value="按时计费">按时计费</SelectItem>
                    <SelectItem value="包月计费">包月计费</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="methodClassName" className="text-right">
                  方法类名
                </Label>
                <Input
                  id="methodClassName"
                  name="methodClassName"
                  value={newNode.methodClassName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="com.example.ClassName"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">执行类型</Label>
                <Select 
                  value={newNode.executionType} 
                  onValueChange={(value) => handleSelectChange("executionType", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择执行类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="自动">自动</SelectItem>
                    <SelectItem value="手动">手动</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newNode.executionType === "自动" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedulingRule" className="text-right">
                    定时规则
                  </Label>
                  <Input
                    id="schedulingRule"
                    name="schedulingRule"
                    value={newNode.schedulingRule}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Cron表达式，如: 0 0/30 * * * ?"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  描述
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newNode.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
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

      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索节点..."
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
                <h4 className="text-sm font-medium">节点状态</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="enabled">启用</SelectItem>
                    <SelectItem value="disabled">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">计费类型</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择计费类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="per-use">按次计费</SelectItem>
                    <SelectItem value="per-time">按时计费</SelectItem>
                    <SelectItem value="monthly">包月计费</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">执行类型</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择执行类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="auto">自动</SelectItem>
                    <SelectItem value="manual">手动</SelectItem>
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
                <TableHead className="w-[200px]">节点名称</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>计费类型</TableHead>
                <TableHead>方法类名</TableHead>
                <TableHead>执行类型</TableHead>
                <TableHead>定时执行规则</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{node.name}</div>
                        <div className="text-xs text-gray-500">{node.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(node.status)}</TableCell>
                  <TableCell>{node.billingType}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-sm" title={node.methodClassName}>
                      {node.methodClassName}
                    </div>
                  </TableCell>
                  <TableCell>{getExecutionTypeBadge(node.executionType)}</TableCell>
                  <TableCell>
                    {node.executionType === "自动" ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{node.schedulingRule || "无"}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
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