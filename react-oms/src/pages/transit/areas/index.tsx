import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  Search, 
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  User
} from "lucide-react"
import { ExportImportButtons } from "@/components/data/export-import-buttons"
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
import { Textarea } from "@/components/ui/textarea"

import { mockTransitAreas } from "@/data/mock/transit-areas";
import { TransitArea } from "@/types/transit";

const getStatusBadge = (status: string) => {
  switch (status) {
    case '运行中':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>
    case '维护中':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>
    case '暂停':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TransitAreasPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newArea, setNewArea] = useState<Partial<TransitArea>>({
    name: "",
    code: "",
    defaultStrategy: "",
    address: "",
    contactName: "",
    contactPhone: "",
    status: "运行中",
    isCommon: true,
    color: "text-primary",
    iconName: "Building"
  })
  
  const areasPerPage = 5

  // 过滤和分页逻辑
  const filteredAreas = mockTransitAreas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastArea = currentPage * areasPerPage
  const indexOfFirstArea = indexOfLastArea - areasPerPage
  const currentAreas = filteredAreas.slice(indexOfFirstArea, indexOfLastArea)
  const totalPages = Math.ceil(filteredAreas.length / areasPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewArea(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewArea(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新中转区域
    console.log("保存新中转区域:", newArea)
    setIsDialogOpen(false)
    // 重置表单
    setNewArea({
      name: "",
      code: "",
      defaultStrategy: "",
      address: "",
      contactName: "",
      contactPhone: "",
      status: "运行中"
    })
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建中转区域
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>新建中转区域</DialogTitle>
              <DialogDescription>
                创建一个新的中转区域。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  区域名称
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newArea.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  区域代码
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={newArea.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: SH-TC"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">默认策略</Label>
                <Select 
                  value={newArea.defaultStrategy} 
                  onValueChange={(value) => handleSelectChange("defaultStrategy", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择默认策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="标准配送策略">标准配送策略</SelectItem>
                    <SelectItem value="加急配送策略">加急配送策略</SelectItem>
                    <SelectItem value="经济配送策略">经济配送策略</SelectItem>
                    <SelectItem value="冷链配送策略">冷链配送策略</SelectItem>
                    <SelectItem value="大件配送策略">大件配送策略</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  地址
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={newArea.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactName" className="text-right">
                  联系人姓名
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={newArea.contactName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPhone" className="text-right">
                  联系人电话
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={newArea.contactPhone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 13800138000"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">状态</Label>
                <Select 
                  value={newArea.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="运行中">运行中</SelectItem>
                    <SelectItem value="维护中">维护中</SelectItem>
                    <SelectItem value="暂停">暂停</SelectItem>
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
                placeholder="搜索中转区域..."
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
              data={mockTransitAreas}
              exportFileName="中转区域数据"
              exportPermission="data:export"
              importPermission="data:import"
              module="transitAreas"
              onImport={(importedData) => {
                console.log('导入的中转区域数据:', importedData)
                // 在实际应用中，这里会调用 dispatch 来处理导入的数据
                // 例如: dispatch(importTransitAreas(importedData))
              }}
            />
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
                    <SelectItem value="running">运行中</SelectItem>
                    <SelectItem value="maintenance">维护中</SelectItem>
                    <SelectItem value="paused">暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">默认策略</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="standard">标准配送策略</SelectItem>
                    <SelectItem value="express">加急配送策略</SelectItem>
                    <SelectItem value="economy">经济配送策略</SelectItem>
                    <SelectItem value="cold">冷链配送策略</SelectItem>
                    <SelectItem value="large">大件配送策略</SelectItem>
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
                <TableHead className="w-[200px]">区域名称</TableHead>
                <TableHead>区域代码</TableHead>
                <TableHead>默认策略</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAreas.map((area: TransitArea) => (
                <TableRow key={area.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{area.name}</div>
                        <div className="text-xs text-gray-500">{area.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{area.code}</Badge>
                  </TableCell>
                  <TableCell>{area.defaultStrategy}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={area.address}>
                      {area.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-500" />
                        {area.contactName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {area.contactPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(area.status)}</TableCell>
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