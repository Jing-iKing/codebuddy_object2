# OMS系统

这是一个基于React的订单管理系统(OMS)，专注于仓储物流管理，特别是码板装车功能的优化实现。

## 项目概述

本项目是一个现代化的企业级应用，使用React和TypeScript构建，采用了shadcn/ui组件库来实现美观且功能丰富的用户界面。主要功能包括中转处理、装载管理、订单管理、基础管理等物流相关操作。


## 技术栈

- **前端框架**：React 18
- **开发语言**：TypeScript
- **构建工具**：Vite 5
- **UI组件库**：shadcn/ui (基于Radix UI)
- **样式解决方案**：Tailwind CSS
- **状态管理**：Redux Toolkit
- **路由管理**：React Router DOM
- **表格组件**：TanStack Table
- **图表库**：Recharts
- **表单处理**：React Hook Form
- **数据验证**：Zod
- **HTTP客户端**：Axios

## 安装与运行

### 前提条件

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/Jing-iKing/codebuddy_object2.git
cd codebuddy_object2
```

2. 安装依赖
```bash
cd react-oms
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

5. 预览生产构建
```bash
npm run preview
```

## 项目结构

```
react-oms/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 图片、字体等资源
│   ├── components/     # 可复用组件
│   │   ├── layout/     # 布局相关组件
│   │   ├── transit/    # 中转相关组件
│   │   └── ui/         # UI基础组件
│   ├── config/         # 配置文件
│   ├── data/           # 模拟数据
│   │   └── mock/       # 模拟数据文件
│   ├── hooks/          # 自定义React Hooks
│   ├── lib/            # 工具库
│   ├── pages/          # 页面组件
│   │   ├── loading/    # 装车相关页面
│   │   └── transit/    # 中转相关页面
│   ├── services/       # API服务
│   ├── store/          # Redux状态管理
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript类型定义
│   └── utils/          # 工具函数
├── App.tsx             # 应用入口组件
├── main.tsx            # 应用入口文件
└── index.css           # 全局样式入口
```

## 开发指南

### 代码规范

- 使用TypeScript类型定义确保类型安全
- 遵循组件化开发原则，保持组件的单一职责
- 使用Tailwind CSS进行样式开发，保持样式与组件的紧密结合
- 使用React Hooks管理组件状态和副作用

### 添加新功能

1. 在适当的目录下创建新的组件或页面
2. 如需添加新的API服务，在services目录下创建相应的服务文件
3. 更新路由配置以包含新页面
4. 如需添加新的状态管理，在store目录下创建相应的slice

## 许可证

[MIT](LICENSE)

## 联系方式

GitHub: [Jing-iKing](https://github.com/Jing-iKing)
