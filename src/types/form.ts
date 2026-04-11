export type FieldType = 'input' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date'

export interface FormFieldOption {
  label: string
  value: string | number
}

export interface FormField {
  field: string           // 绑定的字段名
  label: string           // 表单标签
  type: FieldType         // 字段类型
  placeholder?: string    // 占位符
  options?: FormFieldOption[]  // select/radio/checkbox 的选项
  rules?: any[]           // 校验规则
  span?: number           // 占几列（基于24格，默认24）
}

export interface FormConfig {
  fields: FormField[]
  labelWidth?: string
}

export interface TableColumn {
  prop: string          // 字段名
  label: string         // 列标题
  width?: number        // 列宽
  fixed?: 'left' | 'right'  // 固定列
  visible: boolean      // 是否显示
  sortable?: boolean    // 是否可排序
}