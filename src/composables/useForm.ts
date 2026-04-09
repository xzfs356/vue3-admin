// import { ref } from 'vue'
// import type { FormInstance } from 'element-plus'

// interface FormOptions<T extends Record<string, any>> {
//   initialValues: T
//   onSubmit: (form: T, isEdit: boolean, editId: number) => Promise<void>
// }

// export function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
//   const { initialValues, onSubmit } = options

//   const formRef = ref<FormInstance>()
//   const dialogVisible = ref(false)
//   const submitLoading = ref(false)
//   const isEdit = ref(false)
//   let editId = -1

//   // 用 ref 替代 reactive 避免泛型问题
//   const form = ref<T>({ ...initialValues })

//   function openDialog(row?: Partial<T> & { id?: number }) {
//     if (row) {
//       isEdit.value = true
//       editId = row.id ?? -1
//       form.value = { ...form.value, ...row }
//     } else {
//       isEdit.value = false
//       editId = -1
//       resetForm()
//     }
//     dialogVisible.value = true
//   }

//   function resetForm() {
//     formRef.value?.resetFields()
//     form.value = { ...initialValues }
//   }

//   async function handleSubmit() {
//     const valid = await formRef.value?.validate().catch(() => false)
//     if (!valid) return

//     submitLoading.value = true
//     try {
//       await onSubmit(form.value, isEdit.value, editId)
//       dialogVisible.value = false
//     } finally {
//       submitLoading.value = false
//     }
//   }

//   return {
//     formRef,
//     dialogVisible,
//     submitLoading,
//     isEdit,
//     form,
//     openDialog,
//     resetForm,
//     handleSubmit,
//   }
// }
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface FormOptions<T extends Record<string, any>> {
  initialValues: T
  onSubmit: (form: T, isEdit: boolean, editId: number) => Promise<void>
}

export function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
  const { initialValues, onSubmit } = options
  const formRef = ref<FormInstance>()
  const dialogVisible = ref(false)
  const submitLoading = ref(false)
  const isEdit = ref(false)
  let editId = -1

  const form = ref<T>({ ...initialValues })
  function openDialog(row?: Partial<T> & { id?: number }) {
    if (row) {
      isEdit.value = true
      editId = row.id ?? -1
      form.value = { ...form.value, ...row }
    } else {
      isEdit.value = false
      editId = -1
      resetForm()
    }
    dialogVisible.value = true
  }

  function resetForm() {
    formRef.value?.resetFields()
    form.value = { ...initialValues }
  }

  async function handleSubmit() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return
    submitLoading.value = true
    try {
      await onSubmit(form.value, isEdit.value, editId)
      dialogVisible.value = false
    } finally {
      submitLoading.value = false
    }
  }

  return {
    formRef,
    dialogVisible,
    submitLoading,
    isEdit,
    form,
    openDialog,
    resetForm,
    handleSubmit,
  }
}
