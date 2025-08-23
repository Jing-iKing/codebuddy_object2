import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import ordersReducer from './slices/orders-slice'
import dashboardReducer from './slices/dashboard-slice'
import authReducer from './slices/auth-slice'
import mapReducer from './slices/map-slice'
import usersReducer from './slices/users-slice'
import rolesReducer from './slices/roles-slice'
import notificationsReducer from './slices/notification-slice'

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    map: mapReducer,
    users: usersReducer,
    roles: rolesReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
