import { createApp } from 'vue'
import App from './App.vue'
import { PageMarker } from './utils/pageMarker'
import './style.css'

// 创建根应用容器
const appElement = document.createElement('div')
appElement.className = 'page-marker-root'
document.body.appendChild(appElement)

// 创建Vue应用
const app = createApp(App)

// 添加全局错误处理
app.config.errorHandler = (error, _instance, info) => {
  console.error('页面标记插件错误:', error, info)
}

// 挂载应用
app.mount(appElement)

// 初始化页面标记器
const pageMarker = PageMarker.getInstance()

// 页面加载完成后恢复状态
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pageMarker.applyMarker()
  })
}
else {
  pageMarker.applyMarker()
}

// 注册油猴菜单命令
if (typeof GM_registerMenuCommand !== 'undefined') {
  GM_registerMenuCommand('🔄 切换页面遮罩', () => {
    const newState = pageMarker.toggle()
    const message = newState ? '页面遮罩已开启' : '页面遮罩已关闭'

    // 创建通知
    const notification = document.createElement('div')
    notification.className = 'page-marker-notification'
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 2147483647;
      transition: opacity 0.3s ease;
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 2000)
  })

  GM_registerMenuCommand('⚙️ 打开控制面板', () => {
    const panel = document.querySelector('.panel-container') as HTMLElement
    if (panel) {
      panel.classList.toggle('visible')
      panel.classList.toggle('hidden')
    }
  })
}

// 监听页面URL变化，处理SPA应用
let lastUrl = window.location.href
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href
    // URL变化时重新应用遮罩
    setTimeout(() => {
      pageMarker.applyMarker()
    }, 100)
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// 监听页面卸载
window.addEventListener('beforeunload', () => {
  // 清理资源
  pageMarker.removeMarker()
  observer.disconnect()
});

// 导出全局实例，方便调试
(window as any).__PAGE_MARKER__ = pageMarker
