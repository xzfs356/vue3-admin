<template>
  <el-popover
    placement="bottom-end"
    :width="260"
    trigger="click"
  >
    <template #reference>
      <el-button icon="Setting" circle />
    </template>

    <div class="column-setting">
      <div class="setting-header">
        <span>列配置</span>
        <el-button type="primary" link size="small" @click="emit('reset')">
          重置
        </el-button>
      </div>

      <div class="setting-list">
        <div
          v-for="col in columns"
          :key="col.prop"
          class="setting-item"
        >
          <el-checkbox
            v-model="col.visible"
            :label="col.label"
          />
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/types/form'

defineProps<{
  columns: TableColumn[]
}>()

const emit = defineEmits<{
  reset: []
}>()
</script>

<style scoped>
.column-setting {
  padding: 4px 0;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 10px;
  border-bottom: 1px solid #2a2d3e;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #e4e6eb;
}

.setting-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-item {
  padding: 6px 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.setting-item:hover {
  background: #212438;
}
</style>