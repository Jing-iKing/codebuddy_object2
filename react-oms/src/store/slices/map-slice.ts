import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import MapService from '@/services/map-service'

// 定义坐标类型
export interface Coordinates {
  lat: number
  lng: number
}

// 定义物流节点类型
export interface LogisticsNode {
  id: string
  name: string
  address: string
  coordinates: Coordinates
  type: 'warehouse' | 'distribution' | 'transit' | 'customer'
  capacity?: number
  status?: 'active' | 'inactive' | 'maintenance'
}

// 定义路径类型
export interface Route {
  id: string
  name: string
  startNodeId: string
  endNodeId: string
  distance: number
  estimatedTime: number
  waypoints: Coordinates[]
  color?: string
}

// 定义地图状态类型
interface MapState {
  nodes: LogisticsNode[]
  routes: Route[]
  selectedNode: LogisticsNode | null
  selectedRoute: Route | null
  mapCenter: Coordinates
  mapZoom: number
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: MapState = {
  nodes: [],
  routes: [],
  selectedNode: null,
  selectedRoute: null,
  mapCenter: { lat: 31.2304, lng: 121.4737 }, // 默认上海中心
  mapZoom: 5,
  loading: false,
  error: null
}

// 异步 thunk 获取所有物流节点
export const fetchAllNodes = createAsyncThunk(
  'map/fetchAllNodes',
  async (_, { rejectWithValue }) => {
    try {
      return await MapService.getAllLogisticsNodes()
    } catch (error) {
      return rejectWithValue('获取物流节点失败')
    }
  }
)

// 异步 thunk 获取特定类型的物流节点
export const fetchNodesByType = createAsyncThunk(
  'map/fetchNodesByType',
  async (type: LogisticsNode['type'], { rejectWithValue }) => {
    try {
      return await MapService.getNodesByType(type)
    } catch (error) {
      return rejectWithValue(`获取${type}类型节点失败`)
    }
  }
)

// 异步 thunk 获取两点之间的路径
export const fetchRoute = createAsyncThunk(
  'map/fetchRoute',
  async ({ startNodeId, endNodeId }: { startNodeId: string, endNodeId: string }, { rejectWithValue }) => {
    try {
      return await MapService.getRoute(startNodeId, endNodeId)
    } catch (error) {
      return rejectWithValue('获取路径失败')
    }
  }
)

// 异步 thunk 获取最优配送路径
export const fetchOptimalRoute = createAsyncThunk(
  'map/fetchOptimalRoute',
  async (nodeIds: string[], { rejectWithValue }) => {
    try {
      return await MapService.getOptimalDeliveryRoute(nodeIds)
    } catch (error) {
      return rejectWithValue('获取最优路径失败')
    }
  }
)

// 创建地图 slice
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // 设置选中的节点
    setSelectedNode: (state, action: PayloadAction<LogisticsNode | null>) => {
      state.selectedNode = action.payload
      if (action.payload) {
        state.mapCenter = action.payload.coordinates
        state.mapZoom = 14
      }
    },
    // 设置选中的路径
    setSelectedRoute: (state, action: PayloadAction<Route | null>) => {
      state.selectedRoute = action.payload
    },
    // 设置地图中心
    setMapCenter: (state, action: PayloadAction<Coordinates>) => {
      state.mapCenter = action.payload
    },
    // 设置地图缩放级别
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload
    },
    // 添加新节点
    addNode: (state, action: PayloadAction<LogisticsNode>) => {
      state.nodes.push(action.payload)
    },
    // 更新节点
    updateNode: (state, action: PayloadAction<LogisticsNode>) => {
      const index = state.nodes.findIndex(node => node.id === action.payload.id)
      if (index !== -1) {
        state.nodes[index] = action.payload
      }
    },
    // 删除节点
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload)
      if (state.selectedNode?.id === action.payload) {
        state.selectedNode = null
      }
    },
    // 添加路径
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload)
    },
    // 更新路径
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(route => route.id === action.payload.id)
      if (index !== -1) {
        state.routes[index] = action.payload
      }
    },
    // 删除路径
    removeRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(route => route.id !== action.payload)
      if (state.selectedRoute?.id === action.payload) {
        state.selectedRoute = null
      }
    },
    // 清除错误
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // 处理获取所有节点
    builder
      .addCase(fetchAllNodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllNodes.fulfilled, (state, action) => {
        state.loading = false
        state.nodes = action.payload
      })
      .addCase(fetchAllNodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取特定类型节点
    builder
      .addCase(fetchNodesByType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNodesByType.fulfilled, (state, action) => {
        state.loading = false
        state.nodes = action.payload
      })
      .addCase(fetchNodesByType.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取路径
    builder
      .addCase(fetchRoute.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoute.fulfilled, (state, action) => {
        state.loading = false
        state.routes = [action.payload]
      })
      .addCase(fetchRoute.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取最优路径
    builder
      .addCase(fetchOptimalRoute.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOptimalRoute.fulfilled, (state, action) => {
        state.loading = false
        state.routes = action.payload
      })
      .addCase(fetchOptimalRoute.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// 导出 actions
export const {
  setSelectedNode,
  setSelectedRoute,
  setMapCenter,
  setMapZoom,
  addNode,
  updateNode,
  removeNode,
  addRoute,
  updateRoute,
  removeRoute,
  clearError
} = mapSlice.actions

// 导出 reducer
export default mapSlice.reducer