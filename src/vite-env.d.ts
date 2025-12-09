/// <reference types="vite/client" />

// 油猴API全局声明
declare global {
  interface Window {
    __PAGE_MARKER__?: any
  }

  function GM_getValue<T = any>(key: string, defaultValue?: T): T
  function GM_setValue(key: string, value: any): void
  function GM_registerMenuCommand(name: string, callback: () => void): void
  function GM_addStyle(css: string): HTMLStyleElement
  function GM_notification(details: string | { text: string, title?: string, timeout?: number }, ondone?: () => void): void
  function GM_openInTab(url: string, options?: { active?: boolean, insert?: boolean }): void
  function GM_xmlhttpRequest(details: {
    method: string
    url: string
    headers?: Record<string, string>
    data?: string
    onload?: (response: { responseText: string, status: number }) => void
    onerror?: () => void
  }): void
}

export {}
