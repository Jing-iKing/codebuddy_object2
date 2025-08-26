// 中转处理项数据模型
export interface TransitItem {
  id: string;
  productName: string;
  externalOrderId: string;
  transferOrderId?: string; // 转派单号
  length: number;
  width: number;
  height: number;
  weight: number;
  volume?: number; // 体积
  volumeWeight?: number; // 体积重
  quantity?: number; // 件数
  warehouseArea: string;
  arrivalDate?: string; // 到库日期
  customer: string;
  productStrategy?: string; // 货品策略
  deliveryZone?: string; // 配送分区
  recipientInfo?: {
    name: string;
    phone: string;
    address: string;
  }; // 收件信息
  advancePayment?: {
    amount: number;
    currency: 'RMB' | 'HKD' | 'MOP';
  }; // 垫付金额
  codAmount?: {
    amount: number;
    currency: 'RMB' | 'HKD' | 'MOP';
  }; // 代收货款
  checkAmount?: {
    amount: number;
    currency: 'RMB' | 'HKD' | 'MOP';
  }; // 代收支票额
  estimatedCost?: number; // 预计费用
  createdAt: string; // 创建日期
  status: string;
  arrivalTime: string;
}

// 中转区域数据模型（同时用于中转处理页面的tab和中转区域管理页面）
export interface TransitArea {
  id: string;
  name: string;
  code: string;
  isCommon: boolean;
  description: string;
  iconName: string; // 使用字符串表示图标名称，而不是直接嵌入JSX
  color: string;
  address: string;
  contactName: string;
  contactPhone: string;
  defaultStrategy: string;
  status: string;
}

// 中转处理状态类型
export type TransitStatus = '待处理' | '处理中' | '已完成';

// 货币类型
export type Currency = 'RMB' | 'HKD' | 'MOP';

// 货板相关类型定义
export interface Pallet {
  id: string;
  name: string;
  alias?: string;
  itemCount: number;
  status: 'available' | 'loading' | 'loaded' | 'shipping' | 'unloading';
  createdAt: string;
  items: PalletItem[];
}

export interface PalletItem {
  id: string;
  externalOrderId: string;
  arrivalDate: string;
  productName: string;
  customer: string;
  productStrategy: string;
  warehouseArea: string;
}

// 车次管理相关类型定义
export interface Vehicle {
  id: string;
  plateNumber: string;
  driver: string;
  phoneNumber: string;
  capacity: number;
  status: 'available' | 'loading' | 'shipping' | 'arrived' | 'maintenance';
  pallets: Pallet[];
  departureTime?: string;
  arrivalTime?: string;
  route?: string;
}

// 新建中转处理项表单数据
export interface NewTransitItemForm {
  productName: string;
  externalOrderId: string;
  transferOrderId?: string;
  length: string | number;
  width: string | number;
  height: string | number;
  weight: string | number;
  volume?: string | number;
  volumeWeight?: string | number;
  quantity?: string | number;
  warehouseArea: string;
  arrivalDate?: string;
  customer: string;
  productStrategy?: string;
  deliveryZone?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  advancePaymentAmount?: string | number;
  advancePaymentCurrency?: Currency;
  codAmount?: string | number;
  codCurrency?: Currency;
  checkAmount?: string | number;
  checkCurrency?: Currency;
  estimatedCost?: string | number;
  status: TransitStatus;
}

// 中转处理筛选条件
export interface TransitFilter {
  warehouseArea?: string;
  customer?: string;
  productStrategy?: string;
  deliveryZone?: string;
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}