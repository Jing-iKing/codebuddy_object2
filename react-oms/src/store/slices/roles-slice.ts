import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { Role, Permission } from '@/types/auth'
import AuthService from '@/services/auth-service'
import { mockData } from '@/data/mock-users'

// 角色状态接口
interface RolesState {
  roles: Role[]
  selectedRole: Role | null
  permissions: Permission[]
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  permissions: [],
  loading: false,
  error: null
}

// 异步 thunk 用于获取所有角色
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      // 使用模拟数据代替API调用
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData.roles;
    } catch (error) {
      return rejectWithValue('获取角色列表失败')
    }
  }
)

// 异步 thunk 用于获取单个角色
export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.roles.getById(roleId)
      return response
    } catch (error) {
      return rejectWithValue('获取角色详情失败')
    }
  }
)

// 异步 thunk 用于创建角色
export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData: { name: string, description: string, permissions: Permission[], isDefault?: boolean }, { rejectWithValue }) => {
    try {
      const response = await AuthService.roles.create(roleData)
      return response
    } catch (error) {
      return rejectWithValue('创建角色失败')
    }
  }
)

// 异步 thunk 用于更新角色
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ roleId, roleData }: { roleId: string, roleData: { name: string, description: string, permissions: Permission[], isDefault?: boolean } }, { rejectWithValue }) => {
    try {
      const response = await AuthService.roles.update(roleId, roleData)
      return response
    } catch (error) {
      return rejectWithValue('更新角色失败')
    }
  }
)

// 异步 thunk 用于删除角色
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleId: string, { rejectWithValue }) => {
    try {
      await AuthService.roles.delete(roleId)
      return roleId
    } catch (error) {
      return rejectWithValue('删除角色失败')
    }
  }
)

// 异步 thunk 用于获取所有权限
export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.roles.getAllPermissions()
      return response
    } catch (error) {
      return rejectWithValue('获取权限列表失败')
    }
  }
)

// 创建角色 slice
export const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // 处理获取所有角色
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取单个角色
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedRole = action.payload
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理创建角色
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles.push(action.payload)
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理更新角色
    builder
      .addCase(updateRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles = state.roles.map(role => 
          role.id === action.payload.id ? action.payload : role
        )
        if (state.selectedRole && state.selectedRole.id === action.payload.id) {
          state.selectedRole = action.payload
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理删除角色
    builder
      .addCase(deleteRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles = state.roles.filter(role => role.id !== action.payload)
        if (state.selectedRole && state.selectedRole.id === action.payload) {
          state.selectedRole = null
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取所有权限
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false
        state.permissions = action.payload
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// 导出 actions
export const { setSelectedRole, clearError } = rolesSlice.actions

// 选择器
export const selectRoles = (state: RootState) => state.roles.roles
export const selectSelectedRole = (state: RootState) => state.roles.selectedRole
export const selectPermissions = (state: RootState) => state.roles.permissions
export const selectRolesLoading = (state: RootState) => state.roles.loading
export const selectRolesError = (state: RootState) => state.roles.error

// 导出 reducer
export default rolesSlice.reducer