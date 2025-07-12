# 图图插件官网

这是图图插件 (Almighty Image Extension) 的官方网站，用于展示插件的功能特性和提供下载服务。

## 🌟 网站特性

- **现代化设计**: 采用现代化的UI设计，响应式布局
- **平滑动画**: 流畅的滚动动画和交互效果
- **响应式**: 完美适配桌面端、平板和移动设备
- **性能优化**: 懒加载、预加载等性能优化技术
- **SEO友好**: 完善的meta标签和语义化HTML结构

## 📁 文件结构

```
almighty-image-extension/
├── docs/                   # 官网文件
│   ├── index.html          # 网站主页
│   ├── styles.css          # 样式文件
│   ├── script.js           # JavaScript交互文件
│   ├── assets/             # 官网资源文件
│   ├── screenshots/        # 产品截图目录
│   ├── deploy.sh           # 部署脚本
│   ├── serve.sh            # 本地服务器脚本
│   └── README.md           # 官网说明文档
├── src/                    # 扩展源码
│   ├── assets/             # 扩展资源文件
│   │   └── qiantu-logo.svg # 项目Logo
│   ├── popup/              # 弹窗组件
│   ├── tabs/               # 标签页组件
│   └── ...                 # 其他扩展文件
├── .cursor/                # Cursor AI 规则
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目主README
```

## 🚀 快速开始

### 本地开发

1. **克隆项目**

   ```bash
   git clone https://github.com/process1024/almighty-image-extension.git
   cd almighty-image-extension/docs
   ```

2. **启动本地服务器**

   ```bash
   # 在 docs 目录中运行
   ./serve.sh

   # 或者手动启动
   python3 -m http.server 8000
   ```

3. **访问网站**
   打开浏览器访问 `http://localhost:8000`

### 部署到生产环境

#### GitHub Pages 部署

1. **推送到GitHub**

   ```bash
   # 在项目根目录运行
   cd docs
   ./deploy.sh
   ```

2. **启用GitHub Pages**

   - 进入GitHub仓库设置
   - 找到"Pages"选项
   - 选择"Deploy from a branch"
   - 选择"main"分支和"docs"文件夹
   - 保存设置

3. **访问网站**
   网站将在 `https://yourusername.github.io/almighty-image-extension` 上线

#### Netlify 部署

1. **连接GitHub仓库**

   - 登录Netlify
   - 点击"New site from Git"
   - 选择GitHub并授权
   - 选择项目仓库

2. **配置构建设置**

   - Build command: (留空)
   - Publish directory: `docs`

3. **部署**
   - 点击"Deploy site"
   - 网站将自动部署并分配域名

#### Vercel 部署

1. **连接项目**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **配置设置**

   - 选择项目类型: "Other"
   - 输出目录: `docs`

3. **完成部署**
   - 按照提示完成配置
   - 获得部署URL

## 🎨 自定义配置

### 添加截图

1. **准备截图文件**

   - 建议尺寸: 1920x1200 或 16:10 比例
   - 格式: PNG/JPG
   - 优化文件大小

2. **保存截图**
   将截图保存到 `docs/screenshots/` 目录

3. **替换占位符**
   在 `docs/index.html` 中找到对应的占位符区域：
   ```html
   <div class="screenshot-placeholder">
     <!-- 替换为实际截图 -->
     <img src="screenshots/popup-interface.png" alt="弹窗界面" />
   </div>
   ```

### 修改主题色彩

在 `docs/styles.css` 的 `:root` 中修改CSS变量：

```css
:root {
  --primary-color: #3b82f6; /* 主色调 */
  --secondary-color: #8b5cf6; /* 次要色调 */
  --accent-color: #06b6d4; /* 强调色 */
  /* ... 其他颜色变量 */
}
```

### 更新内容

编辑 `docs/index.html` 中的内容：

- 修改功能介绍文字
- 更新技术栈信息
- 添加新的功能特性
- 更改下载链接

## 📱 响应式断点

- **桌面端**: > 768px
- **平板端**: 481px - 768px
- **移动端**: ≤ 480px

## 🔧 技术栈

- **HTML5**: 语义化标签，SEO优化
- **CSS3**: Flexbox/Grid布局，CSS变量，动画
- **JavaScript**: ES6+，Intersection Observer API
- **图标**: SVG图标，轻量化设计

## 🎯 性能优化

- **图片优化**: SVG图标，适当的图片格式
- **代码压缩**: CSS/JS文件可进一步压缩
- **懒加载**: 图片懒加载，按需加载
- **缓存策略**: 静态资源缓存优化

## 🐛 常见问题

### Q: 如何修改下载链接？

A: 在 `docs/index.html` 中找到下载按钮，修改 `href` 属性：

```html
<a href="https://github.com/your-repo/releases" class="btn btn-primary">
  <!-- 按钮内容 -->
</a>
```

### Q: 如何添加新的功能特性？

A: 在功能特性部分添加新的 `feature-card`：

```html
<div class="feature-card">
  <div class="feature-icon"><!-- 图标 --></div>
  <h3 class="feature-title">新功能</h3>
  <p class="feature-description">功能描述</p>
  <ul class="feature-list">
    <li>🔹 特性1</li>
    <li>🔹 特性2</li>
  </ul>
</div>
```

### Q: 如何自定义移动端菜单？

A: 菜单样式在 `docs/script.js` 中动态添加，也可以移到 `docs/styles.css` 中：

```css
@media (max-width: 768px) {
  .nav-menu {
    /* 自定义样式 */
  }
}
```

### Q: 为什么Logo不显示？

A: 确保Logo文件路径正确。官网从 `docs/` 目录访问项目Logo，路径应为 `../src/assets/qiantu-logo.svg`。

## 📄 许可证

本网站代码遵循 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进网站！

---

**注意**:

- 记得定期更新截图和内容，保持网站信息的时效性
- 运行脚本前请确保在正确的目录中（`docs/` 目录）
- 如果Logo不显示，请检查 `src/assets/qiantu-logo.svg` 文件是否存在
