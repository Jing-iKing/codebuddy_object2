import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectHasPermission } from '@/store/slices/auth-slice'
import { Permission } from '@/types/auth'

interface PermissionGuardProps {
  children: ReactNode
  permission: Permission | Permission[]
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * 权限保护组件
 * 
 * 用于保护需要特定权限的路由和UI元素
 * 
 * @param children 需要保护的内容
 * @param permission 需要的权限或权限数组
 * @param fallback 无权限时显示的内容（可选）
 * @param redirectTo 无权限时重定向的路径（可选）
 */
export function PermissionGuard({
  children,
  permission,
  fallback,
  redirectTo
}: PermissionGuardProps) {
  const hasPermission = useSelector(selectHasPermission(permission))

  if (!hasPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }
    
    if (fallback) {
      return <>{fallback}</>
    }
    
    return null
  }

  return <>{children}</>
}

/**
 * 权限按钮组件
 * 
 * 根据用户权限显示或隐藏按钮
 * 
 * @param props 按钮属性
 */
export function PermissionButton({
  permission,
  ...props
}: {
  permission: Permission | Permission[]
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const hasPermission = useSelector(selectHasPermission(permission))

  if (!hasPermission) {
    return null
  }

  return <button {...props} />
}

/**
 * 权限元素组件
 * 
 * 根据用户权限显示或隐藏任意元素
 * 
 * @param children 需要保护的内容
 * @param permission 需要的权限或权限数组
 */
export function PermissionElement({
  children,
  permission
}: {
  children: ReactNode
  permission: Permission | Permission[]
}) {
  const hasPermission = useSelector(selectHasPermission(permission))

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}