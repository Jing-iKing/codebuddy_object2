import { Outlet } from 'react-router-dom'
import { lazy } from 'react'
import { usePreload } from '@/hooks/use-preload'
import { Toaster } from '@/components/ui/toaster'
import { TopNavbar } from './top-navbar'

// 预加载常用页面
const preloadOrderDetail = () => import('@/pages/orders/order-detail')
const preloadCustomers = () => import('@/pages/customers')
const preloadAddresses = () => import('@/pages/addresses')
const preloadNotifications = () => import('@/pages/notifications')

export function MainLayout() {
  // 使用预加载钩子预加载常用页面
  usePreload([
    preloadOrderDetail,
    preloadCustomers,
    preloadAddresses,
    preloadNotifications
  ], 3000)
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar />
      {/* 使用宽屏布局，减少内边距以最大化内容区域 */}
      <main className="flex-1 bg-white px-2 py-6 w-full max-w-full">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}