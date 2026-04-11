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
      <div style="display: flex; gap: 8px">
        <!-- 列配置按钮 -->
        <ColumnSetting :columns="columns" @reset="resetColumns" />
        <el-button type="primary" icon="Plus" @click="openDialog()">
          新增用户
        </el-button>
      </div>
    </div>

    <div class="table-card" v-loading="loading">
     <el-table 
      :data="list" 
      stripe
      :key="visibleColumns.map(c => c.prop).join(',')"
    >
        <!-- 根据 visibleColumns 动态渲染列 -->
        <template v-for="col in visibleColumns" :key="col.prop">
          <!-- 状态列特殊处理 -->
          <el-table-column
            v-if="col.prop === 'status'"
            :label="col.label"
            :width="col.width"
          >
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 普通列 -->
          <el-table-column
            v-else
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :sortable="col.sortable"
          />
        </template>

        <!-- 操作列固定在右边 -->
        <el-table-column label="操作" width="160" fixed="right">
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
      <DynamicForm
        ref="formRef"
        v-model="form"
        :config="userFormConfig"
      />

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
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { UserListItem } from '@/types/user'
import { useTable } from '@/composables/useTable'
import { useForm } from '@/composables/useForm'
import { useTableColumns } from '@/composables/useTableColumns'
import ColumnSetting from '@/components/ColumnSetting.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { FormConfig } from '@/types/form'

const userFormConfig: FormConfig = {
  labelWidth: '80px',
  fields: [
    {
      field: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
      ],
    },
    {
      field: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: '管理员' },
        { label: '编辑', value: '编辑' },
        { label: '普通用户', value: '普通用户' },
      ],
      rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
    },
    {
      field: 'status',
      label: '状态',
      type: 'radio',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
}
// 列配置
const { columns, visibleColumns, resetColumns } = useTableColumns('user', [
  { prop: 'id', label: 'ID', width: 60, visible: true },
  { prop: 'username', label: '用户名', visible: true },
  { prop: 'email', label: '邮箱', visible: true },
  { prop: 'role', label: '角色', visible: true },
  { prop: 'status', label: '状态', width: 80, visible: true },
  { prop: 'createTime', label: '创建时间', width: 180, visible: true, sortable: true },
])

// useTable
const { loading, list, total, pagination, searchParams, fetchData, search, handlePageChange } =
  useTable<UserListItem, { keyword: string; page: number; pageSize: number }>({
    fetchFn: getUserList,
    defaultParams: { keyword: '' },
  })

// useForm
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


async function handleDelete(row: UserListItem) {
  await ElMessageBox.confirm(
    `确定要删除用户「${row.username}」吗？`,
    '警告',
    { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
  )
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