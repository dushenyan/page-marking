# Page Marking

油猴插件 应用页面进行遮罩

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

## 项目结构

```
src/
├── main.ts          # 插件入口文件
├── App.vue          # 根组件
├── components/      # Vue 组件
├── assets/          # 静态资源
└── style.css        # 全局样式
```

## 配置说明

### 修改插件信息

在 `vite.config.ts` 中修改以下信息：

- `name`: 插件名称
- `namespace`: 插件命名空间
- `description`: 插件描述
- `author`: 作者
- `match`: 目标网站URL
- `grant`: 需要的API权限

### 修改项目信息

在 `package.json` 中修改：

- `name`: 包名
- `description`: 包描述

## 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 插件

### VS Code 配置

项目已包含VS Code配置文件，提供以下功能：
- 保存时自动格式化代码
- 保存时自动修复ESLint问题
- 推荐的扩展插件列表
- 快捷任务命令（通过 `Ctrl+Shift+P` 运行Tasks）

## 构建说明

1. 运行 `pnpm build` 后，会在 `dist` 目录生成 `.user.js` 文件
2. 将此文件安装到 Tampermonkey 或其他油猴插件管理器中
3. 在配置的目标网站上测试插件功能

## 技术栈

- Vue 3 - 使用 Composition API 和 `<script setup>`
- TypeScript - 类型安全
- Vite - 快速构建工具
- vite-plugin-monkey - 油猴插件构建支持

## TypeScript 支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，项目使用 `vue-tsc` 进行类型检查。在编辑器中需要安装 [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件来让 TypeScript 语言服务识别 `.vue` 类型。
