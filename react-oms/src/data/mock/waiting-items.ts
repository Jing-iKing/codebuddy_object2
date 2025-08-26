import { TransitItem } from '@/types/transit';

// 待码货品示例数据
export const mockWaitingItems: TransitItem[] = [
  {
    id: "wait-001",
    externalOrderId: "EXT-2025-101",
    arrivalDate: "2025-08-23",
    productName: "会议桌",
    customer: "福州办公家具",
    productStrategy: "标准配送",
    warehouseArea: "C区",
    transferOrderId: "TRF-2025-101",
    length: 180,
    width: 90,
    height: 75,
    weight: 45.5,
    volume: 1215000,
    volumeWeight: 202.5,
    quantity: 1,
    deliveryZone: "福州-仓山区",
    recipientInfo: {
      name: "张经理",
      phone: "13812345678",
      address: "福州市仓山区金山大道100号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 2800,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 320.5,
    createdAt: "2025-08-22",
    status: "待处理",
    arrivalTime: "2025-08-23 09:30:00"
  },
  {
    id: "wait-002",
    externalOrderId: "EXT-2025-102",
    arrivalDate: "2025-08-24",
    productName: "沙发组合",
    customer: "厦门家居",
    productStrategy: "加急配送",
    warehouseArea: "D区",
    transferOrderId: "TRF-2025-102",
    length: 220,
    width: 90,
    height: 85,
    weight: 65.8,
    volume: 1683000,
    volumeWeight: 280.5,
    quantity: 1,
    deliveryZone: "厦门-思明区",
    recipientInfo: {
      name: "李总",
      phone: "13987654321",
      address: "厦门市思明区湖滨南路88号"
    },
    advancePayment: {
      amount: 500,
      currency: "RMB"
    },
    codAmount: {
      amount: 4500,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 450.8,
    createdAt: "2025-08-23",
    status: "待处理",
    arrivalTime: "2025-08-24 10:15:00"
  },
  {
    id: "wait-003",
    externalOrderId: "EXT-2025-103",
    arrivalDate: "2025-08-24",
    productName: "书架",
    customer: "泉州办公用品",
    productStrategy: "标准配送",
    warehouseArea: "B区",
    transferOrderId: "TRF-2025-103",
    length: 120,
    width: 40,
    height: 180,
    weight: 35.2,
    volume: 864000,
    volumeWeight: 144,
    quantity: 2,
    deliveryZone: "泉州-丰泽区",
    recipientInfo: {
      name: "王经理",
      phone: "13567891234",
      address: "泉州市丰泽区东海大街256号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 1800,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 220.5,
    createdAt: "2025-08-23",
    status: "待处理",
    arrivalTime: "2025-08-24 14:30:00"
  },
  {
    id: "wait-004",
    externalOrderId: "EXT-2025-104",
    arrivalDate: "2025-08-25",
    productName: "茶几",
    customer: "漳州家居",
    productStrategy: "优先配送",
    warehouseArea: "A区",
    transferOrderId: "TRF-2025-104",
    length: 100,
    width: 60,
    height: 45,
    weight: 18.5,
    volume: 270000,
    volumeWeight: 45,
    quantity: 1,
    deliveryZone: "漳州-芗城区",
    recipientInfo: {
      name: "赵小姐",
      phone: "13456789012",
      address: "漳州市芗城区胜利西路123号"
    },
    advancePayment: {
      amount: 200,
      currency: "RMB"
    },
    codAmount: {
      amount: 1200,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 180.3,
    createdAt: "2025-08-24",
    status: "待处理",
    arrivalTime: "2025-08-25 11:45:00"
  },
  {
    id: "wait-005",
    externalOrderId: "EXT-2025-105",
    arrivalDate: "2025-08-25",
    productName: "办公椅",
    customer: "龙岩办公设备",
    productStrategy: "标准配送",
    warehouseArea: "B区",
    transferOrderId: "TRF-2025-105",
    length: 60,
    width: 60,
    height: 95,
    weight: 12.5,
    volume: 342000,
    volumeWeight: 57,
    quantity: 4,
    deliveryZone: "龙岩-新罗区",
    recipientInfo: {
      name: "钱经理",
      phone: "13345678901",
      address: "龙岩市新罗区龙腾路56号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 2400,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 260.8,
    createdAt: "2025-08-24",
    status: "待处理",
    arrivalTime: "2025-08-25 15:20:00"
  }
];