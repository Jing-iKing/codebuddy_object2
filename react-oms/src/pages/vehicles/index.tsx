import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  Search, 
  Truck,
  User,
  Phone,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zhCN } from "date-fns/locale"

// 车辆类型枚举
enum VehicleType {
  Box = "厢式货车",
  Refrigerated = "冷藏车",
  Flatbed = "平板货车",
  Container = "集装箱车",
  Stake = "高栏车"
}

// 车辆状态枚举
enum VehicleStatus {
  Available = "可用",
  InUse = "使用中",
  Maintenance = "维护中",
  Retired = "已报废"
}

// 车辆状态图标和样式映射
const vehicleStatusConfig = {
  [VehicleStatus.Available]: {
    icon: <CheckCircle className="h-4 w-4" />,
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  [VehicleStatus.InUse]: {
    icon: <Clock className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  [VehicleStatus.Maintenance]: {
    icon: <AlertCircle className="h-4 w-4" />,
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  },
  [VehicleStatus.Retired]: {
    icon: <XCircle className="h-4 w-4" />,
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-200"
  }
}

// 模拟车辆数据
const vehiclesData = [
  {
    id: "VEH-001",
    plateNumber: "沪A12345",
    type: VehicleType.Box,
    capacity: "5吨",
    driver: {
      name: "张师傅",
      phone: "13812345678",
      licenseNumber: "310101198001010011"
    },
    purchaseDate: new Date("2023-01-15"),
    lastMaintenanceDate: new Date("2025-07-10"),
    status: VehicleStatus.Available,
    mileage: 25000,
    fuelConsumption: 12.5, // L/100km
    notes: "定期保养良好"
  },
  {
    id: "VEH-002",
    plateNumber: "沪B67890",
    type: VehicleType.Refrigerated,
    capacity: "3吨",
    driver: {
      name: "李师傅",
      phone: "13987654321",
      licenseNumber: "310102198203040022"
    },
    purchaseDate: new Date("2023-03-20"),
    lastMaintenanceDate: new Date("2025-08-05"),
    status: VehicleStatus.InUse,
    mileage: 18000,
    fuelConsumption: 14.2,
    notes: "冷藏系统需要定期检查"
  },
  {
    id: "VEH-003",
    plateNumber: "沪C54321",
    type: VehicleType.Flatbed,
    capacity: "10吨",
    driver: {
      name: "王师傅",
      phone: "13567891234",
      licenseNumber: "310103198405060033"
    },
    purchaseDate: new Date("2022-11-10"),
    lastMaintenanceDate: new Date("2025-06-20"),
    status: VehicleStatus.Maintenance,
    mileage: 32000,
    fuelConsumption: 18.5,
    notes: "正在进行发动机维修"
  },
  {
    id: "VEH-004",
    plateNumber: "沪D98765",
    type: VehicleType.Box,
    capacity: "8吨",
    driver: {
      name: "赵师傅",
      phone: "13678901234",
      licenseNumber: "310104198607080044"
    },
    purchaseDate: new Date("2023-05-05"),
    lastMaintenanceDate: new Date("2025-07-25"),
    status: VehicleStatus.Available,
    mileage: 15000,
    fuelConsumption: 13.8,
    notes: "新车，状态良好"
  },
  {
    id: "VEH-005",
    plateNumber: "沪E24680",
    type: VehicleType.Container,
    capacity: "15吨",
    driver: {
      name: "钱师傅",
      phone: "13456789012",
      licenseNumber: "310105198809100055"
    },
    purchaseDate: new Date("2022-08-15"),
    lastMaintenanceDate: new Date("2025-08-01"),
    status: VehicleStatus.InUse,
    mileage: 28000,
    fuelConsumption: 22.5,
    notes: "适合长途运输"
  },
  {
    id: "VEH-006",
    plateNumber: "沪F13579",
    type: VehicleType.Refrigerated,
    capacity: "4吨",
    driver: {
      name: "孙师傅",
      phone: "13345678901",
      licenseNumber: "310106199001020066"
    },
    purchaseDate: new Date("2022-06-10"),
    lastMaintenanceDate: new Date("2025-05-15"),
    status: VehicleStatus.Retired,
    mileage: 45000,
    fuelConsumption: 15.2,
    notes: "冷藏系统故障，已报废"
  },
  {
    id: "VEH-007",
    plateNumber: "沪G24680",
    type: VehicleType.Stake,
    capacity: "6吨",
    driver: {
      name: "周师傅",
      phone: "13234567890",
      licenseNumber: "310107199203040077"
    },
    purchaseDate: new Date("2023-02-20"),
    lastMaintenanceDate: new Date("2025-07-18"),
    status: VehicleStatus.Available,
    mileage: 12000,
    fuelConsumption: 14.5,
    notes: "适合运输建材"
  },
  {
    id: "VEH-008",
    plateNumber: "沪H13579",
    type: VehicleType.Box,
    capacity: "7吨",
    driver: {
      name: "吴师傅",
      phone: "13123456789",
      licenseNumber: "310108199405060088"
    },
    purchaseDate: new Date("2023-04-10"),
    lastMaintenanceDate: new Date("2025-08-10"),
    status: VehicleStatus.InUse,
    mileage: 9000,
    fuelConsumption: 13.2,
    notes: "新车，状态良好"
  }
]

// 获取车辆状态徽章
const getVehicleStatusBadge = (status: VehicleStatus) => {
  const { icon, badgeClass } = vehicleStatusConfig[status]
  
  return (
    <Badge className={badgeClass}>
      <div className="flex items-center gap-1">
        {icon}
        <span>{status}</span>
      </div>
    </Badge>
  )
}

export default function VehiclesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date())
  const [maintenanceDate, setMaintenanceDate] = useState<Date | undefined>(new Date())
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: "",
    type: VehicleType.Box,
    capacity: "5吨",
    driver: {
      name: "",
      phone: "",
      licenseNumber: ""
    },
    purchaseDate: new Date(),
    lastMaintenanceDate: new Date(),
    status: VehicleStatus.Available,
    mileage: 0,
    fuelConsumption: 0,
    notes: ""
  })
  
  const itemsPerPage = 5

  // 过滤和分页逻辑
  const filteredVehicles = vehiclesData.filter(vehicle => 
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setNewVehicle(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setNewVehicle(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setNewVehicle(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setNewVehicle(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setNewVehicle(prev => ({ ...prev, [name]: numValue }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新车辆
    console.log("保存新车辆:", newVehicle)
    setIsDialogOpen(false)
    // 重置表单
    setNewVehicle({
      plateNumber: "",
      type: VehicleType.Box,
      capacity: "5吨",
      driver: {
        name: "",
        phone: "",
        licenseNumber: ""
      },
      purchaseDate: new Date(),
      lastMaintenanceDate: new Date(),
      status: VehicleStatus.Available,
      mileage: 0,
      fuelConsumption: 0,
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
              新增车辆
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增车辆</DialogTitle>
              <DialogDescription>
                添加一个新的车辆信息。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plateNumber" className="text-right">
                  车牌号
                </Label>
                <Input
                  id="plateNumber"
                  name="plateNumber"
                  value={newVehicle.plateNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 沪A12345"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">车辆类型</Label>
                <Select 
                  value={newVehicle.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择车辆类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VehicleType.Box}>{VehicleType.Box}</SelectItem>
                    <SelectItem value={VehicleType.Refrigerated}>{VehicleType.Refrigerated}</SelectItem>
                    <SelectItem value={VehicleType.Flatbed}>{VehicleType.Flatbed}</SelectItem>
                    <SelectItem value={VehicleType.Container}>{VehicleType.Container}</SelectItem>
                    <SelectItem value={VehicleType.Stake}>{VehicleType.Stake}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">载重</Label>
                <Select 
                  value={newVehicle.capacity} 
                  onValueChange={(value) => handleSelectChange("capacity", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择载重" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1吨">1吨</SelectItem>
                    <SelectItem value="3吨">3吨</SelectItem>
                    <SelectItem value="5吨">5吨</SelectItem>
                    <SelectItem value="6吨">6吨</SelectItem>
                    <SelectItem value="7吨">7吨</SelectItem>
                    <SelectItem value="8吨">8吨</SelectItem>
                    <SelectItem value="10吨">10吨</SelectItem>
                    <SelectItem value="12吨">12吨</SelectItem>
                    <SelectItem value="15吨">15吨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver.name" className="text-right">
                  司机姓名
                </Label>
                <Input
                  id="driver.name"
                  name="driver.name"
                  value={newVehicle.driver.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 张师傅"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver.phone" className="text-right">
                  司机电话
                </Label>
                <Input
                  id="driver.phone"
                  name="driver.phone"
                  value={newVehicle.driver.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 13812345678"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver.licenseNumber" className="text-right">
                  驾驶证号
                </Label>
                <Input
                  id="driver.licenseNumber"
                  name="driver.licenseNumber"
                  value={newVehicle.driver.licenseNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 310101198001010011"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">购买日期</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {purchaseDate ? format(purchaseDate, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={purchaseDate}
                        onSelect={setPurchaseDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">最近维护日期</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !maintenanceDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {maintenanceDate ? format(maintenanceDate, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={maintenanceDate}
                        onSelect={setMaintenanceDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mileage" className="text-right">
                  里程数 (km)
                </Label>
                <Input
                  id="mileage"
                  name="mileage"
                  value={newVehicle.mileage.toString()}
                  onChange={(e) => handleNumberChange("mileage", e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuelConsumption" className="text-right">
                  油耗 (L/100km)
                </Label>
                <Input
                  id="fuelConsumption"
                  name="fuelConsumption"
                  value={newVehicle.fuelConsumption.toString()}
                  onChange={(e) => handleNumberChange("fuelConsumption", e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">状态</Label>
                <Select 
                  value={newVehicle.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VehicleStatus.Available}>{VehicleStatus.Available}</SelectItem>
                    <SelectItem value={VehicleStatus.InUse}>{VehicleStatus.InUse}</SelectItem>
                    <SelectItem value={VehicleStatus.Maintenance}>{VehicleStatus.Maintenance}</SelectItem>
                    <SelectItem value={VehicleStatus.Retired}>{VehicleStatus.Retired}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  备注
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newVehicle.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 定期保养良好"
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
                placeholder="搜索车辆..."
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
              data={vehiclesData}
              exportFileName="车辆数据"
              exportPermission="data:export"
              importPermission="data:import"
              module="vehicles"
              onImport={(importedData) => {
                console.log('导入的车辆数据:', importedData)
                // 在实际应用中，这里会调用 dispatch 来处理导入的数据
                // 例如: dispatch(importVehicles(importedData))
              }}
            />
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
          <CollapsibleContent>
            <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">车辆状态</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="available">可用</SelectItem>
                    <SelectItem value="inUse">使用中</SelectItem>
                    <SelectItem value="maintenance">维护中</SelectItem>
                    <SelectItem value="retired">已报废</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">车辆类型</h4>
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
                <h4 className="text-sm font-medium">载重</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择载重" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="small">轻型 (≤5吨)</SelectItem>
                    <SelectItem value="medium">中型 (6-10吨)</SelectItem>
                    <SelectItem value="large">重型 ({'>'}10吨)</SelectItem>
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
                <TableHead className="w-[180px]">车牌号</TableHead>
                <TableHead>类型/载重</TableHead>
                <TableHead className="hidden md:table-cell">司机信息</TableHead>
                <TableHead className="hidden md:table-cell">购买/维护日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="hidden md:table-cell">里程/油耗</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{vehicle.plateNumber}</div>
                        <div className="text-xs text-gray-500">{vehicle.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div>{vehicle.type}</div>
                      <div className="text-xs text-gray-500">{vehicle.capacity}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{vehicle.driver.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <span>{vehicle.driver.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="text-xs">购买: {format(vehicle.purchaseDate, "yyyy-MM-dd")}</div>
                      <div className="text-xs text-gray-500">维护: {format(vehicle.lastMaintenanceDate, "yyyy-MM-dd")}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getVehicleStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="text-xs">{vehicle.mileage.toLocaleString()} km</div>
                      <div className="text-xs text-gray-500">{vehicle.fuelConsumption} L/100km</div>
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
