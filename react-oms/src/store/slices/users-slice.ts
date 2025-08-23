import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { User, Role } from '@/types/auth'
import AuthService from '@/services/auth-service'
import { mockData } from '@/data/mock-users'

// 用户状态接口
interface UsersState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
}

// 异步 thunk 用于获取所有用户
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // 使用模拟数据代替API调用
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData.users;
    } catch (error) {
      return rejectWithValue('获取用户列表失败')
    }
  }
)

// 异步 thunk 用于获取单个用户
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.users.getById(userId)
      return response
    } catch (error) {
      return rejectWithValue('获取用户详情失败')
    }
  }
)

// 异步 thunk 用于创建用户
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: { username: string, email: string, name: string, password: string, roleId: string, isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await AuthService.users.create(userData)
      return response
    } catch (error) {
      return rejectWithValue('创建用户失败')
    }
  }
)

// 异步 thunk 用于更新用户
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }: { userId: string, userData: { username: string, email: string, name: string, password?: string, roleId: string, isActive: boolean } }, { rejectWithValue }) => {
    try {
      const response = await AuthService.users.update(userId, userData)
      return response
    } catch (error) {
      return rejectWithValue('更新用户失败')
    }
  }
)

// 异步 thunk 用于删除用户
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await AuthService.users.delete(userId)
      return userId
    } catch (error) {
      return rejectWithValue('删除用户失败')
    }
  }
)

// 异步 thunk 用于更新用户状态
export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ userId, isActive }: { userId: string, isActive: boolean }, { rejectWithValue }) => {
    try {
      await AuthService.users.updateStatus(userId, isActive)
      return { userId, isActive }
    } catch (error) {
      return rejectWithValue('更新用户状态失败')
    }
  }
)

// 创建用户 slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // 处理获取所有用户
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理获取单个用户
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理创建用户
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理更新用户
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理删除用户
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // 处理更新用户状态
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, isActive: action.payload.isActive } 
            : user
        )
        if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
          state.selectedUser = { 
            ...state.selectedUser, 
            isActive: action.payload.isActive 
          }
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// 导出 actions
export const { setSelectedUser, clearError } = usersSlice.actions

// 选择器
export const selectUsers = (state: RootState) => state.users.users
export const selectSelectedUser = (state: RootState) => state.users.selectedUser
export const selectUsersLoading = (state: RootState) => state.users.loading
export const selectUsersError = (state: RootState) => state.users.error

// 导出 reducer
export default usersSlice.reducer