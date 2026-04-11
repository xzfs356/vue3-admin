<template>
  <div class="demo-page">
    <div class="demo-card">
      <div class="demo-title">动态表单演示</div>
      <div class="demo-sub">通过 JSON 配置驱动表单渲染，无需手写每个字段</div>

      <DynamicForm
        ref="dynamicFormRef"
        v-model="formData"
        :config="formConfig"
      />

      <div class="demo-footer">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>

      <!-- 实时展示表单数据 -->
      <div class="form-data-preview">
        <div class="preview-title">当前表单数据（实时）</div>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import DynamicForm from '@/components/DynamicForm.vue'
import type { FormConfig } from '@/types/form'

const dynamicFormRef = ref()

// 表单配置 JSON
const formConfig: FormConfig = {
  labelWidth: '90px',
  fields: [
    {
      field: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      span: 12,
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
      span: 12,
    },
    {
      field: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '普通用户', value: 'user' },
      ],
      rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
      span: 12,
    },
    {
      field: 'status',
      label: '状态',
      type: 'radio',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
      span: 12,
    },
    {
      field: 'permissions',
      label: '权限',
      type: 'checkbox',
      options: [
        { label: '新增', value: 'add' },
        { label: '编辑', value: 'edit' },
        { label: '删除', value: 'delete' },
        { label: '查看', value: 'view' },
      ],
    },
    {
      field: 'birthday',
      label: '生日',
      type: 'date',
      placeholder: '请选择日期',
      span: 12,
    },
    {
      field: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注',
    },
  ],
}

const formData = reactive<Record<string, any>>({
  username: '',
  email: '',
  role: '',
  status: 1,
  permissions: [],
  birthday: '',
  remark: '',
})

async function handleSubmit() {
  const valid = await dynamicFormRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success('提交成功！数据：' + JSON.stringify(formData))
}

function handleReset() {
  dynamicFormRef.value?.resetFields()
}
</script>

<style scoped>
.demo-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-card {
  background: #1a1d2e;
  border-radius: 8px;
  padding: 28px;
  border: 1px solid #2a2d3e;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  color: #e4e6eb;
  margin-bottom: 6px;
}

.demo-sub {
  font-size: 13px;
  color: #8b8fa8;
  margin-bottom: 28px;
}

.demo-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.form-data-preview {
  margin-top: 24px;
  background: #141624;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #2a2d3e;
}

.preview-title {
  font-size: 12px;
  color: #8b8fa8;
  margin-bottom: 10px;
}

pre {
  font-size: 13px;
  color: #c8ccd8;
  line-height: 1.6;
  margin: 0;
}
</style>