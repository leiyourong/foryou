# GitHub Pages 部署指南

## 自动部署（推荐）

项目已配置 GitHub Actions，推送到 `main` 分支后会自动部署。

### 步骤：

1. **确保 GitHub Actions 已启用**
   - 进入仓库 Settings → Actions → General
   - 确保 "Workflow permissions" 设置为 "Read and write permissions"

2. **推送代码到 main 分支**
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

3. **查看部署状态**
   - 进入仓库的 Actions 标签页
   - 查看 "Deploy to GitHub Pages" 工作流状态

4. **访问网站**
   - 部署完成后，访问：https://leiyourong.github.io/foryou
   - 首次部署可能需要几分钟

## 手动部署

如果需要手动部署：

```bash
# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 注意事项

- 确保 `package.json` 中的 `homepage` 字段正确设置为你的 GitHub Pages URL
- 如果使用自定义域名，需要在仓库 Settings → Pages 中配置
- 部署后可能需要等待几分钟才能看到更新

