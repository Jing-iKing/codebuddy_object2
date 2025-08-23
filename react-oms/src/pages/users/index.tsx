import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PermissionGuard } from '@/components/auth/permission-guard'
import { User, Role } from '@/types/auth'
import { fetchUsers, createUser, updateUser, deleteUser, updateUserStatus, selectUsers, selectUsersLoading, selectUsersError } from '@/store/slices/users-slice'
import { fetchRoles, selectRoles } from '@/store/slices/roles-slice'
import { AppDispatch } from '@/store'
import { Search, MoreHorizontal, UserPlus, Edit, Check, X, Trash2 } from 'lucide-react'
import { VirtualTable, Column } from '@/components/data/virtual-table'
import { useVirtualData } from '@/hooks/use-virtual-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// 模拟API请求函数
const fetchUsersData = async (page: number, pageSize: number, allUsers: User[]) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = allUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: allUsers.length
  };
};

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const allUsers = useSelector(selectUsers)
  const roles = useSelector(selectRoles)
  const loading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    roleId: 'operator',
    isActive: true
  })
  
  // 获取用户和角色数据
  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchRoles())
  }, [dispatch])
  
  // 使用虚拟滚动钩子
  const {
    data: users,
    searchTerm,
    setSearchTerm,
    loading: virtualLoading,
    hasNextPage,
    totalItems,
    isItemLoaded,
    loadMoreItems
  } = useVirtualData<User>({
    initialData: allUsers.slice(0, 20), // 初始加载20条数据
    pageSize: 20,
    fetchData: (page, pageSize) => fetchUsersData(page, pageSize, allUsers),
    filterFn: (user, term) => 
      user.username.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.name.toLowerCase().includes(term.toLowerCase())
  });
  
  // 当allUsers更新时，更新虚拟数据
  useEffect(() => {
    if (allUsers.length > 0) {
      // 重新触发搜索以更新数据
      setSearchTerm(searchTerm);
    }
  }, [allUsers]);
  
  // 处理添加用户
  const handleAddUser = () => {
    dispatch(createUser({
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
      roleId: newUser.roleId,
      isActive: newUser.isActive
    }))
    
    setIsAddUserDialogOpen(false)
    setNewUser({
      username: '',
      email: '',
      name: '',
      password: '',
      roleId: 'operator',
      isActive: true
    })
  }
  
  // 处理编辑用户
  const handleEditUser = () => {
    if (!selectedUser) return
    
    const { id, username, email, name, roleId, isActive } = selectedUser
    
    dispatch(updateUser({
      userId: id,
      userData: {
        username,
        email,
        name,
        roleId,
        isActive
      }
    }))
    
    setIsEditUserDialogOpen(false)
    setSelectedUser(null)
  }
  
  // 处理删除用户
  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId))
  }
  
  // 处理更新用户状态
  const handleUpdateUserStatus = (userId: string, isActive: boolean) => {
    dispatch(updateUserStatus({ userId, isActive }))
  }
  
  // 获取角色名称
  const getRoleName = (roleId: string) => {
    const role = roles.find(role => role.id === roleId)
    return role ? role.name : '未知角色'
  }
  
  // 获取用户状态徽章
  const getUserStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">活跃</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">禁用</Badge>
    )
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
  
  // 表格列定义
  const columns: Column<User>[] = [
    {
      header: "用户名",
      accessorKey: "username",
      cell: (user) => (
        <div className="font-medium">{user.username}</div>
      )
    },
    {
      header: "姓名",
      accessorKey: "name",
      cell: (user) => user.name
    },
    {
      header: "邮箱",
      accessorKey: "email",
      cell: (user) => user.email
    },
    {
      header: "角色",
      accessorKey: "roleId",
      cell: (user) => getRoleName(user.roleId)
    },
    {
      header: "状态",
      accessorKey: "isActive",
      cell: (user) => getUserStatusBadge(user.isActive)
    },
    {
      header: "创建日期",
      accessorKey: "createdAt",
      cell: (user) => formatDate(user.createdAt)
    },
    {
      header: "操作",
      accessorKey: "actions",
      className: "text-right",
      cell: (user) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PermissionGuard permission="users:edit">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user)
                    setIsEditUserDialogOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                >
                  {user.isActive ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      禁用
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      激活
                    </>
                  )}
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="users:delete">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteUser(user.id)}
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
    <PermissionGuard permission="users:view" redirectTo="/404">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px]"
              prefix={<Search className="h-4 w-4 text-gray-400" />}
            />
            {searchTerm && (
              <div className="text-sm text-gray-500">
                搜索 "<span className="font-medium">{searchTerm}</span>" 的结果
              </div>
            )}
          </div>
          <PermissionGuard permission="users:create">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800">
                  <UserPlus className="mr-2 h-4 w-4" />
                  添加用户
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>添加新用户</DialogTitle>
                  <DialogDescription>
                    创建新用户并分配角色和权限
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      用户名
                    </Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      邮箱
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      姓名
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      密码
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">角色</Label>
                    <Select
                      value={newUser.roleId}
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, roleId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">状态</Label>
                    <Select
                      value={newUser.isActive ? 'active' : 'inactive'}
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, isActive: value === 'active' }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">禁用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    取消
                  </Button>
                  <Button className="bg-black hover:bg-gray-800" onClick={handleAddUser}>
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
              data={users}
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

        {/* 编辑用户对话框 */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑用户</DialogTitle>
              <DialogDescription>
                修改用户信息和权限
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">
                    用户名
                  </Label>
                  <Input
                    id="edit-username"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    邮箱
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    姓名
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">角色</Label>
                  <Select
                    value={selectedUser.roleId}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, roleId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">状态</Label>
                  <Select
                    value={selectedUser.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, isActive: value === 'active' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-black hover:bg-gray-800" onClick={handleEditUser}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}