# For柚 - 趣味学习平台 📱

一个基于 React + TypeScript + Ant Design 的儿童趣味学习应用，采用手机桌面风格设计，可爱又实用！

## ✨ 功能特性

- 🧮 **怪兽数学练习** - 加减乘运算练习，支持难度选择和计分系统
- 📚 **单词复习** - 幼升小必备词汇，支持学习模式和测验模式
- 🔤 **趣味英语** - 字母发音练习，听音选字母
- 🎮 **记忆配对游戏** - 单词记忆配对小游戏，支持多种难度

## 🎨 设计特色

- 📱 **手机桌面风格** - 类似 iOS/Android 主屏幕的应用图标布局
- 🎀 **可爱风格** - 柔和的粉色调、圆角设计、流畅动画
- 📱 **移动端优先** - 专为手机屏幕优化，响应式设计
- 🎯 **底部导航栏** - 便捷的底部导航，快速切换功能

## 🛠 技术栈

- React 18
- TypeScript
- Ant Design 5
- React Router 6
- Create React App

## 🚀 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 📦 部署到 GitHub Pages

### 自动部署（推荐）

项目已配置 GitHub Actions，推送到 `main` 分支后会自动部署。

**步骤：**

1. 确保 GitHub Actions 已启用
   - 进入仓库 Settings → Actions → General
   - 确保 "Workflow permissions" 设置为 "Read and write permissions"

2. 推送代码到 main 分支
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

3. 查看部署状态
   - 进入仓库的 Actions 标签页
   - 查看 "Deploy to GitHub Pages" 工作流状态

4. 访问网站
   - 部署完成后，访问：https://leiyourong.github.io/foryou
   - 首次部署可能需要几分钟

### 手动部署

```bash
# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## 📁 项目结构

```
src/
├── components/      # 公共组件
│   └── AvatarPicker.tsx
├── pages/          # 页面组件
│   ├── Home.tsx           # 手机桌面主页
│   ├── MonsterMath.tsx    # 数学练习
│   ├── Vocabulary.tsx     # 单词复习
│   ├── English.tsx        # 英语练习
│   └── Games.tsx          # 记忆配对游戏
├── data/           # 数据文件
│   └── vocabularyData.ts
├── utils/          # 工具函数
│   └── speech.ts
├── App.tsx         # 主应用组件（含底部导航）
└── index.tsx      # 入口文件
```

## 🌐 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

**注意：** 语音功能需要浏览器支持 Web Speech API。

## 📱 移动端优化

- 响应式设计，适配各种屏幕尺寸
- 触摸友好的交互设计
- 流畅的动画效果
- 优化的性能表现

## 📄 License

MIT
