import { useState } from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  Search, 
  MapPin,
  Building,
  Home,
  Warehouse,
  Phone,
  User,
  Pencil,
  Trash2,
  Eye
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

// 地址类型枚举
enum AddressType {
  Company = "公司",
  Home = "家庭",
  Warehouse = "仓库",
  Store = "门店",
  Other = "其他"
}

// 地址接口定义
interface Address {
  id: string;
  name: string;
  type: AddressType;
  address: string;
  contact: string;
  phone: string;
  isDefault: boolean;
  province: string;
  city: string;
  district: string;
}

// 地址类型图标映射
const addressTypeIcons = {
  [AddressType.Company]: <Building className="h-4 w-4" />,
  [AddressType.Home]: <Home className="h-4 w-4" />,
  [AddressType.Warehouse]: <Warehouse className="h-4 w-4" />,
  [AddressType.Store]: <Building className="h-4 w-4" />,
  [AddressType.Other]: <MapPin className="h-4 w-4" />
}

// 生成大量模拟地址数据
const generateMockAddresses = (count: number): Address[] => {
  const types = [AddressType.Company, AddressType.Home, AddressType.Warehouse, AddressType.Store, AddressType.Other];
  const provinces = ["北京市", "上海市", "广东省", "浙江省", "四川省", "湖北省", "陕西省", "江苏省", "山东省", "河南省"];
  const cities = ["北京市", "上海市", "广州市", "深圳市", "杭州市", "成都市", "武汉市", "西安市", "南京市", "济南市"];
  const districts = ["海淀区", "浦东新区", "白云区", "南山区", "余杭区", "高新区", "江汉区", "雁塔区", "鼓楼区", "历下区"];
  const streets = ["中关村南大街", "张江高科技园区", "机场路", "科技园南区", "莫干山路", "天府大道", "解放大道", "小寨路", "中山路", "经十路"];
  
  const baseAddresses = [
    {
      id: "ADDR-001",
      name: "上海总部",
      type: AddressType.Company,
      address: "上海市浦东新区张江高科技园区博云路2号",
      contact: "张经理",
      phone: "13812345678",
      isDefault: true,
      province: "上海市",
      city: "上海市",
      district: "浦东新区"
    },
    {
      id: "ADDR-002",
      name: "北京分公司",
      type: AddressType.Company,
      address: "北京市海淀区中关村南大街5号",
      contact: "李经理",
      phone: "13987654321",
      isDefault: false,
      province: "北京市",
      city: "北京市",
      district: "海淀区"
    },
    {
      id: "ADDR-003",
      name: "广州仓库",
      type: AddressType.Warehouse,
      address: "广州市白云区机场路1668号",
      contact: "王主管",
      phone: "13567891234",
      isDefault: false,
      province: "广东省",
      city: "广州市",
      district: "白云区"
    },
    {
      id: "ADDR-004",
      name: "深圳门店",
      type: AddressType.Store,
      address: "深圳市南山区科技园南区8栋101",
      contact: "赵店长",
      phone: "13678901234",
      isDefault: false,
      province: "广东省",
      city: "深圳市",
      district: "南山区"
    },
    {
      id: "ADDR-005",
      name: "杭州配送中心",
      type: AddressType.Warehouse,
      address: "杭州市余杭区良渚街道莫干山路2588号",
      contact: "钱经理",
      phone: "13456789012",
      isDefault: false,
      province: "浙江省",
      city: "杭州市",
      district: "余杭区"
    },
    {
      id: "ADDR-006",
      name: "成都分公司",
      type: AddressType.Company,
      address: "成都市高新区天府大道1700号",
      contact: "孙经理",
      phone: "13345678901",
      isDefault: false,
      province: "四川省",
      city: "成都市",
      district: "高新区"
    },
    {
      id: "ADDR-007",
      name: "武汉配送点",
      type: AddressType.Warehouse,
      address: "武汉市江汉区解放大道688号",
      contact: "周主管",
      phone: "13234567890",
      isDefault: false,
      province: "湖北省",
      city: "武汉市",
      district: "江汉区"
    },
    {
      id: "ADDR-008",
      name: "西安门店",
      type: AddressType.Store,
      address: "西安市雁塔区小寨路68号",
      contact: "吴店长",
      phone: "13123456789",
      isDefault: false,
      province: "陕西省",
      city: "西安市",
      district: "雁塔区"
    }
  ];
  
  // 如果请求的数量小于等于基础数据量，直接返回基础数据的子集
  if (count <= baseAddresses.length) {
    return baseAddresses.slice(0, count);
  }
  
  // 否则，生成更多随机数据
  const result = [...baseAddresses];
  
  for (let i = baseAddresses.length; i < count; i++) {
    const provinceIndex = Math.floor(Math.random() * provinces.length);
    const cityIndex = Math.floor(Math.random() * cities.length);
    const districtIndex = Math.floor(Math.random() * districts.length);
    const streetIndex = Math.floor(Math.random() * streets.length);
    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];
    
    let name = "";
    if (type === AddressType.Company) {
      name = `${cities[cityIndex]}分公司${i - baseAddresses.length + 1}`;
    } else if (type === AddressType.Warehouse) {
      name = `${cities[cityIndex]}仓库${i - baseAddresses.length + 1}`;
    } else if (type === AddressType.Store) {
      name = `${cities[cityIndex]}门店${i - baseAddresses.length + 1}`;
    } else if (type === AddressType.Home) {
      name = `家庭地址${i - baseAddresses.length + 1}`;
    } else {
      name = `其他地址${i - baseAddresses.length + 1}`;
    }
    
    result.push({
      id: `ADDR-${String(i + 1).padStart(3, '0')}`,
      name,
      type,
      address: `${provinces[provinceIndex]}${cities[cityIndex]}${districts[districtIndex]}${streets[streetIndex]}${Math.floor(Math.random() * 1000) + 1}号`,
      contact: `联系人${i - baseAddresses.length + 1}`,
      phone: `1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      isDefault: false,
      province: provinces[provinceIndex],
      city: cities[cityIndex],
      district: districts[districtIndex]
    });
  }
  
  return result;
};

// 生成300条模拟数据
const mockAddresses = generateMockAddresses(300);

// 获取地址类型对应的徽章
const getAddressTypeBadge = (type: AddressType) => {
  const badgeStyles = {
    [AddressType.Company]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    [AddressType.Home]: "bg-green-100 text-green-800 hover:bg-green-200",
    [AddressType.Warehouse]: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    [AddressType.Store]: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    [AddressType.Other]: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  return (
    <Badge className={badgeStyles[type]}>
      <div className="flex items-center gap-1">
        {addressTypeIcons[type]}
        <span>{type}</span>
      </div>
    </Badge>
  )
}

export default function AddressesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newAddress, setNewAddress] = useState({
    name: "",
    type: AddressType.Company,
    address: "",
    contact: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    isDefault: false
  })
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 过滤和分页逻辑
  const filteredAddresses = mockAddresses.filter(address => 
    address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.phone.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAddresses = filteredAddresses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // 在实际应用中，这里会调用API保存新地址
    console.log("保存新地址:", newAddress)
    setIsDialogOpen(false)
    // 重置表单
    setNewAddress({
      name: "",
      type: AddressType.Company,
      address: "",
      contact: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      isDefault: false
    })
  }

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              新建地址
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>新建地址</DialogTitle>
              <DialogDescription>
                创建一个新的地址。请填写以下信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  地址名称
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newAddress.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 上海总部"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">地址类型</Label>
                <Select 
                  value={newAddress.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择地址类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AddressType.Company}>{AddressType.Company}</SelectItem>
                    <SelectItem value={AddressType.Home}>{AddressType.Home}</SelectItem>
                    <SelectItem value={AddressType.Warehouse}>{AddressType.Warehouse}</SelectItem>
                    <SelectItem value={AddressType.Store}>{AddressType.Store}</SelectItem>
                    <SelectItem value={AddressType.Other}>{AddressType.Other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">所在地区</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Select 
                    value={newAddress.province} 
                    onValueChange={(value) => handleSelectChange("province", value)}
                  >
                    <SelectTrigger className="w-[33%]">
                      <SelectValue placeholder="省份" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="北京市">北京市</SelectItem>
                      <SelectItem value="上海市">上海市</SelectItem>
                      <SelectItem value="广东省">广东省</SelectItem>
                      <SelectItem value="浙江省">浙江省</SelectItem>
                      <SelectItem value="四川省">四川省</SelectItem>
                      <SelectItem value="湖北省">湖北省</SelectItem>
                      <SelectItem value="陕西省">陕西省</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={newAddress.city} 
                    onValueChange={(value) => handleSelectChange("city", value)}
                  >
                    <SelectTrigger className="w-[33%]">
                      <SelectValue placeholder="城市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="北京市">北京市</SelectItem>
                      <SelectItem value="上海市">上海市</SelectItem>
                      <SelectItem value="广州市">广州市</SelectItem>
                      <SelectItem value="深圳市">深圳市</SelectItem>
                      <SelectItem value="杭州市">杭州市</SelectItem>
                      <SelectItem value="成都市">成都市</SelectItem>
                      <SelectItem value="武汉市">武汉市</SelectItem>
                      <SelectItem value="西安市">西安市</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={newAddress.district} 
                    onValueChange={(value) => handleSelectChange("district", value)}
                  >
                    <SelectTrigger className="w-[33%]">
                      <SelectValue placeholder="区县" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="海淀区">海淀区</SelectItem>
                      <SelectItem value="浦东新区">浦东新区</SelectItem>
                      <SelectItem value="白云区">白云区</SelectItem>
                      <SelectItem value="南山区">南山区</SelectItem>
                      <SelectItem value="余杭区">余杭区</SelectItem>
                      <SelectItem value="高新区">高新区</SelectItem>
                      <SelectItem value="江汉区">江汉区</SelectItem>
                      <SelectItem value="雁塔区">雁塔区</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  详细地址
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={newAddress.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="请输入详细地址信息，如街道名称、门牌号等"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  联系人
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={newAddress.contact}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 张经理"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  联系电话
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="例如: 13812345678"
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
                  placeholder="搜索地址..."
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
                data={filteredAddresses}
                exportFileName="地址数据"
                exportPermission="data:export"
                importPermission="data:import"
                module="addresses"
                onImport={(importedData) => {
                  console.log('导入的地址数据:', importedData)
                  // 在实际应用中，这里会调用 dispatch 来处理导入的数据
                  // 例如: dispatch(importAddresses(importedData))
                }}
              />
            </div>
          </div>

          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
            <CollapsibleContent>
              <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">地址类型</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="company">公司</SelectItem>
                      <SelectItem value="home">家庭</SelectItem>
                      <SelectItem value="warehouse">仓库</SelectItem>
                      <SelectItem value="store">门店</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">省份</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择省份" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="beijing">北京市</SelectItem>
                      <SelectItem value="shanghai">上海市</SelectItem>
                      <SelectItem value="guangdong">广东省</SelectItem>
                      <SelectItem value="zhejiang">浙江省</SelectItem>
                      <SelectItem value="sichuan">四川省</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">城市</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择城市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="beijing">北京市</SelectItem>
                      <SelectItem value="shanghai">上海市</SelectItem>
                      <SelectItem value="guangzhou">广州市</SelectItem>
                      <SelectItem value="shenzhen">深圳市</SelectItem>
                      <SelectItem value="hangzhou">杭州市</SelectItem>
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
                  <TableHead className="w-[200px]">地址名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead className="hidden md:table-cell max-w-[300px]">详细地址</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead className="hidden md:table-cell">联系电话</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">{address.name}</div>
                          <div className="text-xs text-gray-500">{address.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getAddressTypeBadge(address.type)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      <div className="truncate">
                        {address.province} {address.city} {address.district} {address.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{address.contact}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{address.phone}</span>
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