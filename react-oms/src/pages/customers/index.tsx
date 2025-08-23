import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  Search, 
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

// 客户类型定义
interface Customer {
  id: string;
  name: string;
  referrer: string;
  converter: string;
  settlementType: string;
  availableStrategies: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  address: string;
  orderStrategy: string;
  deliveryZone: string;
  status: string;
}

// 生成大量模拟客户数据
const generateMockCustomers = (count: number): Customer[] => {
  const statuses = ['活跃', '非活跃'];
  const settlementTypes = ['月结', '周结', '现结', '季结'];
  const strategies = ['标准配送', '加急配送', '经济配送', '冷链配送', '大件配送'];
  const cities = ['上海', '北京', '广州', '深圳', '杭州', '成都', '武汉', '南京', '天津', '重庆', '西安', '青岛'];
  const industries = ['电子', '科技', '贸易', '医疗', '网络', '信息', '物流', '食品', '服装', '家具', '汽车', '教育'];
  const zones = ['浦东新区', '海淀区', '天河区', '南山区', '西湖区', '高新区', '江汉区', '鼓楼区', '和平区', '渝中区', '雁塔区', '市南区'];
  
  const baseCustomers = [
    {
      id: "CUST-001",
      name: "上海电子有限公司",
      referrer: "张三",
      converter: "李四",
      settlementType: "月结",
      availableStrategies: ["标准配送", "加急配送"],
      contactName: "王经理",
      contactPhone: "13800138000",
      contactEmail: "wang@shanghai-electronics.com",
      notes: "大客户，每月订单量稳定",
      address: "上海市浦东新区张江高科技园区",
      orderStrategy: "标准配送",
      deliveryZone: "浦东新区",
      status: "活跃"
    },
    {
      id: "CUST-002",
      name: "北京科技集团",
      referrer: "赵六",
      converter: "钱七",
      settlementType: "周结",
      availableStrategies: ["标准配送", "经济配送"],
      contactName: "李总",
      contactPhone: "13900139000",
      contactEmail: "li@beijing-tech.com",
      notes: "新客户，需要特别关注",
      address: "北京市海淀区中关村",
      orderStrategy: "经济配送",
      deliveryZone: "海淀区",
      status: "活跃"
    },
    {
      id: "CUST-003",
      name: "广州贸易有限公司",
      referrer: "孙八",
      converter: "周九",
      settlementType: "现结",
      availableStrategies: ["标准配送"],
      contactName: "陈经理",
      contactPhone: "13700137000",
      contactEmail: "chen@guangzhou-trade.com",
      notes: "季节性订单较多",
      address: "广州市天河区珠江新城",
      orderStrategy: "标准配送",
      deliveryZone: "天河区",
      status: "活跃"
    },
    {
      id: "CUST-004",
      name: "深圳电子科技",
      referrer: "吴十",
      converter: "郑十一",
      settlementType: "月结",
      availableStrategies: ["冷链配送", "标准配送"],
      contactName: "黄总",
      contactPhone: "13600136000",
      contactEmail: "huang@shenzhen-tech.com",
      notes: "需要冷链物流服务",
      address: "深圳市南山区科技园",
      orderStrategy: "冷链配送",
      deliveryZone: "南山区",
      status: "非活跃"
    },
    {
      id: "CUST-005",
      name: "杭州网络科技",
      referrer: "冯十二",
      converter: "蒋十三",
      settlementType: "季结",
      availableStrategies: ["标准配送", "大件配送"],
      contactName: "朱经理",
      contactPhone: "13500135000",
      contactEmail: "zhu@hangzhou-net.com",
      notes: "主要是大型设备运输",
      address: "杭州市西湖区文三路",
      orderStrategy: "大件配送",
      deliveryZone: "西湖区",
      status: "活跃"
    },
    {
      id: "CUST-006",
      name: "成都信息技术",
      referrer: "韩十四",
      converter: "唐十五",
      settlementType: "月结",
      availableStrategies: ["标准配送"],
      contactName: "杨总",
      contactPhone: "13400134000",
      contactEmail: "yang@chengdu-info.com",
      notes: "合作时间较长的老客户",
      address: "成都市高新区天府大道",
      orderStrategy: "标准配送",
      deliveryZone: "高新区",
      status: "活跃"
    },
    {
      id: "CUST-007",
      name: "武汉医疗设备",
      referrer: "姜十六",
      converter: "谢十七",
      settlementType: "月结",
      availableStrategies: ["加急配送"],
      contactName: "胡经理",
      contactPhone: "13300133000",
      contactEmail: "hu@wuhan-medical.com",
      notes: "医疗设备需要加急配送",
      address: "武汉市江汉区解放大道",
      orderStrategy: "加急配送",
      deliveryZone: "江汉区",
      status: "活跃"
    },
    {
      id: "CUST-008",
      name: "南京美容用品",
      referrer: "潘十八",
      converter: "葛十九",
      settlementType: "现结",
      availableStrategies: ["标准配送"],
      contactName: "董总",
      contactPhone: "13200132000",
      contactEmail: "dong@nanjing-beauty.com",
      notes: "化妆品和美容用品",
      address: "南京市鼓楼区中山路",
      orderStrategy: "标准配送",
      deliveryZone: "鼓楼区",
      status: "非活跃"
    }
  ];
  
  // 如果请求的数量小于等于基础数据量，直接返回基础数据的子集
  if (count <= baseCustomers.length) {
    return baseCustomers.slice(0, count);
  }
  
  // 否则，生成更多随机数据
  const result = [...baseCustomers];
  
  for (let i = baseCustomers.length; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const availableStrategiesCount = Math.floor(Math.random() * 3) + 1;
    const availableStrategiesSet = new Set<string>();
    
    while (availableStrategiesSet.size < availableStrategiesCount) {
      availableStrategiesSet.add(strategies[Math.floor(Math.random() * strategies.length)]);
    }
    
    const availableStrategiesArray = Array.from(availableStrategiesSet);
    const orderStrategy = availableStrategiesArray[Math.floor(Math.random() * availableStrategiesArray.length)];
    
    result.push({
      id: `CUST-${String(i + 1).padStart(3, '0')}`,
      name: `${city}${industry}${Math.floor(Math.random() * 1000)}有限公司`,
      referrer: `推荐人${i}`,
      converter: `转化人${i}`,
      settlementType: settlementTypes[Math.floor(Math.random() * settlementTypes.length)],
      availableStrategies: availableStrategiesArray,
      contactName: `联系人${i}`,
      contactPhone: `1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      contactEmail: `contact${i}@example.com`,
      notes: `客户备注信息${i}`,
      address: `${city}市${zone}某路${Math.floor(Math.random() * 1000)}号`,
      orderStrategy,
      deliveryZone: zone,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return result;
};

// 生成500条模拟数据
const mockCustomers = generateMockCustomers(500);

// 获取状态徽章
const getStatusBadge = (status: string) => {
  switch (status) {
    case '活跃':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>
    case '非活跃':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

// 获取客户名称首字母
const getInitials = (name: string) => {
  return name.substring(0, 2)
}

export default function CustomersPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 过滤和分页逻辑
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" />
          新建客户
        </Button>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索客户..."
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
              data={filteredCustomers}
              exportFileName="客户数据"
              exportPermission="data:export"
              importPermission="data:import"
              module="customers"
              onImport={(importedData) => {
                console.log('导入的客户数据:', importedData)
                // 在实际应用中，这里会调用 dispatch 来处理导入的数据
                // 例如: dispatch(importCustomers(importedData))
              }}
            />
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-4">
          <CollapsibleContent>
            <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">客户状态</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">非活跃</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">结算类型</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择结算类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="monthly">月结</SelectItem>
                    <SelectItem value="weekly">周结</SelectItem>
                    <SelectItem value="immediate">现结</SelectItem>
                    <SelectItem value="quarterly">季结</SelectItem>
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
                <TableHead className="w-[250px]">客户名称</TableHead>
                <TableHead>引流/转化</TableHead>
                <TableHead>结算类型</TableHead>
                <TableHead>可用策略</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-black text-white">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>引流: {customer.referrer}</div>
                      <div>转化: {customer.converter}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.settlementType}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.availableStrategies.map((strategy, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.contactName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {customer.contactPhone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {customer.contactEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.address}</div>
                      <div className="text-xs text-gray-500">
                        配送分区: {customer.deliveryZone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/customers/${customer.id}`}>
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