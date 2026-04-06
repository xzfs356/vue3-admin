<template>
  <div class="role-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <span style="font-size: 15px; font-weight: 500; color: #303133">角色列表</span>
      <el-button type="primary" icon="Plus" @click="openDialog()">
        新增角色
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table :data="roleList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="角色名称" width="120" />
        <el-table-column prop="code" label="角色标识" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="权限" min-width="280">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag
                v-for="p in row.permissions"
                :key="p"
                size="small"
                type="info"
              >
                {{ p }}
              </el-tag>
              <span v-if="!row.permissions.length" style="color: #909399; font-size: 13px">
                暂无权限
              </span>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link icon="Edit" @click="openDialog(row)">
              编辑
            </el-button>
            <el-button type="danger" link icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="520px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="如：admin、editor" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox
              v-for="p in allPermissions"
              :key="p.value"
              :value="p.value"
            >
              {{ p.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'
import type { RoleItem } from '@/types/role'

// 所有可选权限
const allPermissions = [
  { label: '新增用户', value: 'user:add' },
  { label: '编辑用户', value: 'user:edit' },
  { label: '删除用户', value: 'user:delete' },
  { label: '新增角色', value: 'role:add' },
  { label: '编辑角色', value: 'role:edit' },
  { label: '删除角色', value: 'role:delete' },
]

const loading = ref(false)
const roleList = ref<RoleItem[]>([])

async function fetchRoles() {
  loading.value = true
  try {
    const res = await getRoleList()
    roleList.value = res.list
  } finally {
    loading.value = false
  }
}

// 弹窗
const dialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
let editId = -1

const form = reactive<Partial<RoleItem>>({
  name: '',
  code: '',
  description: '',
  permissions: [],
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
}

function openDialog(row?: RoleItem) {
  if (row) {
    isEdit.value = true
    editId = row.id
    Object.assign(form, { ...row, permissions: [...row.permissions] })
  } else {
    isEdit.value = false
    editId = -1
    resetForm()
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  Object.assign(form, { name: '', code: '', description: '', permissions: [] })
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateRole(editId, form)
      ElMessage.success('编辑成功')
    } else {
      await createRole(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchRoles()
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(row: RoleItem) {
  await ElMessageBox.confirm(
    `确定要删除角色「${row.name}」吗？`,
    '警告',
    { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
  )
  await deleteRole(row.id)
  ElMessage.success('删除成功')
  fetchRoles()
}

onMounted(fetchRoles)
</script>

<style scoped>
.user-page,
.role-page {
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
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>