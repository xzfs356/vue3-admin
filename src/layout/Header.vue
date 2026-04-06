<template>
  <header class="header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="currentTitle && route.path !== '/dashboard'">
        {{ currentTitle }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header-right">
      <span class="welcome">欢迎回来，{{ userStore.userInfo?.username }}</span>
      <el-divider direction="vertical" />
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="30" :src="userStore.userInfo?.avatar" />
          <el-icon style="margin-left: 4px"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const currentTitle = computed(() => route.meta?.title as string)

async function handleCommand(command: string) {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  background: #141624;
  border-bottom: 1px solid #2a2d3e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome {
  font-size: 13px;
  color: #8b8fa8;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  color: #c8ccd8;
}

.user-info:hover {
  background: #212438;
}
</style>