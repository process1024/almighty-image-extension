#!/bin/bash

# 图图插件官网快速启动脚本
# 用于从项目根目录快速启动官网服务器

echo "🚀 启动图图插件官网..."

# 检查docs目录是否存在
if [ ! -d "docs" ]; then
    echo "❌ 错误: 找不到docs目录"
    exit 1
fi

# 切换到docs目录并启动服务器
cd docs && ./serve.sh 