import { Pallet, PalletItem } from '@/types/transit';

// 模拟货板数据
export const mockPallets: Pallet[] = [
  {
    id: "PLT-001",
    name: "货板A",
    alias: "电子产品专用",
    itemCount: 3,
    status: 'available',
    createdAt: "2025-08-20",
    items: [
      {
        id: "ITEM-001",
        externalOrderId: "EXT-12345",
        arrivalDate: "2025-08-15",
        productName: "电子元件",
        customer: "上海电子有限公司",
        productStrategy: "标准派送",
        warehouseArea: "A区-电子产品"
      },
      {
        id: "ITEM-002",
        externalOrderId: "EXT-23456",
        arrivalDate: "2025-08-16",
        productName: "办公用品",
        customer: "北京科技集团",
        productStrategy: "加急派送",
        warehouseArea: "B区-日用品"
      },
      {
        id: "ITEM-003",
        externalOrderId: "EXT-34567",
        arrivalDate: "2025-08-17",
        productName: "服装",
        customer: "广州贸易有限公司",
        productStrategy: "标准派送",
        warehouseArea: "C区-服装"
      }
    ]
  },
  {
    id: "PLT-002",
    name: "货板B",
    alias: "食品专用",
    itemCount: 2,
    status: 'loading',
    createdAt: "2025-08-21",
    items: [
      {
        id: "ITEM-004",
        externalOrderId: "EXT-45678",
        arrivalDate: "2025-08-18",
        productName: "食品",
        customer: "深圳电子科技",
        productStrategy: "冷链配送",
        warehouseArea: "D区-食品"
      },
      {
        id: "ITEM-005",
        externalOrderId: "EXT-56789",
        arrivalDate: "2025-08-19",
        productName: "电器",
        customer: "杭州网络科技",
        productStrategy: "大件配送",
        warehouseArea: "E区-大件"
      }
    ]
  },
  {
    id: "PLT-003",
    name: "货板C",
    alias: "轻小件专用",
    itemCount: 1,
    status: 'loaded',
    createdAt: "2025-08-22",
    items: [
      {
        id: "ITEM-006",
        externalOrderId: "EXT-67890",
        arrivalDate: "2025-08-20",
        productName: "图书",
        customer: "成都信息技术",
        productStrategy: "标准派送",
        warehouseArea: "F区-轻小件"
      }
    ]
  },
  {
    id: "PLT-004",
    name: "货板D",
    alias: "医疗设备专用",
    itemCount: 1,
    status: 'shipping',
    createdAt: "2025-08-23",
    items: [
      {
        id: "ITEM-007",
        externalOrderId: "EXT-78901",
        arrivalDate: "2025-08-21",
        productName: "医疗器械",
        customer: "武汉医疗设备",
        productStrategy: "特殊处理",
        warehouseArea: "G区-特殊物品"
      }
    ]
  },
  {
    id: "PLT-005",
    name: "货板E",
    alias: "化妆品专用",
    itemCount: 1,
    status: 'unloading',
    createdAt: "2025-08-24",
    items: [
      {
        id: "ITEM-008",
        externalOrderId: "EXT-89012",
        arrivalDate: "2025-08-22",
        productName: "化妆品",
        customer: "南京美容用品",
        productStrategy: "标准派送",
        warehouseArea: "B区-日用品"
      }
    ]
  }
];