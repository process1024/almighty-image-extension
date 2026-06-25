# 项目目录结构说明

## 概述

本项目是一个基于 Plasmo 框架的浏览器扩展，采用 React + TypeScript 技术栈。经过优化后的目录结构更加清晰，职责分离明确，便于维护和扩展。

## 当前状态

本文档描述的是目标结构，不完全等同于当前源码目录。当前已先落地基础边界：

- `src/shared/chrome/`：统一封装 Chrome runtime、tabs、extension URL 和消息类型。
- `src/services/message.ts`、`src/services/tabHelper.ts`：保留为兼容出口，内部委托给 `src/shared/chrome/`。

后续迁移建议按功能域渐进推进，例如 `features/capture`、`features/batchPin`、`features/editor`，避免一次性大规模移动文件导致回归风险。

## 目录结构

```
almighty-image-extension/
├── public/                          # 静态资源目录
│   └── assets/                      # 统一资源目录
│       ├── icons/                   # 图标资源
│       │   ├── common/              # 通用图标
│       │   ├── editor/              # 编辑器图标
│       │   └── ui/                  # UI图标
│       ├── images/                  # 图片资源
│       └── docs/                    # 文档资源
├── src/                             # 源码目录
│   ├── background/                  # 后台脚本
│   │   ├── index.ts                 # 入口文件
│   │   └── services/                # 后台服务
│   ├── content/                     # 内容脚本
│   │   ├── index.tsx                # 入口文件
│   │   └── components/              # 内容脚本组件
│   ├── popup/                       # 弹窗页面
│   │   ├── index.tsx                # 入口文件
│   │   ├── components/              # 弹窗组件
│   │   └── styles/                  # 弹窗样式
│   ├── tabs/                        # 标签页
│   │   ├── editor/                  # 图片编辑器
│   │   │   ├── index.tsx            # 入口文件
│   │   │   ├── components/          # 编辑器组件
│   │   │   │   ├── tools/           # 工具组件
│   │   │   │   │   ├── ArrowTool/   # 箭头工具
│   │   │   │   │   ├── BrushTool/   # 画笔工具
│   │   │   │   │   ├── EllipseTool/ # 椭圆工具
│   │   │   │   │   ├── MosaicTool/  # 马赛克工具
│   │   │   │   │   ├── RectTool/    # 矩形工具
│   │   │   │   │   └── TextTool/    # 文本工具
│   │   │   │   ├── common/          # 通用组件
│   │   │   │   └── icons/           # 图标组件
│   │   │   ├── hooks/               # 编辑器hooks
│   │   │   ├── constants/           # 编辑器常量
│   │   │   ├── utils/               # 编辑器工具
│   │   │   └── styles/              # 编辑器样式
│   │   └── processor/               # 图片处理器
│   │       ├── index.tsx            # 入口文件
│   │       ├── components/          # 处理器组件
│   │       └── utils/               # 处理器工具
│   ├── shared/                      # 共享模块
│   │   ├── components/              # 共享组件
│   │   │   ├── BatchPin/            # 批量管理
│   │   │   ├── Capture/             # 截图组件
│   │   │   ├── DragSelect/          # 拖拽选择
│   │   │   ├── Loading/             # 加载组件
│   │   │   ├── Masonry/             # 瀑布流
│   │   │   └── Resizer/             # 尺寸调整
│   │   ├── hooks/                   # 共享hooks
│   │   ├── services/                # 共享服务
│   │   │   ├── capture.ts           # 截图服务
│   │   │   ├── config.ts            # 配置服务
│   │   │   ├── message.ts           # 消息服务
│   │   │   ├── pin.ts               # 批量管理服务
│   │   │   └── tabHelper.ts         # 标签页助手
│   │   ├── utils/                   # 共享工具
│   │   │   ├── base64.ts            # Base64工具
│   │   │   ├── cdnRule.ts           # CDN规则
│   │   │   ├── download.ts          # 下载工具
│   │   │   ├── element.ts           # DOM工具
│   │   │   ├── image.ts             # 图片工具
│   │   │   └── util.ts              # 通用工具
│   │   ├── types/                   # 共享类型
│   │   │   ├── extensionConfig.ts   # 扩展配置类型
│   │   │   ├── pin.ts               # 批量管理类型
│   │   │   └── preference.ts        # 偏好设置类型
│   │   └── styles/                  # 共享样式
│   │       ├── theme.less           # 主题样式
│   │       └── global.less          # 全局样式
│   └── content.tsx                  # 内容脚本入口（保留兼容性）
├── docs/                            # 文档网站
├── build/                           # 构建输出
├── scripts/                         # 构建脚本
├── .plasmo/                         # Plasmo配置
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc.mjs
└── README.md
```

## 目录说明

### public/

静态资源目录，包含所有不需要编译的资源文件。

- **assets/icons/**: 图标资源，按功能分类
- **assets/images/**: 图片资源
- **assets/docs/**: 文档相关资源

### src/

源码目录，包含所有需要编译的代码。

#### background/

后台脚本，负责扩展的核心逻辑。

#### content/

内容脚本，注入到网页中的脚本。

#### popup/

弹窗页面，扩展的弹出界面。

#### tabs/

标签页，独立的页面。

- **editor/**: 图片编辑器
- **processor/**: 图片处理器

#### shared/

共享模块，被多个模块共同使用的代码。

- **components/**: 共享组件
- **hooks/**: 共享的React Hooks
- **services/**: 共享服务
- **utils/**: 共享工具函数
- **types/**: 共享类型定义
- **styles/**: 共享样式

## 命名规范

### 文件命名

- 组件文件：PascalCase（如 `BatchPin.tsx`）
- 工具文件：camelCase（如 `imageUtils.ts`）
- 类型文件：camelCase（如 `extensionConfig.ts`）
- 样式文件：camelCase（如 `global.less`）

### 目录命名

- 使用 PascalCase 或 kebab-case
- 组件目录使用 PascalCase
- 工具目录使用 camelCase

## 导入规范

### 相对路径

- 同一目录下的文件使用相对路径
- 跨目录的文件使用绝对路径（从 src 开始）

### 导入顺序

1. React 相关导入
2. 第三方库导入
3. 共享模块导入
4. 本地模块导入
5. 样式导入

## 开发指南

### 添加新组件

1. 确定组件类型（共享/特定功能）
2. 在对应目录创建组件文件
3. 创建组件的样式文件
4. 更新相关文档

### 添加新工具函数

1. 确定函数类型（通用/特定功能）
2. 在 `src/shared/utils/` 或对应目录创建文件
3. 导出函数
4. 更新类型定义

### 添加新服务

1. 在 `src/shared/services/` 创建服务文件
2. 定义服务接口
3. 实现服务逻辑
4. 更新相关文档

## 迁移指南

### 从旧结构迁移

1. 运行迁移脚本：`node scripts/migrate-imports.js`
2. 检查并修复导入路径
3. 更新组件引用
4. 测试功能完整性

### 注意事项

- 保持向后兼容性
- 逐步迁移，避免一次性大改动
- 充分测试每个迁移步骤
- 及时更新文档
