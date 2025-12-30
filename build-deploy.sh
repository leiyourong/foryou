#!/bin/bash
# 部署脚本 - 修复权限并部署到 GitHub Pages

echo "🚀 开始部署到 GitHub Pages..."

# 1. 修复 build 目录权限（如果需要）
if [ -d "build" ]; then
    echo "📁 修复 build 目录权限..."
    chmod -R u+w build 2>/dev/null || true
    rm -rf build
fi

# 2. 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

# 3. 部署到 GitHub Pages
echo "📤 部署到 GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://leiyourong.github.io/foryou"
else
    echo "❌ 部署失败！"
    exit 1
fi

