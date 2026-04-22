<template>
  <div class="order-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div style="display: flex; gap: 12px">
        <el-input
          v-model="searchParams.keyword"
          placeholder="搜索订单号 / 买家"
          clearable
          style="width: 220px"
          prefix-icon="Search"
          @change="search"
        />
        <el-select
          v-model="searchParams.status"
          placeholder="订单状态"
          clearable
          style="width: 140px"
          @change="search"
        >
          <el-option
            v-for="(val, key) in ORDER_STATUS_MAP"
            :key="key"
            :label="val.label"
            :value="key"
          />
        </el-select>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-card" v-loading="loading">
      <el-table :data="list" stripe>
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="username" label="买家" width="100" />
        <el-table-column prop="productName" label="商品" />
        <el-table-column label="金额" width="120" sortable>
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 500"> ¥{{ row.amount.toFixed(2) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="ORDER_STATUS_MAP[row.status as OrderStatus].type as any" size="small">
              {{ ORDER_STATUS_MAP[row.status as OrderStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="View" @click="openDetail(row)"> 详情 </el-button>
            <el-button
              v-if="row.status === 'paid'"
              type="success"
              link
              icon="Van"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              link
              icon="CircleClose"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="480px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-item">
          <span class="detail-label">订单号</span>
          <span class="detail-value">{{ currentOrder.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">买家</span>
          <span class="detail-value">{{ currentOrder.username }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">商品</span>
          <span class="detail-value">{{ currentOrder.productName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">金额</span>
          <span class="detail-value" style="color: #f56c6c; font-weight: 500">
            ¥{{ currentOrder.amount.toFixed(2) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">状态</span>
          <el-tag :type="ORDER_STATUS_MAP[currentOrder.status].type as any" size="small">
            {{ ORDER_STATUS_MAP[currentOrder.status].label }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">收货地址</span>
          <span class="detail-value">{{ currentOrder.address }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">下单时间</span>
          <span class="detail-value">{{ currentOrder.createTime }}</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, updateOrderStatus } from '@/api/order'
import type { OrderItem, OrderStatus } from '@/types/order'
import { ORDER_STATUS_MAP } from '@/types/order'
import { useTable } from '@/composables/useTable'

// useTable
const { loading, list, total, pagination, searchParams, fetchData, search, handlePageChange } =
  useTable<OrderItem, { keyword: string; status: string; page: number; pageSize: number }>({
    fetchFn: getOrderList,
    defaultParams: { keyword: '', status: '' },
  })

// 详情弹窗
const detailVisible = ref(false)
const currentOrder = ref<OrderItem | null>(null)

function openDetail(row: OrderItem) {
  currentOrder.value = row
  detailVisible.value = true
}

// 发货
async function handleShip(row: OrderItem) {
  await ElMessageBox.confirm(`确定对订单「${row.orderNo}」发货吗？`, '发货确认', {
    type: 'warning',
    confirmButtonText: '确定发货',
    cancelButtonText: '取消',
  })
  await updateOrderStatus(row.id, 'shipped')
  ElMessage.success('发货成功')
  fetchData()
}

// 取消订单
async function handleCancel(row: OrderItem) {
  await ElMessageBox.confirm(`确定取消订单「${row.orderNo}」吗？`, '取消确认', {
    type: 'warning',
    confirmButtonText: '确定取消',
    cancelButtonText: '关闭',
  })
  await updateOrderStatus(row.id, 'cancelled')
  ElMessage.success('订单已取消')
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.order-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1d2e;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #2a2d3e;
}

.table-card {
  background: #1a1d2e;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2a2d3e;
  position: relative;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2a2d3e;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 13px;
  color: #8b8fa8;
}

.detail-value {
  font-size: 14px;
  color: #c8ccd8;
}
</style>
