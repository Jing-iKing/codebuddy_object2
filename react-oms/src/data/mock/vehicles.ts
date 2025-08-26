import { Vehicle } from '@/types/transit';
import { mockPallets } from './pallets';

// 模拟车辆数据
export const mockVehicles: Vehicle[] = [
  {
    id: "VEH-001",
    plateNumber: "粤B12345",
    driver: "张师傅",
    phoneNumber: "13800138001",
    capacity: 10,
    status: 'available',
    pallets: [],
    departureTime: undefined,
    arrivalTime: undefined,
    route: "珠海 → 澳门"
  },
  {
    id: "VEH-002",
    plateNumber: "粤B23456",
    driver: "李师傅",
    phoneNumber: "13800138002",
    capacity: 8,
    status: 'loading',
    pallets: [mockPallets[0]],
    departureTime: undefined,
    arrivalTime: undefined,
    route: "珠海 → 香港"
  },
  {
    id: "VEH-003",
    plateNumber: "粤B34567",
    driver: "王师傅",
    phoneNumber: "13800138003",
    capacity: 12,
    status: 'shipping',
    pallets: [mockPallets[2], mockPallets[3]],
    departureTime: "2025-08-23 08:30:00",
    arrivalTime: "2025-08-23 12:30:00",
    route: "珠海 → 深圳"
  },
  {
    id: "VEH-004",
    plateNumber: "粤B45678",
    driver: "赵师傅",
    phoneNumber: "13800138004",
    capacity: 15,
    status: 'arrived',
    pallets: [mockPallets[4]],
    departureTime: "2025-08-24 09:00:00",
    arrivalTime: "2025-08-24 11:00:00",
    route: "珠海 → 广州"
  },
  {
    id: "VEH-005",
    plateNumber: "粤B56789",
    driver: "钱师傅",
    phoneNumber: "13800138005",
    capacity: 6,
    status: 'maintenance',
    pallets: [],
    departureTime: undefined,
    arrivalTime: undefined,
    route: "珠海 → 佛山"
  }
];