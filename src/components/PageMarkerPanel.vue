<script setup lang="ts">
import { ref } from 'vue'
import type { MarkerConfig } from '../utils/pageMarker'

interface Props {
  config: MarkerConfig
}

interface Emits {
  (e: 'change', updates: Partial<MarkerConfig>): void
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref('basic')

function onEnabledChange(enabled: boolean) {
  emit('change', { enabled })
}

function onModeChange(mode: 'blur' | 'mask' | 'both') {
  emit('change', { mode })
}

function onBlurAmountChange(amount: number) {
  emit('change', { blurAmount: amount })
}

function onMaskOpacityChange(opacity: number) {
  emit('change', { maskOpacity: opacity })
}

function onShowButtonChange(showButton: boolean) {
  emit('change', { showButton })
}

function getModeLabel(mode: string) {
  switch (mode) {
    case 'blur': return '模糊'
    case 'mask': return '遮罩'
    case 'both': return '模糊+遮罩'
    default: return mode
  }
}
</script>

<template>
  <div class="panel">
    <!-- 头部 -->
    <div class="panel-header">
      <h3>页面遮罩控制</h3>
      <button class="close-button" @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>
    </div>

    <!-- 标签页 -->
    <div class="panel-tabs">
      <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">
        基础设置
      </button>
      <button :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">
        高级设置
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="panel-content">
      <!-- 基础设置 -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <!-- 开关 -->
        <div class="control-group">
          <label class="switch-label">
            <input
              type="checkbox" :checked="config.enabled"
              @change="onEnabledChange(($event.target as HTMLInputElement).checked)"
            >
            <span class="switch-slider" />
            <span class="switch-text">启用页面遮罩</span>
          </label>
        </div>

        <!-- 显示按钮开关 -->
        <div class="control-group">
          <label class="switch-label">
            <input
              type="checkbox" :checked="config.showButton"
              @change="onShowButtonChange(($event.target as HTMLInputElement).checked)"
            >
            <span class="switch-slider" />
            <span class="switch-text">显示控制按钮</span>
          </label>
        </div>

        <!-- 模式选择 -->
        <div class="control-group">
          <label>遮罩模式</label>
          <div class="mode-buttons">
            <button
              v-for="mode in ['blur', 'mask', 'both'] as const" :key="mode"
              :class="{ active: config.mode === mode }" @click="onModeChange(mode)"
            >
              {{ getModeLabel(mode) }}
            </button>
          </div>
        </div>

        <!-- 模糊强度 -->
        <div v-show="config.mode === 'blur' || config.mode === 'both'" class="control-group">
          <label>模糊强度: {{ config.blurAmount }}px</label>
          <input
            type="range" min="0" max="20" step="1" :value="config.blurAmount" class="slider"
            @input="onBlurAmountChange(Number(($event.target as HTMLInputElement).value))"
          >
        </div>

        <!-- 遮罩透明度 -->
        <div v-show="config.mode === 'mask' || config.mode === 'both'" class="control-group">
          <label>遮罩透明度: {{ Math.round(config.maskOpacity * 100) }}%</label>
          <input
            type="range" min="0" max="100" step="5" :value="config.maskOpacity * 100" class="slider"
            @input="onMaskOpacityChange(Number(($event.target as HTMLInputElement).value) / 100)"
          >
        </div>
      </div>

      <!-- 高级设置 -->
      <div v-show="activeTab === 'advanced'" class="tab-content">
        <!-- 快捷键说明 -->
        <div class="control-group">
          <label>快捷键</label>
          <div class="shortcut-list">
            <div class="shortcut-item">
              <kbd>F8</kbd>
              <span>切换遮罩</span>
            </div>
            <div class="shortcut-item">
              <kbd>F9</kbd>
              <span>打开/关闭控制面板</span>
            </div>
            <div class="shortcut-item">
              <kbd>ESC</kbd>
              <span>关闭控制面板</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
    }

    .panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .close-button:hover {
        background: #f5f5f5;
        color: #666;
    }

    .panel-tabs {
        display: flex;
        border-bottom: 1px solid #f0f0f0;
    }

    .panel-tabs button {
        flex: 1;
        padding: 12px 16px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        transition: all 0.2s;
        border-bottom: 2px solid transparent;
    }

    .panel-tabs button.active {
        color: #667eea;
        border-bottom-color: #667eea;
        background: #f8f9ff;
    }

    .panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
    }

    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .control-group label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }

    .switch-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
    }

    .switch-label input[type="checkbox"] {
        display: none;
    }

    .switch-slider {
        position: relative;
        width: 44px;
        height: 24px;
        background: #ddd;
        border-radius: 12px;
        transition: background 0.3s;
    }

    .switch-slider::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: transform 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .switch-label input:checked+.switch-slider {
        background: #667eea;
    }

    .switch-label input:checked+.switch-slider::before {
        transform: translateX(20px);
    }

    .switch-text {
        font-size: 14px;
        color: #333;
    }

    .mode-buttons {
        display: flex;
        gap: 8px;
    }

    .mode-buttons button {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        color: #333;
    }

    .mode-buttons button.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .mode-buttons button:hover:not(.active) {
        border-color: #667eea;
        color: #667eea;
    }

    .slider {
        width: 100%;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: #ddd;
        border-radius: 2px;
        outline: none;
        transition: background 0.3s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #667eea;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #667eea;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border: none;
    }

    .group-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .add-button {
        padding: 4px 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .add-button:hover {
        background: #5a6fd8;
    }

    .exclude-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 120px;
        overflow-y: auto;
    }

    .exclude-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e9ecef;
    }

    .exclude-item code {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        color: #495057;
        background: white;
        padding: 2px 6px;
        border-radius: 3px;
    }

    .remove-button {
        padding: 2px 8px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 3px;
        font-size: 11px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .remove-button:hover {
        background: #c82333;
    }

    .empty-state {
        padding: 16px;
        text-align: center;
        color: #999;
        font-size: 13px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px dashed #ddd;
    }

    .shortcut-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .shortcut-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .shortcut-item kbd {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 11px;
        color: #495057;
        background: white;
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid #dee2e6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .shortcut-item span {
        font-size: 13px;
        color: #666;
    }

    .about-info {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #e9ecef;
    }

    .info-item {
        margin-bottom: 8px;
        font-size: 13px;
        color: #495057;
    }

    .info-item:last-child {
        margin-bottom: 0;
    }

    .info-item strong {
        color: #343a40;
    }
</style>
