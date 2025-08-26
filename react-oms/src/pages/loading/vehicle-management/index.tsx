import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Calendar,
  Truck,
  Package,
  MapPin,
  Clock,
  User,
  Phone,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockVehicles } from "@/data/mock/vehicles";
import { Vehicle, Pallet } from "@/types/transit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollableTabs, ScrollableTabsList, ScrollableTabsTrigger, ScrollableTabsContent } from "@/components/ui/scrollable-tabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// 车辆状态颜色映射
const vehicleStatusColors: Record<string, string> = {
  'available': 'bg-green-100 text-green-800',
  'loading': 'bg-blue-100 text-blue-800',
  'shipping': 'bg-amber-100 text-amber-800',
  'arrived': 'bg-purple-100 text-purple-800',
  'maintenance': 'bg-red-100 text-red-800'
};

// 车辆状态中文映射
const vehicleStatusLabels: Record<string, string> = {
  'available': '可用',
  'loading': '装载中',
  'shipping': '运输中',
  'arrived': '已到达',
  'maintenance': '维护中'
};

// 货板状态颜色映射
const palletStatusColors: Record<string, string> = {
  'available': 'bg-green-100 text-green-800',
  'loading': 'bg-blue-100 text-blue-800',
  'loaded': 'bg-purple-100 text-purple-800',
  'shipping': 'bg-amber-100 text-amber-800',
  'unloading': 'bg-gray-100 text-gray-800'
};

// 货板状态中文映射
const palletStatusLabels: Record<string, string> = {
  'available': '可用',
  'loading': '装载中',
  'loaded': '已装载',
  'shipping': '运输中',
  'unloading': '卸载中'
};

// 车次管理页面
export default function VehicleManagementPage() {
  // 状态
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleDetailOpen, setIsVehicleDetailOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 过滤车辆
  const filteredVehicles = vehicles.filter(vehicle => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(term) ||
      vehicle.driver.toLowerCase().includes(term) ||
      vehicle.phoneNumber.includes(term) ||
      (vehicle.route && vehicle.route.toLowerCase().includes(term));
    
    // 根据当前选中的标签过滤
    if (currentTab === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && vehicle.status === currentTab;
    }
  });

  // 查看车辆详情
  const viewVehicleDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDetailOpen(true);
  };

  // 格式化日期时间
  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return "-";
    return new Date(dateTimeStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* 搜索框 */}
          <div className="w-full md:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索车牌/司机/路线..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          
          {/* 状态过滤 */}
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="available">可用</TabsTrigger>
              <TabsTrigger value="loading">装载中</TabsTrigger>
              <TabsTrigger value="shipping">运输中</TabsTrigger>
              <TabsTrigger value="arrived">已到达</TabsTrigger>
              <TabsTrigger value="maintenance">维护中</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex-grow"></div>
          
          {/* 新增车辆按钮 */}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增车辆
          </Button>
        </div>
        
        {/* 车辆列表 */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>车牌号</TableHead>
                  <TableHead>司机</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>载货量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>装载货板</TableHead>
                  <TableHead>发车时间</TableHead>
                  <TableHead>到达时间</TableHead>
                  <TableHead>路线</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.plateNumber}</TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>{vehicle.phoneNumber}</TableCell>
                      <TableCell>{vehicle.capacity}件</TableCell>
                      <TableCell>
                        <Badge className={vehicleStatusColors[vehicle.status]}>
                          {vehicleStatusLabels[vehicle.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.pallets.length}个</TableCell>
                      <TableCell>{formatDateTime(vehicle.departureTime)}</TableCell>
                      <TableCell>{formatDateTime(vehicle.arrivalTime)}</TableCell>
                      <TableCell>{vehicle.route || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => viewVehicleDetail(vehicle)}
                          >
                            详情
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      {searchTerm ? "没有找到匹配的车辆" : "暂无车辆数据"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 车辆详情对话框 */}
      {selectedVehicle && (
        <Dialog open={isVehicleDetailOpen} onOpenChange={setIsVehicleDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>车辆详情</DialogTitle>
              <DialogDescription>
                查看车辆信息和装载的货板
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-lg font-medium mb-2">基本信息</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">车牌号：</span>
                    <span className="ml-2">{selectedVehicle.plateNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">司机：</span>
                    <span className="ml-2">{selectedVehicle.driver}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">联系电话：</span>
                    <span className="ml-2">{selectedVehicle.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">载货量：</span>
                    <span className="ml-2">{selectedVehicle.capacity}件</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">路线：</span>
                    <span className="ml-2">{selectedVehicle.route || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">发车时间：</span>
                    <span className="ml-2">{formatDateTime(selectedVehicle.departureTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">到达时间：</span>
                    <span className="ml-2">{formatDateTime(selectedVehicle.arrivalTime)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">装载货板 ({selectedVehicle.pallets.length})</h3>
                {selectedVehicle.pallets.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {selectedVehicle.pallets.map((pallet) => (
                      <Card key={pallet.id} className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{pallet.name}</div>
                            {pallet.alias && <div className="text-sm text-gray-500">{pallet.alias}</div>}
                          </div>
                          <Badge className={palletStatusColors[pallet.status]}>
                            {palletStatusLabels[pallet.status]}
                          </Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-gray-500">货品数量：</span>
                          <span>{pallet.itemCount}件</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无装载货板
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVehicleDetailOpen(false)}>
                关闭
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                编辑车辆信息
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
