<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :label-width="config.labelWidth || '80px'"
  >
    <el-row :gutter="16">
      <el-col
        v-for="field in config.fields"
        :key="field.field"
        :span="field.span || 24"
      >
        <el-form-item
          :label="field.label"
          :prop="field.field"
          :rules="field.rules"
        >
          <!-- input -->
          <el-input
            v-if="field.type === 'input'"
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
          />

          <!-- textarea -->
          <el-input
            v-else-if="field.type === 'textarea'"
            type="textarea"
            :rows="3"
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
          />

          <!-- select -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            style="width: 100%"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- radio -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="modelValue[field.field]"
          >
            <el-radio
              v-for="opt in field.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </el-radio>
          </el-radio-group>

          <!-- checkbox -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="modelValue[field.field]"
          >
            <el-checkbox
              v-for="opt in field.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- date -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="modelValue[field.field]"
            type="date"
            :placeholder="field.placeholder"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormConfig } from '@/types/form'

const props = defineProps<{
  modelValue: Record<string, any>
  config: FormConfig
}>()


const formRef = ref<FormInstance>()

// 暴露给父组件调用校验
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
})
</script>