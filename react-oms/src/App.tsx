import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MainLayout } from './components/layout/main-layout'
import { AuthGuard } from './components/auth/auth-guard'
import { PermissionGuard } from './components/auth/permission-guard'
import { fetchCurrentUser } from './store/slices/auth-slice'

// 懒加载页面组件
const LoginPage = lazy(() => import('./pages/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const OrdersPage = lazy(() => import('./pages/orders'))
const UsersPage = lazy(() => import('./pages/users'))
const RolesPage = lazy(() => import('./pages/roles'))
const OrderDetail = lazy(() => import('./pages/orders/order-detail'))
const CustomersPage = lazy(() => import('./pages/customers'))
const AddressesPage = lazy(() => import('./pages/addresses'))
const StrategiesPage = lazy(() => import('./pages/strategies'))
const PalletLoadingPage = lazy(() => import('./pages/loading/pallet-loading'))
const VehicleManagementPage = lazy(() => import('./pages/loading/vehicle-management'))
const TransitAreasPage = lazy(() => import('./pages/transit/areas'))
const TransitProcessingPage = lazy(() => import('./pages/transit/processing'))
const NodesPage = lazy(() => import('./pages/nodes'))
const VehiclesPage = lazy(() => import('./pages/vehicles'))
const AdvertisementsPage = lazy(() => import('./pages/advertisements'))
const MessagesPage = lazy(() => import('./pages/messages'))
const MapPage = lazy(() => import('./pages/map'))
const NotificationsPage = lazy(() => import('./pages/notifications'))
const NotFoundPage = lazy(() => import('./pages/not-found'))

import { LoadingSpinner } from './components/ui/loading-spinner'

// 加载中组件
const LoadingFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <LoadingSpinner size="lg" text="加载中..." />
  </div>
)

function App() {
  const dispatch = useDispatch()
  
  // 在应用加载时尝试获取当前用户信息
  useEffect(() => {
    dispatch(fetchCurrentUser() as any)
  }, [dispatch])
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        
        {/* 受保护的路由 */}
        <Route path="/" element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="strategies" element={<StrategiesPage />} />
          <Route path="loading/pallet-loading" element={<PalletLoadingPage />} />
          <Route path="loading/vehicle-management" element={<VehicleManagementPage />} />
          <Route path="transit/areas" element={<TransitAreasPage />} />
          <Route path="transit/processing" element={<TransitProcessingPage />} />
          <Route path="nodes" element={<NodesPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="advertisements" element={<AdvertisementsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="users" element={
            <PermissionGuard permission="users:view" redirectTo="/404">
              <UsersPage />
            </PermissionGuard>
          } />
          <Route path="roles" element={
            <PermissionGuard permission="roles:view" redirectTo="/404">
              <RolesPage />
            </PermissionGuard>
          } />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App