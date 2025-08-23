import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { User, Role, Permission, AuthState, PREDEFINED_ROLES } from '@/types/auth'
import AuthService from '@/services/auth-service'

// 初始状态
const initialState: AuthState = {
  user: null,
  role: null,
  permissions: [],
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// 模拟用户数据
const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  name: '管理员',
  roleId: 'admin',
  avatar: '/placeholder.svg',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// 获取角色
const mockRole = PREDEFINED_ROLES.find(role => role.id === 'admin')!

// 登录凭据类型
interface LoginCredentials {
  username: string
  password: string
}

// 异步 thunk 用于登录
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会调用 AuthService.login
      // const response = await AuthService.login(credentials);
      // return response;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟验证
      if (credentials.username === 'admin' && credentials.password === 'password') {
        return {
          user: mockUser,
          role: mockRole,
          permissions: mockRole.permissions,
          token: 'mock-jwt-token'
        };
      } else {
        return rejectWithValue('用户名或密码错误');
      }
    } catch (error) {
      return rejectWithValue('登录失败');
    }
  }
)

// 异步 thunk 用于获取当前用户信息
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      // 在实际应用中，这里会调用 AuthService.getCurrentUser
      // const { auth } = getState() as { auth: AuthState };
      // const response = await AuthService.getCurrentUser();
      // return response;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟返回用户数据
      return {
        user: mockUser,
        role: mockRole,
        permissions: mockRole.permissions
      };
    } catch (error) {
      return rejectWithValue('获取用户信息失败');
    }
  }
)

// 异步 thunk 用于登出
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会调用 AuthService.logout
      // await AuthService.logout();
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      return rejectWithValue('登出失败');
    }
  }
)

// 异步 thunk 用于获取所有角色
export const fetchAllRoles = createAsyncThunk(
  'auth/fetchAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会调用 AuthService.roles.getAll
      // const response = await AuthService.roles.getAll();
      // return response;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟返回角色数据
      return PREDEFINED_ROLES;
    } catch (error) {
      return rejectWithValue('获取角色列表失败');
    }
  }
)

// 异步 thunk 用于获取所有用户
export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里会调用 AuthService.users.getAll
      // const response = await AuthService.users.getAll();
      // return response;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟返回用户数据
      return [
        mockUser,
        {
          id: '2',
          username: 'manager',
          email: 'manager@example.com',
          name: '管理人员',
          roleId: 'manager',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          username: 'operator',
          email: 'operator@example.com',
          name: '操作员',
          roleId: 'operator',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      return rejectWithValue('获取用户列表失败');
    }
  }
)

// 创建认证slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 从本地存储恢复会话
    restoreSession: (state, action: PayloadAction<{ user: User, role: Role, permissions: Permission[], token: string }>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    
    // 检查用户是否有特定权限
    hasPermission: (state, action: PayloadAction<Permission | Permission[]>) => {
      // 这个 reducer 不修改状态，只是一个辅助函数
      // 实际的权限检查逻辑在 selector 中实现
    }
  },
  extraReducers: (builder) => {
    // 处理登录
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // 处理获取当前用户信息
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
    
    // 处理登出
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.permissions = [];
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
})

// 导出actions
export const { clearError, restoreSession } = authSlice.actions

// 选择器
export const selectUser = (state: RootState) => state.auth.user
export const selectRole = (state: RootState) => state.auth.role
export const selectPermissions = (state: RootState) => state.auth.permissions
export const selectToken = (state: RootState) => state.auth.token
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error

// 权限检查选择器
export const selectHasPermission = (permission: Permission | Permission[]) => (state: RootState) => {
  const permissions = state.auth.permissions
  
  // 如果用户没有权限，返回 false
  if (!permissions || permissions.length === 0) {
    return false
  }
  
  // 如果是单个权限，直接检查
  if (typeof permission === 'string') {
    return permissions.includes(permission)
  }
  
  // 如果是权限数组，检查是否包含所有权限
  return permission.every(p => permissions.includes(p))
}

// 导出reducer
export default authSlice.reducer
