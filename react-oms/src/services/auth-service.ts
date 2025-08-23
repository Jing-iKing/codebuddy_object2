import { post, get, put, del } from './api-client'
import { User, Role, Permission } from '@/types/auth'

// 定义登录请求参数
interface LoginRequest {
  username: string
  password: string
}

// 定义登录响应
interface LoginResponse {
  user: User
  role: Role
  permissions: Permission[]
  token: string
}

// 定义API响应类型
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// 定义用户创建/更新请求
interface UserRequest {
  username: string
  email: string
  name: string
  password?: string
  roleId: string
  isActive: boolean
}

// 定义角色创建/更新请求
interface RoleRequest {
  name: string
  description: string
  permissions: Permission[]
  isDefault?: boolean
}

// 认证API服务
export const AuthService = {
  // 登录
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return post<LoginResponse>('/auth/login', credentials)
  },
  
  // 登出
  logout: async (): Promise<ApiResponse<null>> => {
    return post<ApiResponse<null>>('/auth/logout')
  },
  
  // 获取当前用户信息
  getCurrentUser: async (): Promise<{ user: User, role: Role, permissions: Permission[] }> => {
    return get<{ user: User, role: Role, permissions: Permission[] }>('/auth/me')
  },
  
  // 刷新token
  refreshToken: async (): Promise<{ token: string }> => {
    return post<{ token: string }>('/auth/refresh-token')
  },
  
  // 修改密码
  changePassword: async (data: { currentPassword: string, newPassword: string }): Promise<ApiResponse<null>> => {
    return post<ApiResponse<null>>('/auth/change-password', data)
  },
  
  // 用户管理相关API
  users: {
    // 获取所有用户
    getAll: async (): Promise<User[]> => {
      return get<User[]>('/users')
    },
    
    // 获取单个用户
    getById: async (id: string): Promise<User> => {
      return get<User>(`/users/${id}`)
    },
    
    // 创建用户
    create: async (user: UserRequest): Promise<User> => {
      return post<User>('/users', user)
    },
    
    // 更新用户
    update: async (id: string, user: UserRequest): Promise<User> => {
      return put<User>(`/users/${id}`, user)
    },
    
    // 删除用户
    delete: async (id: string): Promise<ApiResponse<null>> => {
      return del<ApiResponse<null>>(`/users/${id}`)
    },
    
    // 更新用户状态（激活/禁用）
    updateStatus: async (id: string, isActive: boolean): Promise<ApiResponse<null>> => {
      return put<ApiResponse<null>>(`/users/${id}/status`, { isActive })
    }
  },
  
  // 角色管理相关API
  roles: {
    // 获取所有角色
    getAll: async (): Promise<Role[]> => {
      return get<Role[]>('/roles')
    },
    
    // 获取单个角色
    getById: async (id: string): Promise<Role> => {
      return get<Role>(`/roles/${id}`)
    },
    
    // 创建角色
    create: async (role: RoleRequest): Promise<Role> => {
      return post<Role>('/roles', role)
    },
    
    // 更新角色
    update: async (id: string, role: RoleRequest): Promise<Role> => {
      return put<Role>(`/roles/${id}`, role)
    },
    
    // 删除角色
    delete: async (id: string): Promise<ApiResponse<null>> => {
      return del<ApiResponse<null>>(`/roles/${id}`)
    },
    
    // 获取所有权限
    getAllPermissions: async (): Promise<Permission[]> => {
      return get<Permission[]>('/permissions')
    }
  }
}

export default AuthService