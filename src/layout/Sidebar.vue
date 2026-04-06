<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">⚡</span>
      <span class="logo-text">Admin System</span>
    </div>

    <el-menu
      :default-active="activeMenu"
      background-color="#001529"
      text-color="#ffffffa6"
      active-text-color="#ffffff"
      router
    >
      <el-menu-item
        v-for="route in menuRoutes"
        :key="route.path"
        :index="route.path"
      >
        <el-icon>
          <component :is="route.meta?.icon" />
        </el-icon>
        <span>{{ route.meta?.title }}</span>
      </el-menu-item>
    </el-menu>

    <!-- 底部用户信息 -->
    <div class="sidebar-footer">
      <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
      <div class="footer-info">
        <div class="footer-name">{{ userStore.userInfo?.username }}</div>
        <div class="footer-role">{{ userStore.userInfo?.roles?.[0] }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const permissionStore = usePermissionStore()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() =>
  permissionStore.routes
    .filter(r => !r.meta?.hidden && r.children?.length)
    .map(r => ({
      path: r.path,
      meta: r.children![0].meta,
    }))
)
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: #001529;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #ffffff15;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 6px;
  width: calc(100% - 16px) !important;
}

.el-menu-item.is-active {
  background: #1677ff !important;
}

.el-menu-item:hover {
  background: #ffffff15 !important;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #ffffff15;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.footer-info {
  overflow: hidden;
}

.footer-name {
  color: #ffffffd9;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-role {
  color: #ffffff60;
  font-size: 12px;
}
</style>