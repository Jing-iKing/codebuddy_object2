import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Image,
  Calendar,
  Clock,
  LayoutDashboard,
  FileText,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
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
import { Switch } from "@/components/ui/switch"

// 广告类型枚举
enum AdvertisementType {
  Banner = "横幅广告",
  Popup = "弹窗广告",
  Sidebar = "侧边栏广告",
  InApp = "应用内广告",
  Email = "邮件广告"
}

// 广告状态枚举
enum AdvertisementStatus {
  Active = "活跃",
  Scheduled = "已排期",
  Expired = "已过期",
  Paused = "已暂停"
}

// 广告状态图标和样式映射
const advertisementStatusConfig = {
  [AdvertisementStatus.Active]: {
    icon: <CheckCircle className="h-4 w-4" />,
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  [AdvertisementStatus.Scheduled]: {
    icon: <Clock className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [AdvertisementStatus.Expired]: {
    icon: <XCircle className="h-4 w-4" />,
    badgeClass: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  },
  [AdvertisementStatus.Paused]: {
    icon: <AlertCircle className="h-4 w-4" />,
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  }
}

// 模拟广告数据
const advertisementsData = [
  {
    id: "AD-001",
    title: "夏季促销活动",
    type: AdvertisementType.Banner,
    position: "首页顶部",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31"),
    status: AdvertisementStatus.Active,
    imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/summer-promotion",
    clicks: 1245,
    impressions: 15680,
    ctr: 7.94, // 点击率 (Click-Through Rate)
    isActive: true
  },
  {
    id: "AD-002",
    title: "新用户注册优惠",
    type: AdvertisementType.Popup,
    position: "登录页面",
    startDate: new Date("2025-07-15"),
    endDate: new Date("2025-09-15"),
    status: AdvertisementStatus.Active,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/new-user-discount",
    clicks: 876,
    impressions: 5430,
    ctr: 16.13,
    isActive: true
  },
  {
    id: "AD-003",
    title: "物流服务升级公告",
    type: AdvertisementType.Sidebar,
    position: "订单页面侧边栏",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-15"),
    status: AdvertisementStatus.Scheduled,
    imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/logistics-upgrade",
    clicks: 0,
    impressions: 0,
    ctr: 0,
    isActive: false
  },
  {
    id: "AD-004",
    title: "春节物流安排",
    type: AdvertisementType.InApp,
    position: "应用内通知",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-02-15"),
    status: AdvertisementStatus.Expired,
    imageUrl: "https://images.unsplash.com/photo-1582281171754-405cb2a75fb1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/spring-festival-logistics",
    clicks: 3421,
    impressions: 12560,
    ctr: 27.24,
    isActive: false
  },
  {
    id: "AD-005",
    title: "会员专享折扣",
    type: AdvertisementType.Email,
    position: "邮件推送",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-31"),
    status: AdvertisementStatus.Paused,
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/member-discount",
    clicks: 567,
    impressions: 8900,
    ctr: 6.37,
    isActive: false
  },
  {
    id: "AD-006",
    title: "新路线开通公告",
    type: AdvertisementType.Banner,
    position: "首页中部",
    startDate: new Date("2025-08-10"),
    endDate: new Date("2025-09-10"),
    status: AdvertisementStatus.Active,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/new-route",
    clicks: 432,
    impressions: 7650,
    ctr: 5.65,
    isActive: true
  },
  {
    id: "AD-007",
    title: "APP下载推广",
    type: AdvertisementType.Sidebar,
    position: "所有页面侧边栏",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-12-31"),
    status: AdvertisementStatus.Active,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/app-download",
    clicks: 2134,
    impressions: 45670,
    ctr: 4.67,
    isActive: true
  },
  {
    id: "AD-008",
    title: "客户满意度调查",
    type: AdvertisementType.Popup,
    position: "订单完成页面",
    startDate: new Date("2025-07-20"),
    endDate: new Date("2025-08-20"),
    status: AdvertisementStatus.Active,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    targetUrl: "https://example.com/satisfaction-survey",
    clicks: 789,
    impressions: 6540,
    ctr: 12.06,
    isActive: true
  }
]

// 获取广告状态徽章
const getAdvertisementStatusBadge = (status: AdvertisementStatus) => {
  const { icon, badgeClass } = advertisementStatusConfig[status]
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{status}</span>
      </div>
    </Badge>
  )
}

export default function AdvertisementsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)))
  const [newAdvertisement, setNewAdvertisement] = useState({
    title: "",
    type: AdvertisementType.Banner,
    position: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    imageUrl: "",
    targetUrl: "",
    isActive: true
  })
  
  const itemsPerPage = 5

  // 过滤和分页逻辑
  const filteredAdvertisements = advertisementsData.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAdvertisements = filteredAdvertisements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAdvertisements.length / itemsPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAdvertisement(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAdvertisement(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewAdvertisement(prev => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新广告
    console.log("保存新广告:", newAdvertisement)
    setIsDialogOpen(false)
    // 重置表单
    setNewAdvertisement({
      title: "",
      type: AdvertisementType.Banner,
      position: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      imageUrl: "",
      targetUrl: "",
      isActive: true
    })
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建广告
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新建广告</DialogTitle>
              <DialogDescription>
                创建一个新的广告。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  广告标题
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newAdvertisement.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 夏季促销活动"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">广告类型</Label>
                <Select 
                  value={newAdvertisement.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择广告类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AdvertisementType.Banner}>{AdvertisementType.Banner}</SelectItem>
                    <SelectItem value={AdvertisementType.Popup}>{AdvertisementType.Popup}</SelectItem>
                    <SelectItem value={AdvertisementType.Sidebar}>{AdvertisementType.Sidebar}</SelectItem>
                    <SelectItem value={AdvertisementType.InApp}>{AdvertisementType.InApp}</SelectItem>
                    <SelectItem value={AdvertisementType.Email}>{AdvertisementType.Email}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  投放位置
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={newAdvertisement.position}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 首页顶部"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">开始日期</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">结束日期</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  图片URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={newAdvertisement.imageUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetUrl" className="text-right">
                  目标链接
                </Label>
                <Input
                  id="targetUrl"
                  name="targetUrl"
                  value={newAdvertisement.targetUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: https://example.com/promotion"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  立即激活
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive" 
                    checked={newAdvertisement.isActive} 
                    onCheckedChange={handleSwitchChange} 
                  />
                  <Label htmlFor="isActive">
                    {newAdvertisement.isActive ? "是" : "否"}
                  </Label>
                </div>
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
                placeholder="搜索广告..."
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
                <h4 className="text-sm font-medium">广告状态</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="scheduled">已排期</SelectItem>
                    <SelectItem value="expired">已过期</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">广告类型</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="banner">横幅广告</SelectItem>
                    <SelectItem value="popup">弹窗广告</SelectItem>
                    <SelectItem value="sidebar">侧边栏广告</SelectItem>
                    <SelectItem value="inapp">应用内广告</SelectItem>
                    <SelectItem value="email">邮件广告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">日期范围</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>选择日期范围</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="p-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">开始日期</h4>
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">结束日期</h4>
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                <TableHead className="w-[250px]">广告标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead className="hidden md:table-cell">投放位置</TableHead>
                <TableHead className="hidden md:table-cell">投放时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="hidden md:table-cell">数据</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAdvertisements.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-xs text-gray-500">{ad.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{ad.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      <span>{ad.position}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="text-xs">{format(ad.startDate, "yyyy-MM-dd")}</div>
                      <div className="text-xs text-gray-500">至 {format(ad.endDate, "yyyy-MM-dd")}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getAdvertisementStatusBadge(ad.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="text-xs">点击: {ad.clicks.toLocaleString()}</div>
                      <div className="text-xs">展示: {ad.impressions.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">CTR: {ad.ctr}%</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
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