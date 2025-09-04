# 🚀 Web3 AI Chat

一个基于React构建的未来感Web3风格AI聊天界面，具有酷炫的视觉效果和流畅的交互体验。

![Web3 AI Chat Preview](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ 特色功能

- 🎨 **Web3未来感设计** - 采用深色主题配合紫色/青色渐变，营造科技感
- 💫 **动态背景效果** - 多层次的动画背景和浮动装饰元素
- 💬 **实时聊天界面** - 真实的AI对话功能，支持会话持久化
- 🌟 **玻璃态设计** - 半透明背景配合背景模糊效果
- 📱 **响应式布局** - 完美适配桌面和移动设备
- ⚡ **流畅动画** - 丰富的过渡动画和交互效果
- 🎯 **直观交互** - 键盘快捷键和状态反馈
- 🔗 **GraphQL集成** - 使用Apollo Client进行数据管理

## 🛠 技术栈

- **React 18.2.0** - 现代化的前端框架
- **Apollo Client** - GraphQL客户端，支持缓存和状态管理
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 美观的图标库
- **GraphQL** - 数据查询和API管理

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/leonaries/web3-ai-chat.git
   cd web3-ai-chat
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者使用 yarn
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   # 或者使用 yarn
   yarn start
   ```

4. **打开浏览器访问**
   ```
   http://localhost:3000
   ```

## 📦 构建部署

### 构建生产版本

```bash
npm run build
```

构建完成后，`build` 文件夹包含了可以部署的静态文件。

### Cloudflare Pages 部署配置

```
框架预设: React Static
构建命令: npm run build
构建输出目录: build
Node.js 版本: 18
```

### 部署选项

- **Cloudflare Pages** - 连接GitHub仓库自动部署
- **Vercel** - 一键部署
- **Netlify** - 拖拽部署
- **GitHub Pages** - 使用 Actions 自动部署

## 🎨 界面预览

### 主要界面
- 🌌 动态渐变背景与浮动装饰元素
- 💎 玻璃态UI元素和现代化交互
- 🤖 AI助手智能对话系统
- 👤 用户消息实时显示
- ⚡ 连接状态和加载指示器

### 交互功能
- `Enter` - 发送消息
- `Shift + Enter` - 换行输入
- 自动滚动到最新消息
- 错误处理和重试机制
- 会话状态持久化

## 🔧 自定义配置

### GraphQL端点配置

在 `src/graphql/apolloClient.js` 中配置API端点：

```javascript
const client = new ApolloClient({
  uri: 'YOUR_GRAPHQL_ENDPOINT',
  cache: new InMemoryCache(),
});
```

### 修改颜色主题

在 Tailwind 配置中自定义颜色：

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-secondary-color',
    }
  }
}
```

## 📱 移动端适配

项目完全支持移动端，包括：
- 触摸友好的界面设计
- 响应式布局适配
- 移动端优化的动画效果
- 适配不同屏幕尺寸

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 这个项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个Pull Request

## 📄 开源协议

这个项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 优秀的前端框架
- [Apollo GraphQL](https://www.apollographql.com/) - 强大的GraphQL工具链
- [Tailwind CSS](https://tailwindcss.com/) - 强大的CSS框架
- [Lucide](https://lucide.dev/) - 美观的图标库

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

🚀 Built with ❤️ by [leonaries](https://github.com/leonaries)

📅 Last updated: September 2025