# 开发工具箱

> 提供 PCB 设计、电路计算、电子元器件选型等专业工具，助力硬件开发

🌐 **在线访问**: [https://xiaowulai-s.github.io/zutils](https://xiaowulai-s.github.io/zutils)

## ✨ 功能特性

### 硬件/PCB 工具

| 工具 | 描述 |
|------|------|
| [PCB 过孔电流计算器](/pcb-via-current) | 基于 IPC-2152 标准，计算过孔最大电流、电阻、压降等参数 |
| [PCB 走线宽度计算器](/pcb-trace-width) | 基于 IPC-2152 标准，根据电流计算所需走线宽度 |
| [电阻色环阻值计算器](/resistor-color-code) | 支持 4/5/6 环电阻的色环阻值、容差及温度系数计算 |
| [SMD 电阻丝印助手](/smd-resistor) | 解析三位、四位及 EIA-96 编码的贴片电阻丝印代码 |
| [LED 限流电阻计算器](/led-resistor) | 计算 LED 限流电阻值，支持串并联配置，E24 标准电阻推荐 |
| [电池续航计算器](/battery-life) | 计算电池使用寿命，支持恒定功耗和间歇性功耗两种模式 |
| [RC/RL 滤波器计算器](/rc-rl-filter) | 低通与高通滤波器计算，支持 RC 和 RL 电路模式，实时幅频响应曲线 |
| [二进制文件查看器](/binary-viewer) | 在线查看二进制文件，十六进制和 ASCII 视图，支持大文件虚拟滚动 |

## 🛠️ 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) (App Router + 静态导出)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **标准**: IPC-2152 (PCB 设计标准)

## 📦 项目结构

```
zutils/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── pcb-via-current/    # PCB 过孔电流计算器
│   │   ├── pcb-trace-width/    # PCB 走线宽度计算器
│   │   ├── resistor-color-code/# 电阻色环计算器
│   │   ├── smd-resistor/       # SMD 电阻丝印助手
│   │   ├── led-resistor/       # LED 限流电阻计算器
│   │   ├── battery-life/       # 电池续航计算器
│   │   ├── rc-rl-filter/       # RC/RL 滤波器计算器
│   │   └── binary-viewer/      # 二进制文件查看器
│   │
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── layout/             # 布局组件
│   │   └── tools/              # 工具通用组件
│   │
│   ├── lib/
│   │   ├── calculations/       # 核心计算逻辑
│   │   └── utils/              # 工具函数
│   │
│   ├── types/                  # TypeScript 类型定义
│   └── config/                 # 配置文件
│
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm、yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建静态版本

```bash
npm run build
```

静态文件将输出到 `out` 目录。

## 🏗️ 架构设计

### 模块化设计

每个工具独立目录，包含：
- 页面组件 (`page.tsx`)
- 计算逻辑 (`lib/calculations/`)
- 类型定义 (`types/`)

### 可复用组件

- `CalculatorShell`: 统一的计算器 UI 框架
- `ToolCard`: 工具卡片组件
- `ColorBandPicker`: 色环选择器
- `HexViewer`: 十六进制查看器
- `FrequencyChart`: 频率响应图表

### 类型安全

完整的 TypeScript 类型定义，确保输入输出类型正确。

## 📐 计算标准

### IPC-2152 标准

PCB 过孔和走线电流计算基于 IPC-2152 标准，这是目前业界公认的 PCB 热设计标准。

主要计算公式：
- 过孔截面积: `A = π × (r² - r_inner²)`
- 最大电流: `I = k × A^0.44 × (ΔT/10)^0.5`
- 电阻: `R = ρ × L / A`

## 🚢 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署到 GitHub Pages。

每次推送到 `main` 分支，会自动构建并部署。

### 手动部署

1. 构建静态文件: `npm run build`
2. 将 `out` 目录内容部署到任意静态托管服务

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [IPC-2152](https://www.ipc.org/) - PCB 设计标准
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
