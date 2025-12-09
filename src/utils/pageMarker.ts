export interface MarkerConfig {
  enabled: boolean
  blurAmount: number
  maskOpacity: number
  mode: 'blur' | 'mask' | 'both'
  excludeSelectors: string[]
  showButton: boolean
  buttonPosition: { x: number; y: number }
}

// GM函数兼容性实现
const GM_getValue_compat = typeof GM_getValue !== 'undefined'
  ? GM_getValue
  : (key: string, defaultValue: any) => {
      const value = localStorage.getItem(`page-marker-${key}`)
      return value !== null ? JSON.parse(value) : defaultValue
    }

const GM_setValue_compat = typeof GM_setValue !== 'undefined'
  ? GM_setValue
  : (key: string, value: any) => {
      localStorage.setItem(`page-marker-${key}`, JSON.stringify(value))
    }

export class PageMarker {
  private static instance: PageMarker
  private config: MarkerConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  static getInstance(): PageMarker {
    if (!PageMarker.instance) {
      PageMarker.instance = new PageMarker()
    }
    return PageMarker.instance
  }

  private loadConfig(): MarkerConfig {
    return {
      enabled: GM_getValue_compat('marker_enabled', false),
      blurAmount: GM_getValue_compat('marker_blur_amount', 8),
      maskOpacity: GM_getValue_compat('marker_mask_opacity', 0.9),
      mode: GM_getValue_compat('marker_mode', 'both') as 'blur' | 'mask' | 'both',
      excludeSelectors: [],
      showButton: GM_getValue_compat('marker_show_button', true),
      buttonPosition: GM_getValue_compat('marker_button_position', { x: window.innerWidth - 70, y: window.innerHeight / 2 - 25 })
    }
  }

  private saveConfig(): void {
    GM_setValue_compat('marker_enabled', this.config.enabled)
    GM_setValue_compat('marker_blur_amount', this.config.blurAmount)
    GM_setValue_compat('marker_mask_opacity', this.config.maskOpacity)
    GM_setValue_compat('marker_mode', this.config.mode)
    GM_setValue_compat('marker_exclude_selectors', this.config.excludeSelectors)
    GM_setValue_compat('marker_show_button', this.config.showButton)
    GM_setValue_compat('marker_button_position', this.config.buttonPosition)
  }

  getConfig(): MarkerConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<MarkerConfig>): void {
    this.config = { ...this.config, ...updates }
    this.saveConfig()
    if (this.config.enabled) {
      this.applyMarker()
    }
  }

  private createMaskLayer(): HTMLElement {
    const maskLayer = document.createElement('div')
    maskLayer.id = 'page-marker-mask-layer'
    maskLayer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 999999999 !important;
      pointer-events: none !important;
      transition: all 0.3s ease !important;
    `
    return maskLayer
  }

  private updateMaskLayer(maskLayer: HTMLElement): void {
    const { blurAmount, maskOpacity, mode } = this.config

    // 清空当前内容
    maskLayer.innerHTML = ''

    if (mode === 'blur' || mode === 'both') {
      // 创建模糊层
      const blurDiv = document.createElement('div')
      blurDiv.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        backdrop-filter: blur(${blurAmount}px) !important;
        -webkit-backdrop-filter: blur(${blurAmount}px) !important;
      `
      maskLayer.appendChild(blurDiv)
    }

    if (mode === 'mask' || mode === 'both') {
      // 创建遮罩层
      const maskDiv = document.createElement('div')
      maskDiv.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, ${maskOpacity}) !important;
      `
      maskLayer.appendChild(maskDiv)
    }
  }

  applyMarker(): void {
    this.removeMarker()

    if (!this.config.enabled) {
      return
    }

    // 创建遮罩层
    const maskLayer = this.createMaskLayer()
    this.updateMaskLayer(maskLayer)
    document.body.appendChild(maskLayer)
  }

  removeMarker(): void {
    const existingMask = document.getElementById('page-marker-mask-layer')
    if (existingMask) {
      existingMask.remove()
    }
  }

  toggle(): boolean {
    this.config.enabled = !this.config.enabled
    this.saveConfig()

    if (this.config.enabled) {
      this.applyMarker()
    }
    else {
      this.removeMarker()
    }

    return this.config.enabled
  }

  isEnabled(): boolean {
    return this.config.enabled
  }
}
