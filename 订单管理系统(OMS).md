# 订单管理系统(OMS)

## Core Features

- 仪表盘数据可视化

- 订单全生命周期管理

- 客户信息管理

- 物流节点和路径规划

- 车辆调度管理

- 策略配置与管理

## Tech Stack

{
  "Web": {
    "arch": "react",
    "component": "shadcn"
  }
}

## Design

Material Design风格，黑色顶部导航栏和白色内容区，采用卡片式布局和响应式设计

## Plan

Note: 

- [ ] is holding
- [/] is doing
- [X] is done

---

[X] 初始化项目 - 使用Vite创建React+TypeScript项目，配置基础目录结构

[X] 安装核心依赖 - 安装React Router、shadcn/ui、Redux Toolkit等核心库

[X] 配置TypeScript和ESLint - 设置tsconfig.json和ESLint规则

[X] 创建全局布局组件 - 实现黑色顶部导航栏和白色内容区的基础布局

[X] 实现顶部导航组件 - 开发包含Logo、导航菜单、用户信息的导航栏

[X] 配置路由系统 - 使用React Router v6设置主要页面路由

[X] 创建核心UI组件 - 开发表格、表单、卡片、按钮等基础组件

[X] 实现仪表盘页面 - 开发包含数据概览和图表的仪表盘

[X] 集成数据可视化 - 使用Recharts实现订单趋势和分布图表

[X] 开发订单管理页面 - 实现订单列表、搜索和筛选功能

[X] 实现订单详情页面 - 开发订单详细信息和状态更新功能

[X] 开发客户管理模块 - 实现客户列表和详情页面

[X] 实现中转区域管理页面 - 开发中转区域的CRUD功能

[X] 实现中转处理页面 - 开发中转处理的CRUD功能

[X] 实现地址库页面 - 开发地址库的CRUD功能

[X] 实现装载管理页面 - 开发装载管理的CRUD功能

[X] 实现车辆管理页面 - 开发车辆管理的CRUD功能

[X] 实现广告管理页面 - 开发广告管理的CRUD功能

[X] 实现消息管理页面 - 开发消息管理的CRUD功能

[X] 实现状态管理 - 配置Redux store和reducers管理全局状态

[X] 开发API服务层 - 使用Axios创建API请求和响应处理

[X] 实现表单验证 - 使用React Hook Form处理表单验证逻辑

[X] 集成地图功能 - 使用React Leaflet实现地址和物流节点可视化

[X] 开发权限控制系统 - 实现基于角色的页面和功能访问控制

[X] 实现数据导入导出 - 开发CSV/Excel格式的数据导入导出功能

[X] 开发通知系统 - 实现系统内部消息和提醒功能

[X] 优化性能 - 实现组件懒加载和虚拟滚动优化大数据列表
