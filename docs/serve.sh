#!/bin/bash

# 图图插件官网本地服务器启动脚本

echo "🌐 启动图图插件官网本地服务器..."

# 检查必要文件是否存在
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 找不到 index.html 文件"
    echo "💡 提示: 请确保在docs目录中运行此脚本"
    echo "💡 提示: cd docs && ./serve.sh"
    exit 1
fi

# 选择可用的服务器
PORT=8000

echo "📁 当前目录: $(pwd)"
echo "🔍 检查可用的服务器工具..."

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python3 启动服务器"
    echo "🚀 服务器启动在: http://localhost:$PORT"
    echo "💡 按 Ctrl+C 停止服务器"
    echo "📝 官网文件位于: docs/ 目录"
    echo ""
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 启动服务器"
    echo "🚀 服务器启动在: http://localhost:$PORT"
    echo "💡 按 Ctrl+C 停止服务器"
    echo "📝 官网文件位于: docs/ 目录"
    echo ""
    python -m SimpleHTTPServer $PORT
# 检查Node.js serve是否可用
elif command -v npx &> /dev/null; then
    echo "✅ 使用 Node.js serve 启动服务器"
    echo "🚀 服务器启动在: http://localhost:$PORT"
    echo "💡 按 Ctrl+C 停止服务器"
    echo "📝 官网文件位于: docs/ 目录"
    echo ""
    npx serve . -p $PORT
# 检查PHP是否可用
elif command -v php &> /dev/null; then
    echo "✅ 使用 PHP 启动服务器"
    echo "🚀 服务器启动在: http://localhost:$PORT"
    echo "💡 按 Ctrl+C 停止服务器"
    echo "📝 官网文件位于: docs/ 目录"
    echo ""
    php -S localhost:$PORT
else
    echo "❌ 未找到可用的服务器工具"
    echo ""
    echo "请安装以下工具之一:"
    echo "  • Python: brew install python (macOS) 或 apt install python3 (Ubuntu)"
    echo "  • Node.js: https://nodejs.org/"
    echo "  • PHP: brew install php (macOS) 或 apt install php (Ubuntu)"
    echo ""
    echo "或者使用 VS Code 的 Live Server 扩展"
    exit 1
fi 