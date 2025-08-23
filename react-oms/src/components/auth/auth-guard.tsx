import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/auth-slice'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * 认证保护组件
 * 
 * 用于保护需要认证的路由
 * 
 * @param children 需要保护的内容
 * @param redirectTo 未认证时重定向的路径（默认为/login）
 */
export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const location = useLocation()

  // 如果正在加载，显示加载中
  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // 如果已认证，显示子组件
  return <>{children}</>
}