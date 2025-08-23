import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index'

// 仪表盘数据类型
interface DashboardState {
  summary: {
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    completedOrders: number
    cancelledOrders: number
    totalCustomers: number
    totalRevenue: string
  }
  orderTrends: Array<{
    date: string
    orders: number
  }>
  ordersByStatus: Array<{
    name: string
    value: number
  }>
  ordersByCustomer: Array<{
    name: string
    value: number
  }>
  recentOrders: Array<{
    id: string
    productName: string
    customer: string
    date: string
    status: string
  }>
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: DashboardState = {
  summary: {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalCustomers: 0,
    totalRevenue: '¥0.00'
  },
  orderTrends: [],
  ordersByStatus: [],
  ordersByCustomer: [],
  recentOrders: [],
  loading: false,
  error: null
}

// 模拟仪表盘数据
const mockDashboardData = {
  summary: {
    totalOrders: 1248,
    pendingOrders: 156,
    processingOrders: 243,
    completedOrders: 821,
    cancelledOrders: 28,
    totalCustomers: 385,
    totalRevenue: '¥1,256,890.00'
  },
  orderTrends: [
    { date: '2025-08-01', orders: 42 },
    { date: '2025-08-02', orders: 38 },
    { date: '2025-08-03', orders: 35 },
    { date: '2025-08-04', orders: 40 },
    { date: '2025-08-05', orders: 45 },
    { date: '2025-08-06', orders: 48 },
    { date: '2025-08-07', orders: 52 },
    { date: '2025-08-08', orders: 49 },
    { date: '2025-08-09', orders: 55 },
    { date: '2025-08-10', orders: 60 },
    { date: '2025-08-11', orders: 58 },
    { date: '2025-08-12', orders: 64 },
    { date: '2025-08-13', orders: 68 },
    { date: '2025-08-14', orders: 72 },
    { date: '2025-08-15', orders: 75 },
    { date: '2025-08-16', orders: 70 },
    { date: '2025-08-17', orders: 68 },
    { date: '2025-08-18', orders: 65 },
    { date: '2025-08-19', orders: 60 },
    { date: '2025-08-20', orders: 62 },
    { date: '2025-08-21', orders: 65 },
    { date: '2025-08-22', orders: 68 },
    { date: '2025-08-23', orders: 70 }
  ],
  ordersByStatus: [
    { name: '待处理', value: 156 },
    { name: '处理中', value: 243 },
    { name: '已完成', value: 821 },
    { name: '已取消', value: 28 }
  ],
  ordersByCustomer: [
    { name: '上海电子有限公司', value: 245 },
    { name: '北京科技集团', value: 187 },
    { name: '广州贸易有限公司', value: 156 },
    { name: '深圳电子科技', value: 132 },
    { name: '杭州网络科技', value: 98 },
    { name: '其他客户', value: 430 }
  ],
  recentOrders: [
    { id: 'ORD-001', productName: '电子元件', customer: '上海电子有限公司', date: '2025-08-15', status: '已完成' },
    { id: 'ORD-002', productName: '办公用品', customer: '北京科技集团', date: '2025-08-16', status: '处理中' },
    { id: 'ORD-003', productName: '服装', customer: '广州贸易有限公司', date: '2025-08-17', status: '待处理' },
    { id: 'ORD-004', productName: '食品', customer: '深圳电子科技', date: '2025-08-18', status: '已取消' },
    { id: 'ORD-005', productName: '电器', customer: '杭州网络科技', date: '2025-08-19', status: '已完成' }
  ]
}

// 异步 thunk 用于获取仪表盘数据
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会是一个API调用
      // const response = await api.get('/dashboard');
      // return response.data;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockDashboardData;
    } catch (error) {
      return rejectWithValue('获取仪表盘数据失败');
    }
  }
)

// 创建仪表盘slice
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.orderTrends = action.payload.orderTrends;
        state.ordersByStatus = action.payload.ordersByStatus;
        state.ordersByCustomer = action.payload.ordersByCustomer;
        state.recentOrders = action.payload.recentOrders;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
})

// 选择器
export const selectDashboardSummary = (state: RootState) => state.dashboard.summary
export const selectOrderTrends = (state: RootState) => state.dashboard.orderTrends
export const selectOrdersByStatus = (state: RootState) => state.dashboard.ordersByStatus
export const selectOrdersByCustomer = (state: RootState) => state.dashboard.ordersByCustomer
export const selectRecentOrders = (state: RootState) => state.dashboard.recentOrders
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading
export const selectDashboardError = (state: RootState) => state.dashboard.error

// 导出reducer
export default dashboardSlice.reducer