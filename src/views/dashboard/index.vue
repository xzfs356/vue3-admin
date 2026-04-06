<template>
  <div class="dashboard">
    <!-- 在 <div class="dashboard"> 内最顶部加 -->
    <div class="welcome-banner">
      <div>
        <div class="banner-title">你好，{{ userStore.userInfo?.username }} 👋</div>
        <div class="banner-sub">今天也是充满活力的一天，祝你工作顺利！</div>
      </div>
    </div>
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <div class="stat-card" :style="{ borderTopColor: card.color }">
          <div class="stat-icon" :style="{ background: card.color }">
            <el-icon size="24" color="#fff">
              <component :is="card.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 折线图 -->
    <div class="chart-card">
      <div class="chart-title">趋势统计</div>
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import { getStats, getTrend } from '@/api/dashboard'
import type { StatsData, TrendData } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

const stats = ref<StatsData>({
  userCount: 0,
  orderCount: 0,
  revenue: 0,
  visitCount: 0,
})

const trend = ref<TrendData>({
  months: [],
  users: [],
  orders: [],
})

const statCards = computed(() => [
  {
    label: '用户总数',
    value: stats.value.userCount.toLocaleString(),
    icon: 'User',
    color: '#409eff',
  },
  {
    label: '订单总数',
    value: stats.value.orderCount.toLocaleString(),
    icon: 'ShoppingCart',
    color: '#67c23a',
  },
  {
    label: '总收入',
    value: '¥' + stats.value.revenue.toLocaleString(),
    icon: 'Money',
    color: '#e6a23c',
  },
  {
    label: '访问量',
    value: stats.value.visitCount.toLocaleString(),
    icon: 'View',
    color: '#f56c6c',
  },
])

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, 'dark') // 👈 加 'dark'
  chart.setOption({
    backgroundColor: 'transparent', // 👈 背景透明
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['用户数', '订单数'],
      textStyle: { color: '#8b8fa8' },
    },
    xAxis: {
      type: 'category',
      data: trend.value.months,
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#8b8fa8' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#8b8fa8' },
    },
    series: [
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        data: trend.value.users,
        itemStyle: { color: '#1677ff' },
        areaStyle: { color: 'rgba(22,119,255,0.1)' },
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: trend.value.orders,
        itemStyle: { color: '#722ed1' },
        areaStyle: { color: 'rgba(114,46,209,0.1)' },
      },
    ],
  })
}

// 窗口大小变化时图表自适应
function handleResize() {
  chart?.resize()
}

onMounted(async () => {
  // 并行请求两个接口
  const [statsRes, trendRes] = await Promise.all([getStats(), getTrend()])
  stats.value = statsRes
  trend.value = trendRes
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-banner {
  background: linear-gradient(135deg, #1677ff 0%, #722ed1 100%);
  border-radius: 10px;
  padding: 24px 28px;
  color: #fff;
}

.banner-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.banner-sub {
  font-size: 14px;
  opacity: 0.85;
}

.stats-row {
  margin: 0 !important;
}

.stat-card {
  background: #1a1d2e;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-top: 3px solid;
  border-left: 1px solid #2a2d3e;
  border-right: 1px solid #2a2d3e;
  border-bottom: 1px solid #2a2d3e;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #e4e6eb;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #8b8fa8;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-card {
  background: #1a1d2e;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #2a2d3e;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #e4e6eb;
  margin-bottom: 16px;
}

.chart {
  height: 320px;
}
</style>