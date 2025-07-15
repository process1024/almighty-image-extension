# 图图插件 (TuTu Extension)

🖼️ 一个功能强大的浏览器扩展，集成了图片批量选择下载、智能截图、图片编辑标注等功能，为用户提供一站式的图片处理解决方案。

## ✨ 功能特性

### 📷 智能截图

- **区域截图**: 拖拽选择任意区域进行截图
- **整页截图**: 支持超长页面的完整截图
- **当前页面截图**: 一键截取当前可视区域

### 🖼️ 批量图片管理

- **批量选择**: 智能识别页面中的所有图片
- **瀑布流展示**: 优雅的图片预览界面
- **批量下载**: 一键下载选中的所有图片
- **拖拽选择**: 支持框选多张图片

### 🎨 图片编辑标注

- **丰富的绘图工具**:

  - 📝 文本标注 (支持字体、颜色、大小自定义)
  - ➡️ 箭头工具 (多种样式和颜色)
  - 🖌️ 自由画笔 (可调节粗细和颜色)
  - 📐 矩形工具 (边框、填充、透明度)
  - ⭕ 椭圆工具 (圆形、椭圆形状)
  - 🔳 马赛克工具 (隐私保护)

- **编辑功能**:
  - ↩️ 撤销/重做操作
  - 🎯 精确对象选择和编辑
  - 📋 复制到剪贴板
  - 💾 导出下载

## 🛠️ 技术栈

### 核心框架

- **[Plasmo](https://plasmo.com/)** - 现代化的浏览器扩展开发框架
- **React 18** - 用户界面构建
- **TypeScript** - 类型安全的JavaScript

### UI 组件库

- **[Ant Design](https://ant.design/)** - 企业级UI设计语言
- **[Material-UI](https://mui.com/)** - React UI组件库
- **[Styled Components](https://styled-components.com/)** - CSS-in-JS样式解决方案

### 图像处理

- **[Fabric.js](http://fabricjs.com/)** - 强大的HTML5画布库，用于图片编辑
- **[React Color](https://casesandberg.github.io/react-color/)** - 颜色选择器组件

### 工具库

- **[ahooks](https://ahooks.js.org/)** - React Hooks工具库
- **[Lodash-ES](https://lodash.com/)** - 实用工具函数库
- **[react-selecto](https://daybrush.com/selecto/)** - 拖拽选择组件

## 📁 项目结构

```
src/
├── background/          # 后台脚本
│   └── index.ts        # 扩展后台逻辑
├── content.tsx         # 内容脚本 (注入页面)
├── popup/              # 弹窗界面
│   ├── index.tsx       # 弹窗主界面
│   └── index.less      # 弹窗样式
├── sidepanel.tsx       # 侧边栏界面
├── tabs/               # 图片编辑器
│   ├── edit.tsx        # 编辑器主界面
│   ├── hooks/          # 编辑器相关hooks
│   │   ├── useCanvas.ts      # 画布管理
│   │   ├── useHistory.ts     # 历史记录管理
│   │   └── useCanvasActions.ts # 画布操作
│   ├── components/     # 编辑工具组件
│   │   ├── ArrowTool/        # 箭头工具
│   │   ├── TextTool/         # 文本工具
│   │   ├── BrushTool/        # 画笔工具
│   │   ├── RectTool/         # 矩形工具
│   │   ├── EllipseTool/      # 椭圆工具
│   │   ├── MosaicTool/       # 马赛克工具
│   │   ├── Icons/            # 图标组件
│   │   └── common/           # 通用组件
│   ├── constants/      # 常量定义
│   ├── utils/          # 工具函数
│   └── styles/         # 样式文件
├── components/         # 通用组件
│   ├── BatchPin/       # 批量图片选择
│   ├── Capture/        # 截图组件
│   ├── DragSelect/     # 拖拽选择
│   ├── Masonry/        # 瀑布流布局
│   ├── Crosshair/      # 十字光标
│   ├── Loading/        # 加载组件
│   └── Resizer/        # 尺寸调整
├── services/           # 服务层
├── utils/              # 工具函数
├── types/              # 类型定义
├── styles/             # 全局样式
└── assets/             # 静态资源
```

## 🚀 开发环境

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建打包

```bash
pnpm build
```

### 打包扩展

```bash
pnpm package
```

## 📦 安装使用

### Chrome 浏览器安装

1. 下载项目并运行 `pnpm build`
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `build/chrome-mv3-prod` 文件夹

### 功能使用

#### 🖼️ 批量下载图片

1. 在任意网页上右键，选择"批量选择图片"
2. 使用拖拽或点击选择需要的图片
3. 点击"下载选中图片"

#### 📷 截图功能

1. 点击扩展图标
2. 选择截图类型:
   - 区域截图: 拖拽选择区域
   - 整页截图: 自动截取完整页面
   - 当前页面: 截取可视区域

#### 🎨 图片编辑

1. 截图后会自动打开编辑器
2. 使用左侧工具栏进行标注:
   - 选择工具 (文本、箭头、画笔等)
   - 调整样式 (颜色、大小、透明度等)
   - 添加标注和说明
3. 完成后点击"下载"保存图片

## 🎯 核心特性

### 智能交互

- **工具状态管理**: 智能区分用户主动选择和自动激活的工具状态
- **选择联动**: 选择元素时自动激活对应工具，取消选择时恢复原工具状态
- **历史记录**: 支持撤销/重做，防抖优化性能

### 类型安全

- **完整的 TypeScript 支持**: 包含 Fabric.js 类型定义
- **Chrome 扩展 API 类型**: 完善的浏览器 API 类型支持
- **组件类型定义**: 所有组件都有完整的属性类型

### 性能优化

- **防抖机制**: 编辑操作使用防抖避免频繁保存
- **懒加载**: 组件按需加载，提升启动速度
- **内存管理**: 画布对象的正确创建和销毁

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

[@process1024](https://github.com/process1024)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
