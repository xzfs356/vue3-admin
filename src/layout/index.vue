<template>
  <div class="layout-container">
    <Sidebar />
    <div class="layout-main">
      <Header />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #0f1117;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0f1117;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>