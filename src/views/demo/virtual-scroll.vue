<template>
  <div class="virtual-page">
    <!-- 对比说明 -->
    <div class="info-bar">
      <div class="info-item">
        <span class="info-label">总数据量</span>
        <span class="info-value">{{ list.length.toLocaleString() }} 条</span>
      </div>
      <div class="info-item">
        <span class="info-label">DOM 节点数</span>
        <span class="info-value highlight">仅渲染可见区域</span>
      </div>
      <div class="info-item">
        <span class="info-label">滚动性能</span>
        <span class="info-value highlight">流畅 60fps</span>
      </div>
      <el-button type="primary" :loading="loading" @click="loadData"> 加载 10000 条数据 </el-button>
    </div>

    <!-- 虚拟滚动列表 -->
    <div class="list-card" v-loading="loading">
      <div class="list-header">
        <span class="col-id">ID</span>
        <span class="col-name">用户名</span>
        <span class="col-email">邮箱</span>
        <span class="col-role">角色</span>
        <span class="col-status">状态</span>
      </div>

      <RecycleScroller
        v-if="list.length"
        class="scroller"
        :items="list"
        :item-size="48"
        key-field="id"
        v-slot="{ item }"
      >
        <div class="list-row">
          <span class="col-id">{{ item.id }}</span>
          <span class="col-name">{{ item.username }}</span>
          <span class="col-email">{{ item.email }}</span>
          <span class="col-role">{{ item.role }}</span>
          <span class="col-status">
            <el-tag :type="item.status === 1 ? 'success' : 'danger'" size="small">
              {{ item.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </span>
        </div>
      </RecycleScroller>

      <div v-else class="empty">点击上方按钮加载数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { getAllUsers } from '@/api/user'
import type { UserListItem } from '@/types/user'

const list = ref<UserListItem[]>([])
const loading = ref(false)

async function loadData() {
  loading.value = true
  try {
    list.value = await getAllUsers()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.virtual-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-bar {
  background: #1a1d2e;
  border-radius: 8px;
  padding: 16px 20px;
  border: 1px solid #2a2d3e;
  display: flex;
  align-items: center;
  gap: 32px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #8b8fa8;
}

.info-value {
  font-size: 18px;
  font-weight: 600;
  color: #e4e6eb;
}

.info-value.highlight {
  color: #1677ff;
}

.list-card {
  background: #1a1d2e;
  border-radius: 8px;
  border: 1px solid #2a2d3e;
  overflow: hidden;
  position: relative;
  min-height: 200px;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 44px;
  background: #141624;
  border-bottom: 1px solid #2a2d3e;
  font-size: 13px;
  color: #8b8fa8;
  font-weight: 500;
}

.scroller {
  height: 520px;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 48px;
  border-bottom: 1px solid #2a2d3e;
  font-size: 14px;
  color: #c8ccd8;
  transition: background 0.15s;
}

.list-row:hover {
  background: #212438;
}

.col-id {
  width: 80px;
  flex-shrink: 0;
}
.col-name {
  width: 160px;
  flex-shrink: 0;
}
.col-email {
  flex: 1;
}
.col-role {
  width: 120px;
  flex-shrink: 0;
}
.col-status {
  width: 80px;
  flex-shrink: 0;
}

.empty {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8fa8;
  font-size: 14px;
}
</style>
