import { ref, watch } from 'vue'
import type { TableColumn } from '@/types/form'

export function useTableColumns(key: string, initialColumns: TableColumn[]) {
  // 从 localStorage 读取用户上次的配置，没有就用默认值
  const stored = localStorage.getItem(`table-columns-${key}`)
  const columns = ref<TableColumn[]>(
    stored ? JSON.parse(stored) : initialColumns
  )

  // 监听变化自动保存到 localStorage
  watch(
    columns,
    val => {
      localStorage.setItem(`table-columns-${key}`, JSON.stringify(val))
    },
    { deep: true }
  )

  // 显示的列（过滤掉 visible 为 false 的）
  const visibleColumns = ref<TableColumn[]>(columns.value.filter(c => c.visible))

  watch(
    columns,
    val => {
      visibleColumns.value = val.filter(c => c.visible)
    },
    { deep: true }
  )

  // 重置为默认配置
  function resetColumns() {
    columns.value = initialColumns.map(c => ({ ...c }))
  }

  return { columns, visibleColumns, resetColumns }
}