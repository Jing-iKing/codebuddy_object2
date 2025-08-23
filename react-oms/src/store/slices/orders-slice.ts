import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

// 订单状态类型
export type OrderStatus = '待处理' | '处理中' | '已完成' | '已取消'

// 订单类型定义
export interface Order {
  id: string
  productName: string
  externalOrderId: string
  weight: string
  dimensions: string
  quantity: number
  arrivalDate: string
  customer: string
  strategy: string
  recipientInfo: string
  status: OrderStatus
}

// 订单详情类型定义
export interface OrderDetail extends Order {
  length: string
  width: string
  height: string
  customerContact: string
  recipientName: string
  recipientAddress: string
  recipientPhone: string
  createdAt: string
  updatedAt: string
  trackingNumber: string
  paymentStatus: string
  paymentAmount: string
  notes: string
  history: Array<{
    time: string
    status: string
    operator: string
    note: string
  }>
  documents: Array<{
    name: string
    type: string
    size: string
    date: string
  }>
}

// 订单状态接口
interface OrdersState {
  orders: Order[]
  currentOrder: OrderDetail | null
  loading: boolean
  error: string | null
  filters: {
    status: string | null
    customer: string | null
    strategy: string | null
    dateRange: {
      start: string | null
      end: string | null
    }
  }
  pagination: {
    currentPage: number
    totalPages: number
    itemsPerPage: number
  }
}

// 初始状态
const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    customer: null,
    strategy: null,
    dateRange: {
      start: null,
      end: null
    }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  }
}

// 模拟数据 - 在实际应用中，这些数据会从API获取
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    productName: "电子元件",
    externalOrderId: "EXT-12345",
    weight: "5.2kg",
    dimensions: "30×20×15cm",
    quantity: 10,
    arrivalDate: "2025-08-15",
    customer: "上海电子有限公司",
    strategy: "标准配送",
    recipientInfo: "张三, 上海市浦东新区张江高科技园区, 13800138000",
    status: "已完成"
  },
  {
    id: "ORD-002",
    productName: "办公用品",
    externalOrderId: "EXT-23456",
    weight: "2.1kg",
    dimensions: "40×30×10cm",
    quantity: 5,
    arrivalDate: "2025-08-16",
    customer: "北京科技集团",
    strategy: "加急配送",
    recipientInfo: "李四, 北京市海淀区中关村, 13900139000",
    status: "处理中"
  },
  {
    id: "ORD-003",
    productName: "服装",
    externalOrderId: "EXT-34567",
    weight: "1.5kg",
    dimensions: "25×20×10cm",
    quantity: 20,
    arrivalDate: "2025-08-17",
    customer: "广州贸易有限公司",
    strategy: "经济配送",
    recipientInfo: "王五, 广州市天河区珠江新城, 13700137000",
    status: "待处理"
  },
  {
    id: "ORD-004",
    productName: "食品",
    externalOrderId: "EXT-45678",
    weight: "8.3kg",
    dimensions: "50×40×30cm",
    quantity: 2,
    arrivalDate: "2025-08-18",
    customer: "深圳电子科技",
    strategy: "冷链配送",
    recipientInfo: "赵六, 深圳市南山区科技园, 13600136000",
    status: "已取消"
  },
  {
    id: "ORD-005",
    productName: "电器",
    externalOrderId: "EXT-56789",
    weight: "15.7kg",
    dimensions: "60×50×40cm",
    quantity: 1,
    arrivalDate: "2025-08-19",
    customer: "杭州网络科技",
    strategy: "大件配送",
    recipientInfo: "钱七, 杭州市西湖区文三路, 13500135000",
    status: "已完成"
  },
  {
    id: "ORD-006",
    productName: "图书",
    externalOrderId: "EXT-67890",
    weight: "3.2kg",
    dimensions: "30×20×10cm",
    quantity: 15,
    arrivalDate: "2025-08-20",
    customer: "成都信息技术",
    strategy: "标准配送",
    recipientInfo: "孙八, 成都市高新区天府大道, 13400134000",
    status: "处理中"
  },
  {
    id: "ORD-007",
    productName: "医疗器械",
    externalOrderId: "EXT-78901",
    weight: "4.5kg",
    dimensions: "35×25×15cm",
    quantity: 3,
    arrivalDate: "2025-08-21",
    customer: "武汉医疗设备",
    strategy: "加急配送",
    recipientInfo: "周九, 武汉市江汉区解放大道, 13300133000",
    status: "待处理"
  },
  {
    id: "ORD-008",
    productName: "化妆品",
    externalOrderId: "EXT-89012",
    weight: "1.8kg",
    dimensions: "20×15×10cm",
    quantity: 8,
    arrivalDate: "2025-08-22",
    customer: "南京美容用品",
    strategy: "标准配送",
    recipientInfo: "吴十, 南京市鼓楼区中山路, 13200132000",
    status: "已完成"
  }
]

// 模拟订单详情数据
const mockOrderDetail: OrderDetail = {
  id: "ORD-001",
  productName: "电子元件",
  externalOrderId: "EXT-12345",
  weight: "5.2kg",
  dimensions: "30×20×15cm",
  length: "30cm",
  width: "20cm",
  height: "15cm",
  quantity: 10,
  arrivalDate: "2025-08-15",
  customer: "上海电子有限公司",
  customerContact: "张经理 (13800138000)",
  strategy: "标准配送",
  recipientName: "张三",
  recipientAddress: "上海市浦东新区张江高科技园区",
  recipientPhone: "13800138000",
  recipientInfo: "张三, 上海市浦东新区张江高科技园区, 13800138000",
  status: "已完成",
  createdAt: "2025-08-10 09:15:23",
  updatedAt: "2025-08-15 14:30:45",
  trackingNumber: "SF1234567890",
  paymentStatus: "已支付",
  paymentAmount: "¥350.00",
  notes: "客户要求在工作日送达，需要提前电话联系",
  history: [
    { time: "2025-08-10 09:15:23", status: "订单创建", operator: "系统", note: "客户通过系统创建订单" },
    { time: "2025-08-10 10:30:45", status: "订单确认", operator: "李客服", note: "电话确认订单信息" },
    { time: "2025-08-12 08:45:12", status: "开始处理", operator: "王仓管", note: "订单进入处理流程" },
    { time: "2025-08-13 14:20:36", status: "打包完成", operator: "赵包装", note: "货物已完成包装" },
    { time: "2025-08-14 09:05:28", status: "开始配送", operator: "钱配送", note: "货物已出库，开始配送" },
    { time: "2025-08-15 14:30:45", status: "配送完成", operator: "孙快递", note: "客户已签收" }
  ],
  documents: [
    { name: "订单确认单", type: "PDF", size: "1.2MB", date: "2025-08-10" },
    { name: "发货单", type: "PDF", size: "0.8MB", date: "2025-08-14" },
    { name: "签收单", type: "JPG", size: "2.5MB", date: "2025-08-15" }
  ]
}

// 异步 thunk 用于获取订单列表
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会是一个API调用
      // const response = await api.get('/orders');
      // return response.data;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOrders;
    } catch (error) {
      return rejectWithValue('获取订单列表失败');
    }
  }
)

// 异步 thunk 用于获取订单详情
export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会是一个API调用
      // const response = await api.get(`/orders/${orderId}`);
      // return response.data;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟根据ID获取订单详情
      // 实际应用中会根据orderId从API获取特定订单
      return mockOrderDetail;
    } catch (error) {
      return rejectWithValue('获取订单详情失败');
    }
  }
)

// 异步 thunk 用于更新订单状态
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string, status: OrderStatus }, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会是一个API调用
      // const response = await api.put(`/orders/${orderId}/status`, { status });
      // return response.data;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟更新成功
      return { orderId, status };
    } catch (error) {
      return rejectWithValue('更新订单状态失败');
    }
  }
)

// 创建订单slice
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // 设置筛选条件
    setFilter: (state, action: PayloadAction<{ key: string, value: string | null }>) => {
      const { key, value } = action.payload;
      if (key === 'status' || key === 'customer' || key === 'strategy') {
        state.filters[key] = value;
      }
      // 重置到第一页
      state.pagination.currentPage = 1;
    },
    
    // 设置日期范围筛选
    setDateRangeFilter: (state, action: PayloadAction<{ start: string | null, end: string | null }>) => {
      state.filters.dateRange = action.payload;
      // 重置到第一页
      state.pagination.currentPage = 1;
    },
    
    // 重置所有筛选条件
    resetFilters: (state) => {
      state.filters = {
        status: null,
        customer: null,
        strategy: null,
        dateRange: {
          start: null,
          end: null
        }
      };
      // 重置到第一页
      state.pagination.currentPage = 1;
    },
    
    // 设置当前页码
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    // 设置每页显示数量
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      // 重置到第一页
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    // 处理获取订单列表
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // 处理获取订单详情
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // 处理更新订单状态
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId, status } = action.payload;
        
        // 更新订单列表中的状态
        const orderIndex = state.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
        }
        
        // 更新当前订单状态（如果正在查看该订单）
        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder.status = status;
          state.currentOrder.updatedAt = new Date().toLocaleString();
          
          // 添加新的历史记录
          state.currentOrder.history.push({
            time: new Date().toLocaleString(),
            status: `状态更新为: ${status}`,
            operator: '当前用户', // 实际应用中应该使用真实的用户信息
            note: '通过系统更新状态'
          });
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
})

// 导出actions
export const { 
  setFilter, 
  setDateRangeFilter, 
  resetFilters, 
  setCurrentPage, 
  setItemsPerPage 
} = ordersSlice.actions

// 选择器
export const selectOrders = (state: RootState) => state.orders.orders
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder
export const selectOrdersLoading = (state: RootState) => state.orders.loading
export const selectOrdersError = (state: RootState) => state.orders.error
export const selectOrdersFilters = (state: RootState) => state.orders.filters
export const selectOrdersPagination = (state: RootState) => state.orders.pagination

// 导出reducer
export default ordersSlice.reducer