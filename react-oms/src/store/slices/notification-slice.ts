import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Notification, 
  NotificationFilter, 
  NotificationParams, 
  NotificationResponse,
  NotificationType,
  NotificationPriority,
  NotificationStatus
} from '@/types/notification';
import { notificationService } from '@/services/notification-service';
import { RootState } from '@/store';

// 状态接口
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  filter: NotificationFilter | null;
}

// 初始状态
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  filter: null
};

// 异步 Thunk - 获取通知列表
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: NotificationParams, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(params);
      return response;
    } catch (error) {
      return rejectWithValue('获取通知列表失败');
    }
  }
);

// 异步 Thunk - 获取未读通知数量
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount();
      return count;
    } catch (error) {
      return rejectWithValue('获取未读通知数量失败');
    }
  }
);

// 异步 Thunk - 标记通知为已读
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(fetchUnreadCount());
      return id;
    } catch (error) {
      return rejectWithValue('标记通知为已读失败');
    }
  }
);

// 异步 Thunk - 标记所有通知为已读
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      await notificationService.markAllAsRead();
      dispatch(fetchUnreadCount());
      
      // 更新本地状态中的通知
      const state = getState() as RootState;
      const params: NotificationParams = {
        page: state.notifications.currentPage,
        limit: state.notifications.pageSize,
        filter: state.notifications.filter || undefined
      };
      dispatch(fetchNotifications(params));
      
      return true;
    } catch (error) {
      return rejectWithValue('标记所有通知为已读失败');
    }
  }
);

// 异步 Thunk - 归档通知
export const archiveNotification = createAsyncThunk(
  'notifications/archiveNotification',
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      await notificationService.archiveNotification(id);
      
      // 更新本地状态中的通知
      const state = getState() as RootState;
      const params: NotificationParams = {
        page: state.notifications.currentPage,
        limit: state.notifications.pageSize,
        filter: state.notifications.filter || undefined
      };
      dispatch(fetchNotifications(params));
      
      return id;
    } catch (error) {
      return rejectWithValue('归档通知失败');
    }
  }
);

// 异步 Thunk - 删除通知
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      await notificationService.deleteNotification(id);
      
      // 更新本地状态中的通知
      const state = getState() as RootState;
      const params: NotificationParams = {
        page: state.notifications.currentPage,
        limit: state.notifications.pageSize,
        filter: state.notifications.filter || undefined
      };
      dispatch(fetchNotifications(params));
      
      return id;
    } catch (error) {
      return rejectWithValue('删除通知失败');
    }
  }
);

// 异步 Thunk - 创建通知（仅用于测试）
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notification: Omit<Notification, 'id' | 'createdAt'>, { rejectWithValue, dispatch }) => {
    try {
      const newNotification = await notificationService.createNotification(notification);
      dispatch(fetchUnreadCount());
      return newNotification;
    } catch (error) {
      return rejectWithValue('创建通知失败');
    }
  }
);

// 创建 Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setFilter: (state, action: PayloadAction<NotificationFilter | null>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取通知列表
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.total = action.payload.total;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取未读通知数量
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      
      // 标记通知为已读
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          notification.status = NotificationStatus.Read;
          notification.readAt = new Date();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // 创建通知
      .addCase(createNotification.fulfilled, (state, action) => {
        // 如果是当前页的第一页，则添加到列表中
        if (state.currentPage === 1) {
          state.notifications.unshift(action.payload);
          if (state.notifications.length > state.pageSize) {
            state.notifications.pop();
          }
        }
        state.total += 1;
        if (action.payload.status === NotificationStatus.Unread) {
          state.unreadCount += 1;
        }
      });
  }
});

// 导出 Actions
export const { setCurrentPage, setPageSize, setFilter, clearError } = notificationSlice.actions;

// 导出 Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectTotal = (state: RootState) => state.notifications.total;
export const selectLoading = (state: RootState) => state.notifications.loading;
export const selectError = (state: RootState) => state.notifications.error;
export const selectCurrentPage = (state: RootState) => state.notifications.currentPage;
export const selectPageSize = (state: RootState) => state.notifications.pageSize;
export const selectFilter = (state: RootState) => state.notifications.filter;

// 导出 Reducer
export default notificationSlice.reducer;