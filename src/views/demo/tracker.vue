<template>
  <div class="tracker-page">
    <div class="section-card">
      <div class="section-title">错误捕获演示</div>
      <div class="section-sub">点击按钮触发错误，观察控制台输出</div>
      <div class="btn-group">
        <el-button type="danger" @click="triggerJsError"> 触发 JS 错误 </el-button>
        <el-button type="warning" @click="triggerPromiseError"> 触发 Promise 错误 </el-button>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">手动埋点演示</div>
      <div class="section-sub">带有 data-track 属性的元素点击会自动上报</div>
      <div class="btn-group">
        <el-button type="primary" data-track="btn_buy" @click="handleBuy">
          购买按钮（自动埋点）
        </el-button>
        <el-button type="success" data-track="btn_share"> 分享按钮（自动埋点） </el-button>
        <el-button @click="handleManualTrack"> 手动上报事件 </el-button>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">上报日志</div>
      <div class="section-sub">打开控制台查看详细数据，这里展示最近的上报记录</div>
      <div class="log-list">
        <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
          <div class="log-header">
            <el-tag :type="logTagType(log.type)" size="small">
              {{ log.type }}
            </el-tag>
            <span class="log-subtype">{{ log.subType }}</span>
            <span class="log-time">{{ log.time }}</span>
          </div>
          <div class="log-data">{{ JSON.stringify(log.data, null, 2) }}</div>
        </div>
        <div v-if="!logs.length" class="log-empty">暂无上报记录，点击上方按钮触发</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTracker } from '@/utils/tracker'

const tracker = useTracker()

interface LogItem {
  type: string
  subType: string
  time: string
  data: Record<string, any>
}

const logs = ref<LogItem[]>([])

// 拦截 tracker 的上报，同步显示到页面上
const originalReport = (tracker as any)?.report?.bind(tracker)
if (tracker) {
  ;(tracker as any).report = function (data: any) {
    logs.value.unshift({
      type: data.type,
      subType: data.subType,
      time: new Date().toLocaleTimeString(),
      data: data.data,
    })
    originalReport?.(data)
  }
}

function triggerJsError() {
  try {
    // @ts-expect-error: 故意调用 null 上不存在的方法，用于触发 JS 错误，测试监控 SDK
    null.triggerError()
  } catch (e) {
    ElMessage.warning('已触发 JS 错误，查看控制台')
    tracker?.track('manual_error', { message: (e as Error).message })
  }
}

function triggerPromiseError() {
  Promise.reject(new Error('手动触发的 Promise 错误'))
  ElMessage.warning('已触发 Promise 错误，查看控制台')
}

function handleBuy() {
  ElMessage.success('购买成功！（已自动上报点击事件）')
}

function handleManualTrack() {
  tracker?.track('custom_event', {
    eventName: '手动上报',
    value: Math.random().toFixed(4),
  })
  ElMessage.success('手动上报成功，查看控制台')
}

function logTagType(type: string) {
  const map: Record<string, any> = {
    error: 'danger',
    performance: 'warning',
    behavior: 'success',
  }
  return map[type] || 'info'
}
</script>

<style scoped>
.tracker-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #1a1d2e;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #2a2d3e;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #e4e6eb;
  margin-bottom: 6px;
}

.section-sub {
  font-size: 13px;
  color: #8b8fa8;
  margin-bottom: 16px;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  background: #141624;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #2a2d3e;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.log-subtype {
  font-size: 13px;
  font-weight: 500;
  color: #c8ccd8;
}

.log-time {
  font-size: 12px;
  color: #8b8fa8;
  margin-left: auto;
}

.log-data {
  font-size: 12px;
  color: #8b8fa8;
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.6;
}

.log-empty {
  text-align: center;
  padding: 40px;
  color: #8b8fa8;
  font-size: 14px;
}
</style>
