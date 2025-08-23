import { User, Role, Permission, PREDEFINED_ROLES } from '@/types/auth'
import { v4 as uuidv4 } from 'uuid'

// 生成随机日期（过去1年内）
const getRandomDate = (months: number = 12): string => {
  const now = new Date()
  const pastDate = new Date(now.setMonth(now.getMonth() - Math.floor(Math.random() * months)))
  return pastDate.toISOString()
}

// 生成模拟用户数据
export const generateMockUsers = (): User[] => {
  // 基础用户数据
  const baseUsers: Partial<User>[] = [
    {
      username: 'admin',
      email: 'admin@example.com',
      name: '系统管理员',
      roleId: 'admin',
      isActive: true,
    },
    {
      username: 'manager',
      email: 'manager@example.com',
      name: '张经理',
      roleId: 'manager',
      isActive: true,
    },
    {
      username: 'operator1',
      email: 'operator1@example.com',
      name: '李操作员',
      roleId: 'operator',
      isActive: true,
    },
    {
      username: 'operator2',
      email: 'operator2@example.com',
      name: '王操作员',
      roleId: 'operator',
      isActive: true,
    },
    {
      username: 'viewer',
      email: 'viewer@example.com',
      name: '赵查看员',
      roleId: 'viewer',
      isActive: true,
    },
    {
      username: 'logistics1',
      email: 'logistics1@example.com',
      name: '刘物流',
      roleId: 'operator',
      isActive: true,
    },
    {
      username: 'customer1',
      email: 'customer1@example.com',
      name: '陈客服',
      roleId: 'operator',
      isActive: true,
    },
    {
      username: 'finance1',
      email: 'finance1@example.com',
      name: '钱财务',
      roleId: 'manager',
      isActive: true,
    },
    {
      username: 'warehouse1',
      email: 'warehouse1@example.com',
      name: '孙仓管',
      roleId: 'operator',
      isActive: true,
    },
    {
      username: 'tech1',
      email: 'tech1@example.com',
      name: '周技术',
      roleId: 'manager',
      isActive: true,
    },
    {
      username: 'inactive1',
      email: 'inactive1@example.com',
      name: '吴离职',
      roleId: 'viewer',
      isActive: false,
    },
    {
      username: 'inactive2',
      email: 'inactive2@example.com',
      name: '郑停用',
      roleId: 'operator',
      isActive: false,
    }
  ]

  // 转换为完整的User对象
  return baseUsers.map(user => ({
    id: uuidv4(),
    username: user.username!,
    email: user.email!,
    name: user.name!,
    avatar: undefined,
    roleId: user.roleId!,
    isActive: user.isActive!,
    lastLogin: user.isActive ? getRandomDate(1) : getRandomDate(6),
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(3)
  }))
}

// 生成额外的角色数据
export const generateAdditionalRoles = (): Role[] => {
  const additionalRoles: Partial<Role>[] = [
    {
      id: 'logistics_manager',
      name: '物流主管',
      description: '负责物流运输和装载管理',
      permissions: [
        'orders:view', 'orders:edit',
        'transit:view', 'transit:create', 'transit:edit',
        'vehicles:view', 'vehicles:create', 'vehicles:edit',
        'map:view', 'map:edit',
        'dashboard:view'
      ],
      isDefault: false
    },
    {
      id: 'customer_service',
      name: '客户服务',
      description: '负责客户关系维护和订单跟进',
      permissions: [
        'orders:view', 'orders:edit',
        'customers:view', 'customers:edit',
        'messages:view', 'messages:create', 'messages:edit',
        'dashboard:view'
      ],
      isDefault: false
    },
    {
      id: 'warehouse_manager',
      name: '仓库管理员',
      description: '负责仓库和库存管理',
      permissions: [
        'orders:view',
        'transit:view', 'transit:edit',
        'vehicles:view',
        'dashboard:view'
      ],
      isDefault: false
    }
  ]

  // 转换为完整的Role对象
  return additionalRoles.map(role => ({
    id: role.id!,
    name: role.name!,
    description: role.description!,
    permissions: role.permissions as Permission[],
    isDefault: role.isDefault || false,
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(3)
  }))
}

// 合并预定义角色和额外角色
export const getAllMockRoles = (): Role[] => {
  return [...PREDEFINED_ROLES, ...generateAdditionalRoles()]
}

// 导出所有模拟数据
export const mockData = {
  users: generateMockUsers(),
  roles: getAllMockRoles()
}

export default mockData