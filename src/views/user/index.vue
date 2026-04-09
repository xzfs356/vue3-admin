<template>
  <div class="user-page">
    <div class="search-bar">
      <el-input
        v-model="searchParams.keyword"
        placeholder="搜索用户名"
        clearable
        style="width: 220px"
        prefix-icon="Search"
        @change="search"
      />
      <el-button type="primary" icon="Plus" @click="openDialog()"> 新增用户 </el-button>
    </div>

    <div class="table-card" v-loading="loading">
      <el-table :data="list" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link icon="Edit" @click="openDialog(row)"> 编辑 </el-button>
            <el-button type="danger" link icon="Delete" @click="handleDelete(row)">
              删除
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="480px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="编辑" value="编辑" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormRules } from 'element-plus'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { UserListItem } from '@/types/user'
import { useTable } from '@/composables/useTable'
import { useForm } from '@/composables/useForm'

// useTable 接管列表逻辑
const { loading, list, total, pagination, searchParams, fetchData, search, handlePageChange } =
  useTable<UserListItem, { keyword: string; page: number; pageSize: number }>({
    fetchFn: getUserList,
    defaultParams: { keyword: '' },
  })

// useForm 接管弹窗逻辑
const { formRef, dialogVisible, submitLoading, isEdit, form, openDialog, resetForm, handleSubmit } =
  useForm<Partial<UserListItem>>({
    initialValues: { username: '', email: '', role: '', status: 1 },
    onSubmit: async (data, isEdit, editId) => {
      if (isEdit) {
        await updateUser(editId, data)
        ElMessage.success('编辑成功')
      } else {
        await createUser(data)
        ElMessage.success('新增成功')
      }
      fetchData()
    },
  })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

async function handleDelete(row: UserListItem) {
  await ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '警告', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  })
  await deleteUser(row.id)
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.user-page {
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
</style>
