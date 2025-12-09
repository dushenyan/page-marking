<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageMarkerPanel from './components/PageMarkerPanel.vue'
import { type MarkerConfig, PageMarker } from './utils/pageMarker'

const pageMarker = PageMarker.getInstance()
const isPanelVisible = ref(false)
const config = ref<MarkerConfig>(pageMarker.getConfig())
const buttonPosition = ref(config.value.buttonPosition)

const toggleClass = computed(() => ({
  'toggle-button': true,
  'enabled': config.value.enabled,
  'disabled': !config.value.enabled,
}))

const showToggleClass = computed(() => ({
  'panel-container': true,
  'visible': isPanelVisible.value,
  'hidden': !isPanelVisible.value,
}))

onMounted(() => {
  updateConfig()
  setupKeyboardShortcuts()
  setupDragAndDrop()
})

function updateConfig() {
  config.value = pageMarker.getConfig()
}

function toggleMarker() {
  const newState = pageMarker.toggle()
  updateConfig()

  if (newState) {
    showNotification('页面遮罩已开启')
  }
  else {
    showNotification('页面遮罩已关闭')
  }
}

function togglePanel() {
  isPanelVisible.value = !isPanelVisible.value
}

function onConfigChange(updates: Partial<MarkerConfig>) {
  pageMarker.updateConfig(updates)
  updateConfig()
}

function showNotification(message: string) {
  const notification = document.createElement('div')
  notification.className = 'page-marker-notification'
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // F8 切换遮罩
    if (e.key === 'F8') {
      e.preventDefault()
      toggleMarker()
    }

    // F9 切换面板
    if (e.key === 'F9') {
      e.preventDefault()
      togglePanel()
    }

    // ESC 隐藏面板
    if (e.key === 'Escape' && isPanelVisible.value) {
      isPanelVisible.value = false
    }
  })
}

function setupDragAndDrop() {
  const toggle = document.querySelector('.toggle-button') as HTMLElement
  if (!toggle || !config.value.showButton)
    return
  
  let isDragging = false
  let startX: number
  let startY: number

  function snapToEdge(x: number, y: number) {
    const buttonSize = 50
    const margin = 20
    const snapThreshold = 50
    
    let snappedX = x
    let snappedY = y
    
    // 吸附到左右边缘
    const leftDistance = x
    const rightDistance = window.innerWidth - x - buttonSize
    
    if (leftDistance < snapThreshold) {
      snappedX = margin
    } else if (rightDistance < snapThreshold) {
      snappedX = window.innerWidth - buttonSize - margin
    }
    
    // 吸附到上下边缘
    const topDistance = y
    const bottomDistance = window.innerHeight - y - buttonSize
    
    if (topDistance < snapThreshold) {
      snappedY = margin
    } else if (bottomDistance < snapThreshold) {
      snappedY = window.innerHeight - buttonSize - margin
    }
    
    return { x: snappedX, y: snappedY }
  }

  function updateButtonPosition(x: number, y: number) {
    const snapped = snapToEdge(x, y)
    buttonPosition.value = snapped
    
    // 更新按钮位置
    const control = document.querySelector('.page-marker-control') as HTMLElement
    if (control) {
      control.style.left = `${snapped.x}px`
      control.style.top = `${snapped.y}px`
    }
    
    // 保存位置到配置
    pageMarker.updateConfig({ buttonPosition: snapped })
  }

  function dragStart(e: MouseEvent) {
    if (!config.value.showButton) return
    
    isDragging = true
    startX = e.clientX - buttonPosition.value.x
    startY = e.clientY - buttonPosition.value.y
    
    toggle.style.cursor = 'grabbing'
    e.preventDefault()
  }

  function dragEnd() {
    if (!isDragging) return
    
    isDragging = false
    toggle.style.cursor = 'grab'
  }

  function drag(e: MouseEvent) {
    if (!isDragging) return
    
    e.preventDefault()
    
    const x = e.clientX - startX
    const y = e.clientY - startY
    
    // 限制在窗口范围内
    const maxX = window.innerWidth - 50
    const maxY = window.innerHeight - 50
    
    const clampedX = Math.max(0, Math.min(x, maxX))
    const clampedY = Math.max(0, Math.min(y, maxY))
    
    updateButtonPosition(clampedX, clampedY)
  }

  toggle.addEventListener('mousedown', dragStart)
  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('mousemove', drag)
  
  // 初始化按钮位置
  updateButtonPosition(buttonPosition.value.x, buttonPosition.value.y)
}
</script>

<template>
  <div 
    class="page-marker-control" 
    :style="{
      display: config.showButton ? 'block' : 'none',
      left: config.showButton ? `${buttonPosition.x}px` : 'auto',
      top: config.showButton ? `${buttonPosition.y}px` : 'auto',
      right: 'auto'
    }"
  >
    <!-- 浮动切换按钮 -->
    <button 
      v-if="config.showButton"
      :class="toggleClass" 
      title="单击切换遮罩，双击打开控制面板 (F8/F9)" 
      @click="toggleMarker" 
      @dblclick="togglePanel"
      style="position: relative;"
    >
      <!-- 闭眼图标（遮罩开启时） -->
      <svg v-if="config.enabled" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
      </svg>
      <!-- 睁眼图标（遮罩关闭时） -->
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    </button>

    <!-- 控制面板 -->
    <div :class="showToggleClass">
      <PageMarkerPanel :config="config" @change="onConfigChange" @close="isPanelVisible = false" />
    </div>
  </div>
</template>

<style>
  .page-marker-control {
    position: fixed;
    z-index: 2147483647 !important;
  }

  .toggle-button {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    user-select: none;
  }

  .toggle-button.enabled {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .toggle-button.disabled {
    background: #ffffff;
    color: #666;
    border: 2px solid #e0e0e0;
  }

  .toggle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  .panel-container {
    position: absolute;
    top: 60px;
    right: 0;
    width: 320px;
    max-height: 480px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    transform-origin: top right;
  }

  .panel-container.hidden {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
  }

  .panel-container.visible {
    opacity: 1;
    transform: scale(1);
  }

  .page-marker-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 2147483647;
    transition: opacity 0.3s ease;
  }
</style>
