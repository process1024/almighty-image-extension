#!/bin/bash

# 图图插件官网部署脚本
# 用于快速部署网站到GitHub Pages

echo "🚀 开始部署图图插件官网..."

# 检查是否在正确的目录中
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在docs目录中运行此脚本"
    echo "💡 提示: cd docs && ./deploy.sh"
    exit 1
fi

# 检查是否在git仓库中
if [ ! -d "../.git" ]; then
    echo "❌ 错误: 请在git仓库根目录的docs子目录中运行此脚本"
    exit 1
fi

# 检查必要文件是否存在
required_files=("index.html" "styles.css" "script.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 错误: 缺少必要文件 $file"
        exit 1
    fi
done

echo "✅ 文件检查通过"

# 切换到项目根目录
cd ..

# 添加所有更改
echo "📝 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
read -p "请输入提交信息 (默认: Update website): " commit_message
commit_message=${commit_message:-"Update website"}
git commit -m "$commit_message"

# 推送到远程仓库
echo "⬆️  推送到远程仓库..."
git push origin main

echo "✅ 部署完成!"
echo ""
echo "📄 接下来的步骤:"
echo "1. 前往GitHub仓库设置页面"
echo "2. 找到'Pages'选项"
echo "3. 选择'Deploy from a branch'"
echo "4. 选择'main'分支和'docs'文件夹"
echo "5. 保存设置"
echo ""
echo "🌐 网站将在几分钟后在以下地址可用:"
echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')" 