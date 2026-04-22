interface TrackerConfig {
  appId: string
  reportUrl?: string // 上报地址，没有就只打印日志
}

interface ReportData {
  appId: string
  type: 'error' | 'performance' | 'behavior'
  subType: string
  data: Record<string, any>
  timestamp: number
  userAgent: string
  url: string
}

class Tracker {
  private config: TrackerConfig

  constructor(config: TrackerConfig) {
    this.config = config
    this.initErrorCapture()
    this.initPerformance()
    this.initBehavior()
    console.log(`%c[Tracker] SDK 初始化成功，appId: ${config.appId}`, 'color: #1677ff')
  }

  // 统一上报方法
  private report(data: Omit<ReportData, 'appId' | 'timestamp' | 'userAgent' | 'url'>) {
    const reportData: ReportData = {
      ...data,
      appId: this.config.appId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: location.href,
    }

    // 打印到控制台
    console.log(`%c[Tracker] ${data.type} - ${data.subType}`, 'color: #67c23a', reportData)

    // 如果配置了上报地址，用 sendBeacon 上报（不阻塞页面）
    if (this.config.reportUrl) {
      navigator.sendBeacon(this.config.reportUrl, JSON.stringify(reportData))
    }
  }

  // 1. 错误捕获
  private initErrorCapture() {
    // JS 运行时错误
    window.addEventListener('error', (e) => {
      this.report({
        type: 'error',
        subType: 'js_error',
        data: {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          stack: e.error?.stack,
        },
      })
    })

    // Promise 未捕获错误
    window.addEventListener('unhandledrejection', (e) => {
      this.report({
        type: 'error',
        subType: 'promise_error',
        data: {
          reason: e.reason?.message || String(e.reason),
          stack: e.reason?.stack,
        },
      })
    })

    // 资源加载失败（图片、脚本等）
    window.addEventListener(
      'error',
      (e) => {
        const target = e.target as HTMLElement
        if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT')) {
          this.report({
            type: 'error',
            subType: 'resource_error',
            data: {
              tagName: target.tagName,
              src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src,
            },
          })
        }
      },
      true
    ) // 注意：资源错误需要捕获阶段监听
  }

  // 2. 性能数据采集
  private initPerformance() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        if (!nav) return

        this.report({
          type: 'performance',
          subType: 'page_load',
          data: {
            // DNS 查询时间
            dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
            // TCP 连接时间
            tcp: Math.round(nav.connectEnd - nav.connectStart),
            // 首字节时间 TTFB
            ttfb: Math.round(nav.responseStart - nav.requestStart),
            // DOM 解析时间
            domParse: Math.round(nav.domInteractive - nav.responseEnd),
            // 页面完全加载时间
            loadTime: Math.round(nav.loadEventEnd - nav.startTime),
          },
        })

        // FCP 首次内容绘制
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
        if (fcpEntry) {
          this.report({
            type: 'performance',
            subType: 'fcp',
            data: {
              value: Math.round(fcpEntry.startTime),
              rating:
                fcpEntry.startTime < 1800
                  ? 'good'
                  : fcpEntry.startTime < 3000
                    ? 'needs-improvement'
                    : 'poor',
            },
          })
        }
      }, 0)
    })
  }

  // 3. 用户行为埋点
  private initBehavior() {
    // 页面访问
    this.report({
      type: 'behavior',
      subType: 'page_view',
      data: {
        title: document.title,
        referrer: document.referrer,
      },
    })

    // 点击事件（只记录有 data-track 属性的元素）
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const trackEl = target.closest('[data-track]') as HTMLElement
      if (trackEl) {
        this.report({
          type: 'behavior',
          subType: 'click',
          data: {
            trackId: trackEl.dataset.track,
            text: trackEl.innerText?.slice(0, 50),
          },
        })
      }
    })
  }

  // 手动埋点方法（暴露给外部使用）
  track(subType: string, data: Record<string, any>) {
    this.report({
      type: 'behavior',
      subType,
      data,
    })
  }
}

// 导出单例
let trackerInstance: Tracker | null = null

export function initTracker(config: TrackerConfig) {
  if (trackerInstance) return trackerInstance
  trackerInstance = new Tracker(config)
  return trackerInstance
}

export function useTracker() {
  if (!trackerInstance) {
    console.warn('[Tracker] 请先调用 initTracker 初始化')
  }
  return trackerInstance
}
