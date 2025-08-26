import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Package, 
  Users, 
  MapPin, 
  Settings, 
  Truck, 
  LayoutGrid, 
  Repeat, 
  Network, 
  MessageSquare,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Map,
  Database
} from 'lucide-react'
import { NotificationIcon } from '@/components/notifications/notification-icon'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppSelector } from '@/hooks/redux-hooks'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  // 重新组织导航菜单结构
  const navItems: NavItem[] = [
    {
      title: '仪表盘',
      href: '/',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: '中转处理',
      href: '/transit/processing',
      icon: <Repeat className="h-5 w-5" />,
    },
    {
      title: '装载管理',
      href: '/loading/pallet-loading',
      icon: <Truck className="h-5 w-5" />,
      submenu: [
        { title: '码板装车', href: '/loading/pallet-loading' },
        { title: '车次管理', href: '/loading/vehicle-management' },
      ],
    },
    {
      title: '订单管理',
      href: '/orders',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: '基础管理',
      href: '/basic',
      icon: <Database className="h-5 w-5" />,
      submenu: [
        { title: '客户管理', href: '/customers' },
        { title: '地址库', href: '/addresses' },
        { title: '节点管理', href: '/nodes' },
        { title: '策略管理', href: '/strategies' },
        { title: '中转区域', href: '/transit/areas' },
        { title: '广告管理', href: '/advertisements' },
        { title: '车辆管理', href: '/vehicles' },
        { title: '地图', href: '/map' },
      ],
    },
    {
      title: '系统管理',
      href: '/system',
      icon: <Settings className="h-5 w-5" />,
      submenu: [
        { title: '用户管理', href: '/users' },
        { title: '角色管理', href: '/roles' },
        { title: '消息管理', href: '/messages' },
      ],
    },
  ]

  // 检查路径是否匹配当前项或其子菜单
  const isActive = (item: NavItem) => {
    if (currentPath === item.href) return true
    if (item.submenu) {
      return item.submenu.some(subItem => currentPath === subItem.href)
    }
    return false
  }

  // 检查子菜单项是否匹配当前路径
  const isSubItemActive = (href: string) => {
    return currentPath === href
  }

  const handleLogout = () => {
    // 这里处理登出逻辑
    navigate('/login')
  }

  // 获取认证状态
  const { isAuthenticated } = useAppSelector(state => state.auth)

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated && currentPath !== '/login') {
      navigate('/login')
    }
  }, [isAuthenticated, currentPath, navigate])

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
      {/* 使用宽屏布局，与内容区保持一致的内边距 */}
      <div className="flex h-16 items-center px-4">
        {/* Logo区域 - 固定宽度200px */}
        <div className="flex min-w-[200px] items-center">
          <Link to="/" className="flex items-center">
            <Package className="mr-3 h-7 w-7" />
            <span className="text-xl font-bold whitespace-nowrap">订单管理系统</span>
          </Link>
        </div>

        {/* 桌面导航 - 居中显示 */}
        <nav className="hidden md:flex md:flex-grow md:justify-center">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.href}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "flex items-center text-white hover:bg-gray-700 hover:text-white transition-colors",
                          isActive(item) && "bg-[#c22f57] text-white hover:bg-[#d13d65]"
                        )}
                      >
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-gray-800 text-white border-gray-700">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem 
                          key={subItem.href} 
                          asChild
                          className={cn(
                            "hover:bg-gray-700 focus:bg-gray-700 focus:text-white",
                            isSubItemActive(subItem.href) && "bg-[#c22f57] text-white"
                          )}
                        >
                          <Link to={subItem.href}>{subItem.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={item.href}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "flex items-center text-white hover:bg-gray-700 hover:text-white transition-colors",
                        currentPath === item.href && "bg-[#c22f57] text-white hover:bg-[#d13d65]"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 用户菜单 - 固定在右侧 */}
        <div className="flex items-center ml-auto">
          <NotificationIcon className="mr-2" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-700">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="用户头像" />
                  <AvatarFallback>管理</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">管理员</p>
                  <p className="text-sm text-gray-300">admin@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                <Link to="/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>个人资料</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center text-red-400 hover:bg-gray-700 focus:bg-gray-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 md:hidden hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 bg-gray-900 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex w-full items-center justify-start text-white hover:bg-gray-700",
                        isActive(item) && "bg-[#c22f57] text-white"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
                            isSubItemActive(subItem.href) && "bg-[#c22f57] text-white"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
                      currentPath === item.href && "bg-[#c22f57] text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}