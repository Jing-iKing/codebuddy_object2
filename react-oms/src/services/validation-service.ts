import { z } from 'zod'

// 订单表单验证模式
export const orderSchema = z.object({
  productName: z.string().min(1, '产品名称不能为空'),
  externalOrderId: z.string().optional(),
  weight: z.string().min(1, '重量不能为空'),
  length: z.string().min(1, '长度不能为空'),
  width: z.string().min(1, '宽度不能为空'),
  height: z.string().min(1, '高度不能为空'),
  quantity: z.number().int().positive('数量必须为正整数'),
  arrivalDate: z.string().min(1, '到仓日期不能为空'),
  customer: z.string().min(1, '客户不能为空'),
  strategy: z.string().min(1, '配送策略不能为空'),
  recipientName: z.string().min(1, '收件人姓名不能为空'),
  recipientAddress: z.string().min(1, '收件人地址不能为空'),
  recipientPhone: z.string().min(1, '收件人电话不能为空').regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  notes: z.string().optional()
})

// 客户表单验证模式
export const customerSchema = z.object({
  name: z.string().min(1, '客户名称不能为空'),
  contactPerson: z.string().min(1, '联系人不能为空'),
  phone: z.string().min(1, '联系电话不能为空').regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  email: z.string().email('请输入有效的电子邮箱'),
  address: z.string().min(1, '地址不能为空'),
  type: z.enum(['个人', '企业']),
  level: z.enum(['普通', 'VIP', '战略']),
  status: z.enum(['活跃', '非活跃', '黑名单']),
  notes: z.string().optional()
})

// 地址表单验证模式
export const addressSchema = z.object({
  name: z.string().min(1, '地址名称不能为空'),
  address: z.string().min(1, '详细地址不能为空'),
  province: z.string().min(1, '省份不能为空'),
  city: z.string().min(1, '城市不能为空'),
  district: z.string().min(1, '区县不能为空'),
  postalCode: z.string().regex(/^\d{6}$/, '请输入有效的邮政编码'),
  contactPerson: z.string().min(1, '联系人不能为空'),
  contactPhone: z.string().min(1, '联系电话不能为空').regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  type: z.enum(['发货地址', '收货地址', '中转地址']),
  isDefault: z.boolean().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

// 车辆表单验证模式
export const vehicleSchema = z.object({
  plateNumber: z.string().min(1, '车牌号不能为空'),
  type: z.string().min(1, '车辆类型不能为空'),
  capacity: z.number().positive('载重必须为正数'),
  dimensions: z.string().min(1, '车厢尺寸不能为空'),
  driver: z.string().min(1, '司机不能为空'),
  driverPhone: z.string().min(1, '司机电话不能为空').regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  status: z.enum(['可用', '在途', '维修', '停用']),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional()
})

// 登录表单验证模式
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码不能少于6个字符'),
  remember: z.boolean().optional()
})

// 修改密码表单验证模式
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '当前密码不能为空'),
  newPassword: z.string().min(6, '新密码不能少于6个字符'),
  confirmPassword: z.string().min(6, '确认密码不能少于6个字符')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword']
})

// 导出所有验证模式
export const ValidationSchemas = {
  order: orderSchema,
  customer: customerSchema,
  address: addressSchema,
  vehicle: vehicleSchema,
  login: loginSchema,
  changePassword: changePasswordSchema
}

export default ValidationSchemas