import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionGuard } from '@/components/auth/permission-guard'
import { Role, Permission } from '@/types/auth'
import { fetchRoles, createRole, updateRole, deleteRole, fetchPermissions, selectRoles, selectPermissions, selectRolesLoading, selectRolesError } from '@/store/slices/roles-slice'
import { AppDispatch } from '@/store'
import { Search, MoreHorizontal, Shield, Edit, Trash2 } from 'lucide-react'
import { VirtualTable, Column } from '@/components/data/virtual-table'
import { useVirtualData } from '@/hooks/use-virtual-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// 模拟API请求函数
const fetchRolesData = async (page: number, pageSize: number, allRoles: Role[]) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = allRoles.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: allRoles.length
  };
};

export default function RolesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const allRoles = useSelector(selectRoles)
  const permissions = useSelector(selectPermissions)
  const loading = useSelector(selectRolesLoading)
  const error = useSelector(selectRolesError)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    isDefault: false
  })
  
  // 获取角色和权限数据
  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchPermissions())
  }, [dispatch])
  
  // 使用虚拟滚动钩子
  const {
    data: roles,
    searchTerm,
    setSearchTerm,
    loading: virtualLoading,
    hasNextPage,
    totalItems,
    isItemLoaded,
    loadMoreItems
  } = useVirtualData<Role>({
    initialData: allRoles.slice(0, 20), // 初始加载20条数据
    pageSize: 20,
    fetchData: (page, pageSize) => fetchRolesData(page, pageSize, allRoles),
    filterFn: (role, term) => 
      role.name.toLowerCase().includes(term.toLowerCase()) ||
      role.description.toLowerCase().includes(term.toLowerCase())
  });
  
  // 当allRoles更新时，更新虚拟数据
  useEffect(() => {
    if (allRoles.length > 0) {
      // 重新触发搜索以更新数据
      setSearchTerm(searchTerm);
    }
  }, [allRoles]);
  
  // 处理添加角色
  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) return
    
    dispatch(createRole({
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions || [],
      isDefault: newRole.isDefault
    }))
    
    setIsAddRoleDialogOpen(false)
    setNewRole({
      name: '',
      description: '',
      permissions: [],
      isDefault: false
    })
  }
  
  // 处理编辑角色
  const handleEditRole = () => {
    if (!selectedRole) return
    
    const { id, name, description, permissions, isDefault } = selectedRole
    
    dispatch(updateRole({
      roleId: id,
      roleData: {
        name,
        description,
        permissions,
        isDefault
      }
    }))
    
    setIsEditRoleDialogOpen(false)
    setSelectedRole(null)
  }
  
  // 处理删除角色
  const handleDeleteRole = (roleId: string) => {
    dispatch(deleteRole(roleId))
  }
  
  // 处理权限切换
  const handlePermissionToggle = (permission: Permission, isChecked: boolean) => {
    if (selectedRole) {
      const updatedPermissions = isChecked
        ? [...selectedRole.permissions, permission]
        : selectedRole.permissions.filter(p => p !== permission)
      
      setSelectedRole({
        ...selectedRole,
        permissions: updatedPermissions
      })
    } else if (newRole) {
      const updatedPermissions = isChecked
        ? [...(newRole.permissions || []), permission]
        : (newRole.permissions || []).filter(p => p !== permission)
      
      setNewRole({
        ...newRole,
        permissions: updatedPermissions
      })
    }
  }
  
  // 检查权限是否被选中
  const isPermissionChecked = (permission: Permission) => {
    if (selectedRole) {
      return selectedRole.permissions.includes(permission)
    } else if (newRole && newRole.permissions) {
      return newRole.permissions.includes(permission)
    }
    return false
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
  
  // 权限分组
  const permissionGroups = {
    orders: ['orders:view', 'orders:create', 'orders:edit', 'orders:delete'],
    customers: ['customers:view', 'customers:create', 'customers:edit', 'customers:delete'],
    addresses: ['addresses:view', 'addresses:create', 'addresses:edit', 'addresses:delete'],
    transit: ['transit:view', 'transit:create', 'transit:edit', 'transit:delete'],
    vehicles: ['vehicles:view', 'vehicles:create', 'vehicles:edit', 'vehicles:delete'],
    advertisements: ['advertisements:view', 'advertisements:create', 'advertisements:edit', 'advertisements:delete'],
    messages: ['messages:view', 'messages:create', 'messages:edit', 'messages:delete'],
    map: ['map:view', 'map:edit'],
    settings: ['settings:view', 'settings:edit'],
    users: ['users:view', 'users:create', 'users:edit', 'users:delete'],
    roles: ['roles:view', 'roles:create', 'roles:edit', 'roles:delete'],
    data: ['data:import', 'data:export'],
    dashboard: ['dashboard:view']
  }
  
  // 获取权限名称
  const getPermissionName = (permission: string) => {
    const [module, action] = permission.split(':')
    
    const moduleNames: Record<string, string> = {
      orders: '订单',
      customers: '客户',
      addresses: '地址',
      transit: '中转',
      vehicles: '车辆',
      advertisements: '广告',
      messages: '消息',
      map: '地图',
      settings: '设置',
      users: '用户',
      roles: '角色',
      data: '数据',
      dashboard: '仪表盘'
    }
    
    const actionNames: Record<string, string> = {
      view: '查看',
      create: '创建',
      edit: '编辑',
      delete: '删除',
      import: '导入',
      export: '导出'
    }
    
    return `${moduleNames[module] || module}${actionNames[action] || action}`
  }
  
  // 渲染权限选择器
  const renderPermissionCheckboxes = () => {
    return Object.entries(permissionGroups).map(([group, permissions]) => (
      <div key={group} className="mb-6">
        <h3 className="mb-2 font-semibold">{group.charAt(0).toUpperCase() + group.slice(1)} 模块</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={isPermissionChecked(permission as Permission)}
                onCheckedChange={(checked) => handlePermissionToggle(permission as Permission, checked === true)}
              />
              <Label htmlFor={permission} className="text-sm">
                {getPermissionName(permission)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    ))
  }
  
  // 表格列定义
  const columns: Column<Role>[] = [
    {
      header: "角色名称",
      accessorKey: "name",
      cell: (role) => (
        <div className="font-medium">{role.name}</div>
      )
    },
    {
      header: "描述",
      accessorKey: "description",
      cell: (role) => (
        <div className="max-w-[300px] truncate">{role.description}</div>
      )
    },
    {
      header: "权限数量",
      accessorKey: "permissions",
      cell: (role) => role.permissions.length
    },
    {
      header: "默认角色",
      accessorKey: "isDefault",
      cell: (role) => (
        role.isDefault ? (
          <Badge className="bg-green-100 text-green-800">是</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800">否</Badge>
        )
      )
    },
    {
      header: "创建日期",
      accessorKey: "createdAt",
      cell: (role) => formatDate(role.createdAt)
    },
    {
      header: "操作",
      accessorKey: "actions",
      className: "text-right",
      cell: (role) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PermissionGuard permission="roles:edit">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRole(role)
                    setIsEditRoleDialogOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="roles:delete">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];
  
  return (
    <PermissionGuard permission="roles:view" redirectTo="/404">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索角色..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px] pl-8"
              />
            </div>
            {searchTerm && (
              <div className="text-sm text-gray-500">
                搜索 "<span className="font-medium">{searchTerm}</span>" 的结果
              </div>
            )}
          </div>
          <PermissionGuard permission="roles:create">
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800">
                  <Shield className="mr-2 h-4 w-4" />
                  添加角色
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>添加新角色</DialogTitle>
                  <DialogDescription>
                    创建新角色并分配权限
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roleName" className="text-right">
                      角色名称
                    </Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roleDescription" className="text-right">
                      角色描述
                    </Label>
                    <Textarea
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isDefault" className="text-right">
                      默认角色
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={newRole.isDefault || false}
                        onCheckedChange={(checked) => setNewRole(prev => ({ ...prev, isDefault: checked === true }))}
                      />
                      <Label htmlFor="isDefault">设为默认角色（新用户注册时自动分配）</Label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">权限设置</h3>
                    <Tabs defaultValue="orders">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="orders">订单</TabsTrigger>
                        <TabsTrigger value="customers">客户</TabsTrigger>
                        <TabsTrigger value="logistics">物流</TabsTrigger>
                        <TabsTrigger value="system">系统</TabsTrigger>
                      </TabsList>
                      <TabsContent value="orders">
                        <div className="space-y-4">
                          {renderPermissionCheckboxes()}
                        </div>
                      </TabsContent>
                      <TabsContent value="customers">
                        <div className="space-y-4">
                          {renderPermissionCheckboxes()}
                        </div>
                      </TabsContent>
                      <TabsContent value="logistics">
                        <div className="space-y-4">
                          {renderPermissionCheckboxes()}
                        </div>
                      </TabsContent>
                      <TabsContent value="system">
                        <div className="space-y-4">
                          {renderPermissionCheckboxes()}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                    取消
                  </Button>
                  <Button className="bg-black hover:bg-gray-800" onClick={handleAddRole}>
                    添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>

        <div className="rounded-md border w-full overflow-auto">
          {loading && <LoadingSpinner />}
          
          {!loading && (
            <VirtualTable
              data={roles}
              columns={columns}
              tableHeight={500}
              rowHeight={56}
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMoreItems}
              hasNextPage={hasNextPage}
              itemCount={totalItems}
              tableClassName="rounded-md"
              headerClassName="bg-gray-50"
              rowClassName={(index) => index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              keyExtractor={(item) => item.id}
            />
          )}
          
          {/* 加载状态指示器 */}
          {virtualLoading && (
            <div className="flex justify-center mt-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
            </div>
          )}
          
          {/* 数据统计信息 */}
          <div className="mt-4 text-sm text-gray-500 flex justify-between items-center p-4">
            <div>
              共 <span className="font-medium">{totalItems}</span> 条记录
            </div>
          </div>
        </div>

        {/* 编辑角色对话框 */}
        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>编辑角色</DialogTitle>
              <DialogDescription>
                修改角色信息和权限
              </DialogDescription>
            </DialogHeader>
            {selectedRole && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-roleName" className="text-right">
                    角色名称
                  </Label>
                  <Input
                    id="edit-roleName"
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-roleDescription" className="text-right">
                    角色描述
                  </Label>
                  <Textarea
                    id="edit-roleDescription"
                    value={selectedRole.description}
                    onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isDefault" className="text-right">
                    默认角色
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="edit-isDefault"
                      checked={selectedRole.isDefault || false}
                      onCheckedChange={(checked) => setSelectedRole({ ...selectedRole, isDefault: checked === true })}
                    />
                    <Label htmlFor="edit-isDefault">设为默认角色（新用户注册时自动分配）</Label>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="mb-4 text-lg font-medium">权限设置</h3>
                  <Tabs defaultValue="orders">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="orders">订单</TabsTrigger>
                      <TabsTrigger value="customers">客户</TabsTrigger>
                      <TabsTrigger value="logistics">物流</TabsTrigger>
                      <TabsTrigger value="system">系统</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                      <div className="space-y-4">
                        {renderPermissionCheckboxes()}
                      </div>
                    </TabsContent>
                    <TabsContent value="customers">
                      <div className="space-y-4">
                        {renderPermissionCheckboxes()}
                      </div>
                    </TabsContent>
                    <TabsContent value="logistics">
                      <div className="space-y-4">
                        {renderPermissionCheckboxes()}
                      </div>
                    </TabsContent>
                    <TabsContent value="system">
                      <div className="space-y-4">
                        {renderPermissionCheckboxes()}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-black hover:bg-gray-800" onClick={handleEditRole}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}