# 项目目录结构优化方案

## 当前问题分析

### 1. 资源文件分散

- `assets/` - 根目录资源（主要是图标）
- `src/assets/` - 源码资源（编辑器相关图标）
- 建议：统一到 `public/assets/` 下，按功能分类

### 2. 组件结构混乱

- `src/components/` - 通用组件（BatchPin, Capture等）
- `src/tabs/components/` - 编辑器工具组件
- 建议：按功能域重新组织

### 3. 工具函数分散

- `src/utils/` - 通用工具
- `src/tabs/utils/` - 编辑器工具
- 建议：统一到 `src/utils/` 下，按模块分类

### 4. 服务层职责不清

- `src/services/` 中混合了 hooks 和业务服务
- 建议：分离 hooks 和业务服务

## 优化后的目录结构

```
almighty-image-extension/
├── public/                          # 静态资源
│   ├── assets/                      # 统一资源目录
│   │   ├── icons/                   # 图标资源
│   │   │   ├── common/              # 通用图标
│   │   │   ├── editor/              # 编辑器图标
│   │   │   └── ui/                  # UI图标
│   │   ├── images/                  # 图片资源
│   │   └── docs/                    # 文档资源
│   └── manifest.json                # 扩展清单
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
│   │   │   │   │   ├── ArrowTool/
│   │   │   │   │   ├── BrushTool/
│   │   │   │   │   ├── EllipseTool/
│   │   │   │   │   ├── MosaicTool/
│   │   │   │   │   ├── RectTool/
│   │   │   │   │   └── TextTool/
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
├── .plasmo/                         # Plasmo配置
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc.mjs
└── README.md
```

## 迁移计划

### 第一阶段：资源整合

1. 创建 `public/assets/` 目录结构
2. 迁移 `assets/` 和 `src/assets/` 到新结构
3. 更新所有资源引用路径

### 第二阶段：组件重组

1. 创建 `src/shared/components/` 目录
2. 迁移通用组件到共享目录
3. 重组编辑器组件结构

### 第三阶段：工具函数整合

1. 整合 `src/utils/` 和 `src/tabs/utils/`
2. 按功能模块重新组织工具函数
3. 更新所有导入路径

### 第四阶段：服务层优化

1. 分离 hooks 和业务服务
2. 创建 `src/shared/services/` 目录
3. 优化服务层架构

### 第五阶段：类型定义整理

1. 统一类型定义到 `src/shared/types/`
2. 按功能域组织类型文件
3. 优化类型导出结构

## 优化收益

1. **更清晰的职责分离**：每个目录都有明确的职责
2. **更好的可维护性**：相关文件集中管理
3. **更高的可扩展性**：模块化结构便于扩展
4. **更好的开发体验**：统一的命名规范和目录结构
5. **更好的团队协作**：清晰的目录结构便于团队理解

## 实施建议

1. **渐进式迁移**：分阶段进行，避免一次性大改动
2. **保持兼容性**：迁移过程中保持现有功能正常
3. **自动化脚本**：编写迁移脚本减少手动操作
4. **充分测试**：每个阶段完成后进行充分测试
5. **文档更新**：及时更新相关文档和注释
