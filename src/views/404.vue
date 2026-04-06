<template>
  <div style="text-align: center; padding: 100px">
    <h1 style="font-size: 80px; color: #ddd">404</h1>
    <p style="color: #999; margin: 16px 0">页面不存在</p>
    <el-button type="primary" @click="router.push('/')">回到首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>