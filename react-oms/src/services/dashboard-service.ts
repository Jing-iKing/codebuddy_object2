import { get } from './api-client'

// 定义仪表盘数据类型
interface DashboardSummary {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalCustomers: number
  totalRevenue: string
}

interface OrderTrend {
  date: string
  orders: number
}

interface OrderByStatus {
  name: string
  value: number
}

interface OrderByCustomer {
  name: string
  value: number
}

interface RecentOrder {
  id: string
  productName: string
  customer: string
  date: string
  status: string
}

// 完整的仪表盘数据接口
interface DashboardData {
  summary: DashboardSummary
  orderTrends: OrderTrend[]
  ordersByStatus: OrderByStatus[]
  ordersByCustomer: OrderByCustomer[]
  recentOrders: RecentOrder[]
}

// 仪表盘API服务
export const DashboardService = {
  // 获取仪表盘数据
  getDashboardData: async (): Promise<DashboardData> => {
    return get<DashboardData>('/dashboard')
  },
  
  // 获取仪表盘摘要数据
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    return get<DashboardSummary>('/dashboard/summary')
  },
  
  // 获取订单趋势数据
  getOrderTrends: async (days: number = 30): Promise<OrderTrend[]> => {
    return get<OrderTrend[]>('/dashboard/trends', { params: { days } })
  },
  
  // 获取按状态分类的订单数据
  getOrdersByStatus: async (): Promise<OrderByStatus[]> => {
    return get<OrderByStatus[]>('/dashboard/by-status')
  },
  
  // 获取按客户分类的订单数据
  getOrdersByCustomer: async (limit: number = 5): Promise<OrderByCustomer[]> => {
    return get<OrderByCustomer[]>('/dashboard/by-customer', { params: { limit } })
  },
  
  // 获取最近订单
  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    return get<RecentOrder[]>('/dashboard/recent-orders', { params: { limit } })
  }
}

export default DashboardService