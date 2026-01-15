#!/bin/bash
# 部署脚本 - 一键部署到 GitHub Pages

echo "🚀 开始部署流程..."

# 1. 权限清理（针对 build-tmp）
if [ -d "build-tmp" ]; then
    echo "🧹 清理旧构建文件..."
    chmod -R u+w build-tmp 2>/dev/null || true
    rm -rf build-tmp
fi

# 2. 执行 npm run deploy
# 注意：package.json 中的 deploy 命令已经包含了构建步骤 (predeploy)
echo "� 执行构建并推送..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://leiyourong.github.io/foryou"
    echo "💡 提示：GitHub Pages 可能需要几分钟才能刷新显示最新内容。"
else
    echo "❌ 部署失败，请检查上方错误日志。"
    exit 1
fi

