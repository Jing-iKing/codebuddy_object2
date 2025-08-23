import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { cn } from '@/lib/utils'

// 修复Leaflet默认图标问题
// 在React应用中，Leaflet的默认图标路径会有问题，需要手动设置
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

// 定义坐标类型
export interface Coordinates {
  lat: number
  lng: number
}

// 定义节点类型
export interface MapNode {
  id: string
  name: string
  address: string
  coordinates: Coordinates
  type: 'warehouse' | 'distribution' | 'transit' | 'customer'
  status?: 'active' | 'inactive' | 'maintenance'
}

// 定义路径类型
export interface MapRoute {
  id: string
  name: string
  startNodeId: string
  endNodeId: string
  waypoints: Coordinates[]
  color?: string
}

// 地图视图调整组件
interface MapViewProps {
  center: Coordinates
  zoom: number
}

function MapView({ center, zoom }: MapViewProps) {
  const map = useMap()
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center, zoom, map])
  
  return null
}

// 地图容器组件属性
interface MapComponentProps {
  nodes?: MapNode[]
  routes?: MapRoute[]
  center?: Coordinates
  zoom?: number
  height?: string
  width?: string
  className?: string
  onNodeClick?: (node: MapNode) => void
  onMapClick?: (coordinates: Coordinates) => void
}

// 获取节点图标
const getNodeIcon = (type: MapNode['type'], status?: MapNode['status']) => {
  // 根据节点类型和状态返回不同的图标
  const iconUrl = (() => {
    switch (type) {
      case 'warehouse':
        return 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' // 仓库图标
      case 'distribution':
        return 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png' // 配送中心图标
      case 'transit':
        return 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' // 中转站图标
      case 'customer':
        return 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' // 客户图标
      default:
        return 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png'
    }
  })()

  return L.icon({
    iconUrl,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

// 地图组件
export function MapComponent({
  nodes = [],
  routes = [],
  center = { lat: 31.2304, lng: 121.4737 }, // 默认上海中心
  zoom = 12,
  height = '500px',
  width = '100%',
  className = '',
  onNodeClick,
  onMapClick
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  
  // 处理地图点击事件
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onMapClick) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  }

  return (
    <div style={{ height, width }} className={cn('rounded-md border', className)}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={(event) => {
          const map = event.target
          mapRef.current = map
          if (onMapClick) {
            map.on('click', handleMapClick)
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 渲染节点 */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.coordinates.lat, node.coordinates.lng]}
            icon={getNodeIcon(node.type, node.status)}
            eventHandlers={{
              click: () => {
                if (onNodeClick) {
                  onNodeClick(node)
                }
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{node.name}</h3>
                <p className="text-sm text-gray-600">{node.address}</p>
                <p className="text-xs text-gray-500">类型: {node.type}</p>
                {node.status && <p className="text-xs text-gray-500">状态: {node.status}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 渲染路径 */}
        {routes.map((route) => {
          // 在实际应用中，这里会使用Polyline组件绘制路径
          // 由于需要起点和终点节点信息，这里简化处理
          const startNode = nodes.find(node => node.id === route.startNodeId)
          const endNode = nodes.find(node => node.id === route.endNodeId)
          
          if (!startNode || !endNode) return null
          
          return (
            <div key={route.id}>
              {/* 这里应该使用Polyline组件，但为了简化示例，这里省略 */}
            </div>
          )
        })}
        
        <MapView center={center} zoom={zoom} />
      </MapContainer>
    </div>
  )
}