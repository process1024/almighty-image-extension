# 开发指南

## 代码质量工具

本项目配置了完整的代码质量工具链，包括 ESLint、Prettier 和 TypeScript。

### 可用的脚本

```bash
# 代码检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 代码格式化
npm run format

# 检查代码格式
npm run format:check

# TypeScript 类型检查
npm run type-check

# 运行所有检查
npm run check

# 自动修复所有问题
npm run fix
```

### ESLint 配置

ESLint 配置包含以下特性：

- **TypeScript 支持**：完整的 TypeScript 规则集
- **React 支持**：React 和 React Hooks 规则
- **代码质量**：防止常见错误和不良实践
- **代码风格**：统一的代码风格规则
- **浏览器扩展特定规则**：针对浏览器扩展的安全规则

### Prettier 配置

Prettier 配置包含：

- **导入排序**：自动排序和分组导入语句
- **代码格式化**：统一的代码格式
- **TypeScript 支持**：支持 TypeScript 语法

### TypeScript 配置

TypeScript 配置启用了严格模式，包括：

- `strict: true`：启用所有严格类型检查
- `noImplicitAny`：禁止隐式的 any 类型
- `noUnusedLocals`：检查未使用的局部变量
- `noUnusedParameters`：检查未使用的参数
- `exactOptionalPropertyTypes`：精确的可选属性类型

## VS Code 配置

项目包含 VS Code 工作区配置：

- **自动格式化**：保存时自动格式化代码
- **ESLint 集成**：保存时自动修复 ESLint 问题
- **导入排序**：保存时自动整理导入语句
- **文件排除**：隐藏不必要的文件和目录

### 推荐的 VS Code 扩展

- Prettier - Code formatter
- ESLint
- TypeScript Importer
- Auto Rename Tag
- Path Intellisense

## 开发工作流

1. **开发前**：运行 `npm run check` 确保代码质量
2. **开发中**：VS Code 会自动格式化和检查代码
3. **提交前**：运行 `npm run fix` 自动修复所有问题
4. **CI/CD**：使用 `npm run check` 进行自动化检查

## 代码规范

### 导入顺序

导入语句按以下顺序排列：

1. Node.js 内置模块
2. 第三方模块
3. Plasmo 相关模块
4. 项目内部模块（使用 `~` 别名）
5. 相对路径导入

### 代码风格

- 使用单引号
- 使用 2 个空格缩进
- 行长度限制为 100 字符
- 使用分号
- 使用尾随逗号

### React 规范

- 使用函数组件和 Hooks
- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 规则
- 使用 React Refresh 进行热重载

## 故障排除

### 常见问题

1. **ESLint 错误**：运行 `npm run lint:fix` 自动修复
2. **格式问题**：运行 `npm run format` 重新格式化
3. **类型错误**：检查 TypeScript 配置和类型定义

### 性能优化

- 使用 `.eslintignore` 和 `.prettierignore` 排除不必要的文件
- 配置 VS Code 以在保存时自动修复问题
- 使用 TypeScript 的增量编译功能
