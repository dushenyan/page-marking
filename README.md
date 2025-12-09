# 页面标记遮罩

一个强大的油猴插件，可以对网页进行遮罩处理，支持模糊和遮罩两种模式，帮助减少屏幕眩光和提高阅读体验。

![页面标记遮罩演示](/image/image.png)

![控制面板界面](/image/image-1.png)

## 功能特性

- 🎨 **多种遮罩模式**：支持模糊、黑色遮罩或两者结合
- 🎛️ **丰富的自定义选项**：可调节模糊强度和遮罩透明度
- 🖱️ **可拖动控制按钮**：按钮位置可自由调整，支持边缘吸附
- 🎯 **智能油猴菜单**：通过油猴菜单快速管理插件设置
- ⌨️ **便捷快捷键**：F8切换遮罩，F9打开控制面板，ESC关闭面板
- 👁️ **按钮显示控制**：可隐藏浮动按钮，完全通过快捷键或菜单操作
- 💾 **配置持久化**：所有设置自动保存，下次访问自动恢复
- 🌐 **SPA应用支持**：自动监听URL变化，适应单页应用

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 代码检查和格式化

```bash
pnpm lint        # 运行ESLint检查
pnpm lint:fix    # 修复ESLint问题
pnpm format      # 格式化代码
```

## 安装与使用

### 安装步骤

1. 克隆或下载本项目
2. 运行 `pnpm install` 安装依赖
3. 运行 `pnpm build` 构建插件
4. 在 `dist` 目录中找到生成的 `.user.js` 文件
5. 将此文件安装到 [Tampermonkey](https://www.tampermonkey.net/) 或其他油猴插件管理器

### 使用方法

#### 基本操作

- **单击浮动按钮**：切换页面遮罩开关
- **双击浮动按钮**：打开控制面板
- **拖动浮动按钮**：调整按钮位置（支持边缘吸附）

#### 快捷键

- **F8**：切换页面遮罩
- **F9**：打开/关闭控制面板
- **ESC**：关闭控制面板

#### 油猴菜单

在油猴插件管理界面中，点击脚本旁的菜单图标，可以使用以下功能：

- 🔄 **切换页面遮罩**：一键开启/关闭页面遮罩
- ⚙️ **打开控制面板**：打开详细的控制面板
- 👁️ **显示/隐藏控制按钮**：切换浮动按钮的显示状态
- 🔧 **打开油猴配置**：快速跳转到油猴脚本配置页面

### 高级设置

通过控制面板可以进行以下设置：

- **基础设置**：
  - 启用/禁用页面遮罩
  - 显示/隐藏控制按钮
  - 选择遮罩模式（模糊/遮罩/模糊+遮罩）
  - 调节模糊强度（0-20px）
  - 调节遮罩透明度（0-100%）

## 项目结构

```
src/
├── main.ts                    # 插件入口文件和油猴菜单注册
├── App.vue                    # 根组件，包含浮动按钮和面板容器
├── components/
│   └── PageMarkerPanel.vue    # 控制面板组件
├── utils/
│   └── pageMarker.ts          # 页面标记器核心逻辑
└── style.css                  # 全局样式
```

## 技术栈

- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- **TypeScript** - 提供完整的类型安全
- **Vite** - 快速的构建工具和开发服务器
- **vite-plugin-monkey** - 专门用于构建油猴脚本的Vite插件

## 开发指南

### 本地开发

1. 克隆项目并安装依赖
2. 运行 `pnpm dev` 启动开发服务器
3. 修改代码后，浏览器会自动刷新
4. 开发完成后运行 `pnpm build` 构建生产版本

### 代码规范

项目使用ESLint和TypeScript进行代码规范检查：

- 所有变量和函数必须有明确的类型注解
- 使用Vue 3的Composition API和`<script setup>`语法
- 遵循ESLint规则，保持代码风格一致

## 构建与部署

1. 运行 `pnpm build` 后，会在 `dist` 目录生成 `.user.js` 文件
2. 将此文件安装到 Tampermonkey 或其他油猴插件管理器中
3. 插件默认匹配所有网站（`*://*/*`），可在油猴管理界面中修改匹配规则

## 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 插件

### VS Code 配置

项目已包含VS Code配置文件，提供以下功能：
- 保存时自动格式化代码
- 保存时自动修复ESLint问题
- 推荐的扩展插件列表
- 快捷任务命令（通过 `Ctrl+Shift+P` 运行Tasks）

## TypeScript 支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，项目使用 `vue-tsc` 进行类型检查。在编辑器中需要安装 [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件来让 TypeScript 语言服务识别 `.vue` 类型。

## 故障排除

### 常见问题

1. **F9快捷键无法显示控制面板**
   - 确保页面已完全加载
   - 尝试刷新页面后再次使用F9
   - 也可以通过双击浮动按钮或油猴菜单打开控制面板

2. **按钮显示/隐藏设置不生效**
   - 检查是否启用了JavaScript
   - 尝试通过油猴菜单中的"显示/隐藏控制按钮"选项

3. **在某些网站上不工作**
   - 检查网站是否阻止了外部脚本
   - 在油猴管理界面中确认脚本的匹配规则

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！在提交代码前，请确保：

1. 代码通过所有ESLint检查
2. 添加了适当的类型注解
3. 提交信息清晰明确
4. 如果添加新功能，请更新相关文档

## 许可证

MIT License
