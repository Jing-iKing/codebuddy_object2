import { get, post, put, del } from './api-client'
import { Order, OrderDetail } from '@/store/slices/orders-slice'

// 定义API响应类型
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// 定义分页响应类型
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 定义查询参数类型
interface OrderQueryParams {
  page?: number
  limit?: number
  status?: string
  customer?: string
  strategy?: string
  startDate?: string
  endDate?: string
  search?: string
}

// 订单API服务
export const OrdersService = {
  // 获取订单列表
  getOrders: async (params: OrderQueryParams = {}): Promise<PaginatedResponse<Order>> => {
    return get<PaginatedResponse<Order>>('/orders', { params })
  },
  
  // 获取订单详情
  getOrderById: async (id: string): Promise<OrderDetail> => {
    return get<OrderDetail>(`/orders/${id}`)
  },
  
  // 创建订单
  createOrder: async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    return post<ApiResponse<Order>>('/orders', orderData)
  },
  
  // 更新订单
  updateOrder: async (id: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    return put<ApiResponse<Order>>(`/orders/${id}`, orderData)
  },
  
  // 更新订单状态
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return put<ApiResponse<Order>>(`/orders/${id}/status`, { status })
  },
  
  // 删除订单
  deleteOrder: async (id: string): Promise<ApiResponse<null>> => {
    return del<ApiResponse<null>>(`/orders/${id}`)
  },
  
  // 批量更新订单状态
  bulkUpdateStatus: async (ids: string[], status: string): Promise<ApiResponse<null>> => {
    return put<ApiResponse<null>>('/orders/bulk/status', { ids, status })
  },
  
  // 导出订单
  exportOrders: async (params: OrderQueryParams = {}): Promise<Blob> => {
    return get<Blob>('/orders/export', { 
      params,
      responseType: 'blob'
    })
  }
}

export default OrdersService