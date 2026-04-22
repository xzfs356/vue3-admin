<template>
  <div class="product-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div style="display: flex; gap: 12px">
        <el-input
          v-model="searchParams.keyword"
          placeholder="搜索商品名称"
          clearable
          style="width: 220px"
          prefix-icon="Search"
          @change="search"
        />
        <el-select
          v-model="searchParams.category"
          placeholder="商品分类"
          clearable
          style="width: 140px"
          @change="search"
        >
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
      </div>
      <div style="display: flex; gap: 8px">
        <ColumnSetting :columns="columns" @reset="resetColumns" />
        <el-button type="primary" icon="Plus" @click="openDialog()"> 新增商品 </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-card" v-loading="loading">
      <el-table :data="list" stripe :key="visibleColumns.map((c) => c.prop).join(',')">
        <template v-for="col in visibleColumns" :key="col.prop">
          <!-- 封面图 -->
          <el-table-column v-if="col.prop === 'cover'" :label="col.label" :width="col.width">
            <template #default="{ row }">
              <el-image
                :src="row.cover"
                style="width: 40px; height: 40px; border-radius: 4px"
                fit="cover"
              />
            </template>
          </el-table-column>

          <!-- 价格 -->
          <el-table-column
            v-else-if="col.prop === 'price'"
            :label="col.label"
            :width="col.width"
            :sortable="col.sortable"
          >
            <template #default="{ row }">
              <span style="color: #f56c6c; font-weight: 500"> ¥{{ row.price.toFixed(2) }} </span>
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column v-else-if="col.prop === 'status'" :label="col.label" :width="col.width">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status === 1"
                @change="(val) => handleStatusChange(row, val as boolean)"
              />
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

        <el-table-column label="操作" width="160" fixed="right">
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

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑商品' : '新增商品'"
      width="520px"
      @close="resetForm"
    >
      <DynamicForm ref="formRef" v-model="form" :config="productFormConfig" />
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
import { getProductList, createProduct, updateProduct, deleteProduct } from '@/api/product'
import type { ProductItem } from '@/types/product'
import type { FormConfig } from '@/types/form'
import { useTable } from '@/composables/useTable'
import { useForm } from '@/composables/useForm'
import { useTableColumns } from '@/composables/useTableColumns'
import DynamicForm from '@/components/DynamicForm.vue'
import ColumnSetting from '@/components/ColumnSetting.vue'

const categories = ['手机', '电脑', '平板', '配件', '耳机']

// 列配置
const { columns, visibleColumns, resetColumns } = useTableColumns('product', [
  { prop: 'id', label: 'ID', width: 60, visible: true },
  { prop: 'cover', label: '封面', width: 80, visible: true },
  { prop: 'name', label: '商品名称', visible: true },
  { prop: 'category', label: '分类', width: 100, visible: true },
  { prop: 'price', label: '价格', width: 120, visible: true, sortable: true },
  { prop: 'stock', label: '库存', width: 100, visible: true, sortable: true },
  { prop: 'status', label: '上架', width: 80, visible: true },
  { prop: 'createTime', label: '创建时间', width: 180, visible: true },
])

// useTable
const { loading, list, total, pagination, searchParams, fetchData, search, handlePageChange } =
  useTable<ProductItem, { keyword: string; category: string; page: number; pageSize: number }>({
    fetchFn: getProductList,
    defaultParams: { keyword: '', category: '' },
  })

// useForm
const { formRef, dialogVisible, submitLoading, isEdit, form, openDialog, resetForm, handleSubmit } =
  useForm<Partial<ProductItem>>({
    initialValues: { name: '', price: 0, stock: 0, category: '', cover: '', status: 1 },
    onSubmit: async (data, isEdit, editId) => {
      if (isEdit) {
        await updateProduct(editId, data)
        ElMessage.success('编辑成功')
      } else {
        await createProduct(data)
        ElMessage.success('新增成功')
      }
      fetchData()
    },
  })

// 表单配置
const productFormConfig: FormConfig = {
  labelWidth: '80px',
  fields: [
    {
      field: 'name',
      label: '商品名称',
      type: 'input',
      placeholder: '请输入商品名称',
      rules: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    },
    {
      field: 'category',
      label: '分类',
      type: 'select',
      placeholder: '请选择分类',
      options: categories.map((c) => ({ label: c, value: c })),
      rules: [{ required: true, message: '请选择分类', trigger: 'change' }],
      span: 12,
    },
    {
      field: 'price',
      label: '价格',
      type: 'input',
      placeholder: '请输入价格',
      rules: [{ required: true, message: '请输入价格', trigger: 'blur' }],
      span: 12,
    },
    {
      field: 'stock',
      label: '库存',
      type: 'input',
      placeholder: '请输入库存',
      rules: [{ required: true, message: '请输入库存', trigger: 'blur' }],
      span: 12,
    },
    {
      field: 'status',
      label: '状态',
      type: 'radio',
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 },
      ],
      span: 12,
    },
    {
      field: 'cover',
      label: '封面地址',
      type: 'input',
      placeholder: '请输入图片地址',
    },
  ],
}

// 上下架切换
async function handleStatusChange(row: ProductItem, val: boolean) {
  await updateProduct(row.id, { status: val ? 1 : 0 })
  ElMessage.success(val ? '已上架' : '已下架')
  fetchData()
}

async function handleDelete(row: ProductItem) {
  await ElMessageBox.confirm(`确定要删除商品「${row.name}」吗？`, '警告', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  })
  await deleteProduct(row.id)
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.product-page {
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
