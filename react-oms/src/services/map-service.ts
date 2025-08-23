import { get } from './api-client'

// 定义坐标类型
interface Coordinates {
  lat: number
  lng: number
}

// 定义地址类型
interface Address {
  id: string
  name: string
  address: string
  coordinates: Coordinates
  type: 'warehouse' | 'customer' | 'transit'
}

// 定义物流节点类型
interface LogisticsNode {
  id: string
  name: string
  address: string
  coordinates: Coordinates
  type: 'warehouse' | 'distribution' | 'transit' | 'customer'
  capacity?: number
  status?: 'active' | 'inactive' | 'maintenance'
}

// 定义路径类型
interface Route {
  id: string
  name: string
  startNodeId: string
  endNodeId: string
  distance: number
  estimatedTime: number
  waypoints: Coordinates[]
}

// 定义API响应类型
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// 地图服务
export const MapService = {
  // 获取所有地址
  getAllAddresses: async (): Promise<Address[]> => {
    return get<Address[]>('/map/addresses')
  },
  
  // 获取所有物流节点
  getAllLogisticsNodes: async (): Promise<LogisticsNode[]> => {
    return get<LogisticsNode[]>('/map/nodes')
  },
  
  // 获取特定类型的物流节点
  getNodesByType: async (type: LogisticsNode['type']): Promise<LogisticsNode[]> => {
    return get<LogisticsNode[]>(`/map/nodes/type/${type}`)
  },
  
  // 获取两点之间的路径
  getRoute: async (startNodeId: string, endNodeId: string): Promise<Route> => {
    return get<Route>('/map/route', { params: { startNodeId, endNodeId } })
  },
  
  // 获取最优配送路径（多点）
  getOptimalDeliveryRoute: async (nodeIds: string[]): Promise<Route[]> => {
    return get<Route[]>('/map/optimal-route', { params: { nodes: nodeIds.join(',') } })
  },
  
  // 地理编码：将地址转换为坐标
  geocode: async (address: string): Promise<Coordinates> => {
    return get<Coordinates>('/map/geocode', { params: { address } })
  },
  
  // 反向地理编码：将坐标转换为地址
  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    return get<string>('/map/reverse-geocode', { params: { lat, lng } })
  }
}

export default MapService