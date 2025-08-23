import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MapComponent, Coordinates } from '@/components/map/map-container'
import { Search, Plus, Filter, MapPin, Warehouse, Truck, LayoutGrid } from 'lucide-react'
import { 
  setSelectedNode, 
  setMapCenter, 
  setMapZoom, 
  addNode, 
  updateNode, 
  removeNode,
  LogisticsNode,
  Route as MapRoute
} from '@/store/slices/map-slice'
import { RootState } from '@/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// 模拟物流节点数据（实际项目中应从API获取）
const mockNodes: LogisticsNode[] = [
  {
    id: 'WH001',
    name: '上海中央仓库',
    address: '上海市浦东新区金桥路1000号',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    type: 'warehouse',
    status: 'active'
  },
  {
    id: 'WH002',
    name: '北京配送中心',
    address: '北京市朝阳区建国路88号',
    coordinates: { lat: 39.9042, lng: 116.4074 },
    type: 'distribution',
    status: 'active'
  },
  {
    id: 'TR001',
    name: '杭州中转站',
    address: '杭州市西湖区文三路478号',
    coordinates: { lat: 30.2741, lng: 120.1551 },
    type: 'transit',
    status: 'active'
  },
  {
    id: 'CU001',
    name: '广州贸易有限公司',
    address: '广州市天河区珠江新城',
    coordinates: { lat: 23.1291, lng: 113.2644 },
    type: 'customer',
    status: 'active'
  },
  {
    id: 'CU002',
    name: '深圳电子科技',
    address: '深圳市南山区科技园',
    coordinates: { lat: 22.5431, lng: 114.0579 },
    type: 'customer',
    status: 'active'
  }
]

// 模拟路径数据（实际项目中应从API获取）
const mockRoutes: MapRoute[] = [
  {
    id: 'RT001',
    name: '上海-杭州路线',
    startNodeId: 'WH001',
    endNodeId: 'TR001',
    distance: 180,
    estimatedTime: 120,
    waypoints: [
      { lat: 31.2304, lng: 121.4737 },
      { lat: 30.8, lng: 120.8 },
      { lat: 30.2741, lng: 120.1551 }
    ],
    color: '#1976D2'
  },
  {
    id: 'RT002',
    name: '北京-广州路线',
    startNodeId: 'WH002',
    endNodeId: 'CU001',
    distance: 2100,
    estimatedTime: 1200,
    waypoints: [
      { lat: 39.9042, lng: 116.4074 },
      { lat: 34.5, lng: 114.5 },
      { lat: 30.5, lng: 114.0 },
      { lat: 23.1291, lng: 113.2644 }
    ],
    color: '#4CAF50'
  }
]

export default function MapPage() {
  const dispatch = useDispatch()
  const { nodes, routes, selectedNode, mapCenter, mapZoom } = useSelector((state: RootState) => state.map)
  
  // 初始化状态（实际项目中应从API获取）
  useEffect(() => {
    // 这里应该调用 dispatch(fetchAllNodes()) 从API获取数据
    // 为了演示，我们直接使用模拟数据
    mockNodes.forEach(node => {
      dispatch(addNode(node))
    })
  }, [dispatch])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false)
  const [newNode, setNewNode] = useState<Partial<LogisticsNode>>({
    name: '',
    address: '',
    coordinates: { lat: 0, lng: 0 },
    type: 'warehouse',
    status: 'active'
  })

  // 过滤节点
  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 处理节点点击
  const handleNodeClick = (node: LogisticsNode) => {
    dispatch(setSelectedNode(node))
  }

  // 处理地图点击
  const handleMapClick = (coordinates: Coordinates) => {
    setNewNode(prev => ({ ...prev, coordinates }))
  }

  // 处理添加节点
  const handleAddNode = () => {
    if (newNode.name && newNode.address && newNode.coordinates && newNode.type) {
      const newNodeComplete: LogisticsNode = {
        id: `NODE${Math.floor(Math.random() * 10000)}`,
        name: newNode.name,
        address: newNode.address,
        coordinates: newNode.coordinates,
        type: newNode.type as LogisticsNode['type'],
        status: newNode.status as LogisticsNode['status']
      }
      
      dispatch(addNode(newNodeComplete))
      setIsAddNodeDialogOpen(false)
      setNewNode({
        name: '',
        address: '',
        coordinates: { lat: 0, lng: 0 },
        type: 'warehouse',
        status: 'active'
      })
    }
  }

  // 获取节点类型图标
  const getNodeTypeIcon = (type: LogisticsNode['type']) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-4 w-4" />
      case 'distribution':
        return <LayoutGrid className="h-4 w-4" />
      case 'transit':
        return <Truck className="h-4 w-4" />
      case 'customer':
        return <MapPin className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  // 获取节点类型中文名称
  const getNodeTypeName = (type: LogisticsNode['type']) => {
    switch (type) {
      case 'warehouse':
        return '仓库'
      case 'distribution':
        return '配送中心'
      case 'transit':
        return '中转站'
      case 'customer':
        return '客户'
      default:
        return '未知'
    }
  }

  // 获取节点状态徽章
  const getNodeStatusBadge = (status?: LogisticsNode['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">活跃</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">非活跃</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">维护中</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">物流地图</h1>
        <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              添加节点
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>添加物流节点</DialogTitle>
              <DialogDescription>
                在地图上点击选择位置，然后填写节点信息。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nodeName" className="text-right">
                  节点名称
                </Label>
                <Input
                  id="nodeName"
                  value={newNode.name}
                  onChange={(e) => setNewNode(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nodeAddress" className="text-right">
                  详细地址
                </Label>
                <Input
                  id="nodeAddress"
                  value={newNode.address}
                  onChange={(e) => setNewNode(prev => ({ ...prev, address: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">节点类型</Label>
                <Select
                  value={newNode.type}
                  onValueChange={(value) => setNewNode(prev => ({ ...prev, type: value as LogisticsNode['type'] }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择节点类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">仓库</SelectItem>
                    <SelectItem value="distribution">配送中心</SelectItem>
                    <SelectItem value="transit">中转站</SelectItem>
                    <SelectItem value="customer">客户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">状态</Label>
                <Select
                  value={newNode.status}
                  onValueChange={(value) => setNewNode(prev => ({ ...prev, status: value as LogisticsNode['status'] }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">非活跃</SelectItem>
                    <SelectItem value="maintenance">维护中</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">坐标</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    value={newNode.coordinates?.lat.toFixed(6) || ''}
                    onChange={(e) => setNewNode(prev => ({ 
                      ...prev, 
                      coordinates: { 
                        ...prev.coordinates!, 
                        lat: parseFloat(e.target.value) || 0 
                      } 
                    }))}
                    placeholder="纬度"
                  />
                  <Input
                    value={newNode.coordinates?.lng.toFixed(6) || ''}
                    onChange={(e) => setNewNode(prev => ({ 
                      ...prev, 
                      coordinates: { 
                        ...prev.coordinates!, 
                        lng: parseFloat(e.target.value) || 0 
                      } 
                    }))}
                    placeholder="经度"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddNodeDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-black hover:bg-gray-800" onClick={handleAddNode}>
                添加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>物流节点</CardTitle>
            <CardDescription>
              查看和管理物流网络中的节点
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索节点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
                <TabsTrigger value="warehouse" className="flex-1">仓库</TabsTrigger>
                <TabsTrigger value="transit" className="flex-1">中转站</TabsTrigger>
                <TabsTrigger value="customer" className="flex-1">客户</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedNode?.id === node.id ? 'border-black bg-gray-50' : ''
                      }`}
                      onClick={() => handleNodeClick(node)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          {getNodeTypeIcon(node.type)}
                        </div>
                        <div>
                          <p className="font-medium">{node.name}</p>
                          <p className="text-xs text-gray-500">{node.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getNodeStatusBadge(node.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="warehouse">
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredNodes
                    .filter(node => node.type === 'warehouse')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedNode?.id === node.id ? 'border-black bg-gray-50' : ''
                        }`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <Warehouse className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-gray-500">{node.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNodeStatusBadge(node.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="transit">
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredNodes
                    .filter(node => node.type === 'transit')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedNode?.id === node.id ? 'border-black bg-gray-50' : ''
                        }`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-gray-500">{node.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNodeStatusBadge(node.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="customer">
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredNodes
                    .filter(node => node.type === 'customer')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedNode?.id === node.id ? 'border-black bg-gray-50' : ''
                        }`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-gray-500">{node.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNodeStatusBadge(node.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>物流网络地图</CardTitle>
            <CardDescription>
              查看物流节点和路径的地理分布
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent
              nodes={nodes}
              routes={routes}
              center={mapCenter}
              zoom={mapZoom}
              height="600px"
              onNodeClick={handleNodeClick}
              onMapClick={handleMapClick}
            />
          </CardContent>
        </Card>
      </div>

      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>节点详情</CardTitle>
            <CardDescription>
              查看选中节点的详细信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">基本信息</h3>
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ID</span>
                    <span>{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">名称</span>
                    <span>{selectedNode.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">类型</span>
                    <span>{getNodeTypeName(selectedNode.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">状态</span>
                    <span>{getNodeStatusBadge(selectedNode.status)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">位置信息</h3>
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">地址</span>
                    <span>{selectedNode.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">坐标</span>
                    <span>
                      {selectedNode.coordinates.lat.toFixed(6)}, {selectedNode.coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}