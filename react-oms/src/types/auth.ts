// 定义权限类型
export type Permission = 
  // 订单权限
  | 'orders:view'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:delete'
  // 客户权限
  | 'customers:view'
  | 'customers:create'
  | 'customers:edit'
  | 'customers:delete'
  // 地址权限
  | 'addresses:view'
  | 'addresses:create'
  | 'addresses:edit'
  | 'addresses:delete'
  // 中转区域权限
  | 'transit:view'
  | 'transit:create'
  | 'transit:edit'
  | 'transit:delete'
  // 车辆权限
  | 'vehicles:view'
  | 'vehicles:create'
  | 'vehicles:edit'
  | 'vehicles:delete'
  // 广告权限
  | 'advertisements:view'
  | 'advertisements:create'
  | 'advertisements:edit'
  | 'advertisements:delete'
  // 消息权限
  | 'messages:view'
  | 'messages:create'
  | 'messages:edit'
  | 'messages:delete'
  // 地图权限
  | 'map:view'
  | 'map:edit'
  // 系统设置权限
  | 'settings:view'
  | 'settings:edit'
  // 用户管理权限
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  // 角色管理权限
  | 'roles:view'
  | 'roles:create'
  | 'roles:edit'
  | 'roles:delete'
  // 数据导入导出权限
  | 'data:import'
  | 'data:export'
  // 仪表盘权限
  | 'dashboard:view';

// 定义角色类型
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 定义用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  roleId: string;
  role?: Role;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// 定义认证状态类型
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  permissions: Permission[];
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 预定义角色
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: '系统管理员',
    description: '拥有系统所有权限',
    permissions: [
      'orders:view', 'orders:create', 'orders:edit', 'orders:delete',
      'customers:view', 'customers:create', 'customers:edit', 'customers:delete',
      'addresses:view', 'addresses:create', 'addresses:edit', 'addresses:delete',
      'transit:view', 'transit:create', 'transit:edit', 'transit:delete',
      'vehicles:view', 'vehicles:create', 'vehicles:edit', 'vehicles:delete',
      'advertisements:view', 'advertisements:create', 'advertisements:edit', 'advertisements:delete',
      'messages:view', 'messages:create', 'messages:edit', 'messages:delete',
      'map:view', 'map:edit',
      'settings:view', 'settings:edit',
      'users:view', 'users:create', 'users:edit', 'users:delete',
      'roles:view', 'roles:create', 'roles:edit', 'roles:delete',
      'data:import', 'data:export',
      'dashboard:view'
    ],
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'manager',
    name: '管理人员',
    description: '拥有大部分管理权限，但不能管理用户和角色',
    permissions: [
      'orders:view', 'orders:create', 'orders:edit', 'orders:delete',
      'customers:view', 'customers:create', 'customers:edit', 'customers:delete',
      'addresses:view', 'addresses:create', 'addresses:edit', 'addresses:delete',
      'transit:view', 'transit:create', 'transit:edit', 'transit:delete',
      'vehicles:view', 'vehicles:create', 'vehicles:edit', 'vehicles:delete',
      'advertisements:view', 'advertisements:create', 'advertisements:edit', 'advertisements:delete',
      'messages:view', 'messages:create', 'messages:edit', 'messages:delete',
      'map:view', 'map:edit',
      'settings:view',
      'data:import', 'data:export',
      'dashboard:view'
    ],
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'operator',
    name: '操作员',
    description: '负责日常订单和客户管理',
    permissions: [
      'orders:view', 'orders:create', 'orders:edit',
      'customers:view', 'customers:create', 'customers:edit',
      'addresses:view', 'addresses:create', 'addresses:edit',
      'transit:view', 'transit:edit',
      'vehicles:view',
      'messages:view', 'messages:create',
      'map:view',
      'data:export',
      'dashboard:view'
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'viewer',
    name: '查看者',
    description: '只有查看权限，不能修改数据',
    permissions: [
      'orders:view',
      'customers:view',
      'addresses:view',
      'transit:view',
      'vehicles:view',
      'advertisements:view',
      'messages:view',
      'map:view',
      'dashboard:view'
    ],
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];