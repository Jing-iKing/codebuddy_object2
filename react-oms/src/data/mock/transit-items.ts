import { TransitItem } from '@/types/transit';

export const mockTransitItems: TransitItem[] = [
  {
    id: "ITEM-001",
    productName: "电子元件",
    externalOrderId: "EXT-12345",
    transferOrderId: "TRF-98765",
    length: 30,
    width: 20,
    height: 15,
    weight: 5.2,
    volume: 9000, // 30*20*15 = 9000 cm³
    volumeWeight: 1.5, // 体积重 (体积/6000)
    quantity: 2,
    warehouseArea: "A区-电子产品",
    arrivalDate: "2025-08-15",
    customer: "上海电子有限公司",
    productStrategy: "标准派送",
    deliveryZone: "上海-浦东新区",
    recipientInfo: {
      name: "张三",
      phone: "13812345678",
      address: "上海市浦东新区张杨路500号"
    },
    advancePayment: {
      amount: 120,
      currency: "RMB"
    },
    codAmount: {
      amount: 500,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 45.5,
    createdAt: "2025-08-14",
    status: "待处理",
    arrivalTime: "2025-08-15 09:30:45"
  },
  {
    id: "ITEM-002",
    productName: "办公用品",
    externalOrderId: "EXT-23456",
    transferOrderId: "TRF-87654",
    length: 40,
    width: 30,
    height: 10,
    weight: 2.1,
    volume: 12000, // 40*30*10 = 12000 cm³
    volumeWeight: 2,
    quantity: 1,
    warehouseArea: "B区-日用品",
    arrivalDate: "2025-08-16",
    customer: "北京科技集团",
    productStrategy: "加急派送",
    deliveryZone: "北京-海淀区",
    recipientInfo: {
      name: "李四",
      phone: "13987654321",
      address: "北京市海淀区中关村南大街5号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 300,
      currency: "RMB"
    },
    checkAmount: {
      amount: 1000,
      currency: "RMB"
    },
    estimatedCost: 65.8,
    createdAt: "2025-08-15",
    status: "处理中",
    arrivalTime: "2025-08-16 10:15:22"
  },
  {
    id: "ITEM-003",
    productName: "服装",
    externalOrderId: "EXT-34567",
    transferOrderId: "TRF-76543",
    length: 25,
    width: 20,
    height: 10,
    weight: 1.5,
    volume: 5000, // 25*20*10 = 5000 cm³
    volumeWeight: 0.83,
    quantity: 3,
    warehouseArea: "C区-服装",
    arrivalDate: "2025-08-17",
    customer: "广州贸易有限公司",
    productStrategy: "标准派送",
    deliveryZone: "广州-天河区",
    recipientInfo: {
      name: "王五",
      phone: "13567891234",
      address: "广州市天河区天河路385号"
    },
    advancePayment: {
      amount: 200,
      currency: "RMB"
    },
    codAmount: {
      amount: 0,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 35.2,
    createdAt: "2025-08-16",
    status: "已完成",
    arrivalTime: "2025-08-17 14:45:30"
  },
  {
    id: "ITEM-004",
    productName: "食品",
    externalOrderId: "EXT-45678",
    transferOrderId: "TRF-65432",
    length: 50,
    width: 40,
    height: 30,
    weight: 8.3,
    volume: 60000, // 50*40*30 = 60000 cm³
    volumeWeight: 10,
    quantity: 5,
    warehouseArea: "D区-食品",
    arrivalDate: "2025-08-18",
    customer: "深圳电子科技",
    productStrategy: "冷链配送",
    deliveryZone: "深圳-南山区",
    recipientInfo: {
      name: "赵六",
      phone: "13456789012",
      address: "深圳市南山区科技园路1号"
    },
    advancePayment: {
      amount: 500,
      currency: "HKD"
    },
    codAmount: {
      amount: 1200,
      currency: "HKD"
    },
    checkAmount: {
      amount: 0,
      currency: "HKD"
    },
    estimatedCost: 120.5,
    createdAt: "2025-08-17",
    status: "待处理",
    arrivalTime: "2025-08-18 08:20:15"
  },
  {
    id: "ITEM-005",
    productName: "电器",
    externalOrderId: "EXT-56789",
    transferOrderId: "TRF-54321",
    length: 60,
    width: 50,
    height: 40,
    weight: 15.7,
    volume: 120000, // 60*50*40 = 120000 cm³
    volumeWeight: 20,
    quantity: 1,
    warehouseArea: "E区-大件",
    arrivalDate: "2025-08-19",
    customer: "杭州网络科技",
    productStrategy: "大件配送",
    deliveryZone: "杭州-西湖区",
    recipientInfo: {
      name: "钱七",
      phone: "13345678901",
      address: "杭州市西湖区文三路478号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 3500,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 180.3,
    createdAt: "2025-08-18",
    status: "处理中",
    arrivalTime: "2025-08-19 11:10:05"
  },
  {
    id: "ITEM-006",
    productName: "图书",
    externalOrderId: "EXT-67890",
    transferOrderId: "TRF-43210",
    length: 30,
    width: 20,
    height: 10,
    weight: 3.2,
    volume: 6000, // 30*20*10 = 6000 cm³
    volumeWeight: 1,
    quantity: 10,
    warehouseArea: "F区-轻小件",
    arrivalDate: "2025-08-20",
    customer: "成都信息技术",
    productStrategy: "标准派送",
    deliveryZone: "成都-武侯区",
    recipientInfo: {
      name: "孙八",
      phone: "13234567890",
      address: "成都市武侯区人民南路四段12号"
    },
    advancePayment: {
      amount: 150,
      currency: "RMB"
    },
    codAmount: {
      amount: 450,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 42.6,
    createdAt: "2025-08-19",
    status: "已完成",
    arrivalTime: "2025-08-20 16:35:40"
  },
  {
    id: "ITEM-007",
    productName: "医疗器械",
    externalOrderId: "EXT-78901",
    transferOrderId: "TRF-32109",
    length: 35,
    width: 25,
    height: 15,
    weight: 4.5,
    volume: 13125, // 35*25*15 = 13125 cm³
    volumeWeight: 2.19,
    quantity: 2,
    warehouseArea: "G区-特殊物品",
    arrivalDate: "2025-08-21",
    customer: "武汉医疗设备",
    productStrategy: "特殊处理",
    deliveryZone: "武汉-江汉区",
    recipientInfo: {
      name: "周九",
      phone: "13123456789",
      address: "武汉市江汉区解放大道688号"
    },
    advancePayment: {
      amount: 800,
      currency: "RMB"
    },
    codAmount: {
      amount: 2000,
      currency: "RMB"
    },
    checkAmount: {
      amount: 5000,
      currency: "RMB"
    },
    estimatedCost: 95.7,
    createdAt: "2025-08-20",
    status: "待处理",
    arrivalTime: "2025-08-21 09:50:25"
  },
  {
    id: "ITEM-008",
    productName: "化妆品",
    externalOrderId: "EXT-89012",
    transferOrderId: "TRF-21098",
    length: 20,
    width: 15,
    height: 10,
    weight: 1.8,
    volume: 3000, // 20*15*10 = 3000 cm³
    volumeWeight: 0.5,
    quantity: 4,
    warehouseArea: "B区-日用品",
    arrivalDate: "2025-08-22",
    customer: "南京美容用品",
    productStrategy: "标准派送",
    deliveryZone: "南京-鼓楼区",
    recipientInfo: {
      name: "吴十",
      phone: "13012345678",
      address: "南京市鼓楼区中山北路123号"
    },
    advancePayment: {
      amount: 0,
      currency: "RMB"
    },
    codAmount: {
      amount: 680,
      currency: "RMB"
    },
    checkAmount: {
      amount: 0,
      currency: "RMB"
    },
    estimatedCost: 38.9,
    createdAt: "2025-08-21",
    status: "已完成",
    arrivalTime: "2025-08-22 13:25:55"
  }
];