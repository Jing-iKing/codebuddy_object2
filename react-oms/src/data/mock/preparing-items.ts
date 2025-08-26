import { PalletItem } from '@/types/transit';

// 装板准备区示例数据
export const mockPreparingItems: PalletItem[] = [
  {
    id: "prep-001",
    externalOrderId: "EXT-2025-001",
    arrivalDate: "2025-08-20",
    productName: "高级办公椅",
    customer: "南平科技有限公司",
    productStrategy: "优先配送",
    warehouseArea: "A区"
  },
  {
    id: "prep-002",
    externalOrderId: "EXT-2025-002",
    arrivalDate: "2025-08-21",
    productName: "办公桌",
    customer: "福州电子科技",
    productStrategy: "标准配送",
    warehouseArea: "B区"
  },
  {
    id: "prep-003",
    externalOrderId: "EXT-2025-003",
    arrivalDate: "2025-08-22",
    productName: "文件柜",
    customer: "厦门办公用品",
    productStrategy: "优先配送",
    warehouseArea: "A区"
  },
  {
    id: "prep-004",
    externalOrderId: "EXT-2025-004",
    arrivalDate: "2025-08-23",
    productName: "电脑显示器",
    customer: "泉州科技",
    productStrategy: "加急配送",
    warehouseArea: "C区"
  }
];