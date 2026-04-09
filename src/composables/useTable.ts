// import { ref, reactive } from 'vue'

// interface TableOptions<T, P extends Record<string, any>> {
//   fetchFn: (params: P) => Promise<{ list: T[]; total: number }>
//   defaultParams?: Partial<P>
// }

// export function useTable<T, P extends Record<string, any>>(
//   options: TableOptions<T, P>
// ) {
//   const { fetchFn, defaultParams = {} } = options

//   const loading = ref(false)
//   const list = ref<T[]>([])
//   const total = ref(0)

//   const pagination = reactive({
//     page: 1,
//     pageSize: 10,
//   })

//   const searchParams = reactive<Record<string, any>>({ ...defaultParams })

//   async function fetchData() {
//     loading.value = true
//     try {
//       const res = await fetchFn({
//         ...searchParams,
//         page: pagination.page,
//         pageSize: pagination.pageSize,
//       } as unknown as P)
//       list.value = res.list
//       total.value = res.total
//     } finally {
//       loading.value = false
//     }
//   }

//   // 搜索（重置到第一页再请求）
//   function search() {
//     pagination.page = 1
//     fetchData()
//   }

//   // 重置搜索条件
//   function reset() {
//     Object.keys(searchParams).forEach(key => {
//       (searchParams as Record<string, any>)[key] = (defaultParams as Record<string, any>)[key] ?? ''
//     })
//     pagination.page = 1
//     fetchData()
//   }

//   // 分页变化
//   function handlePageChange() {
//     fetchData()
//   }

//   return {
//     loading,
//     list,
//     total,
//     pagination,
//     searchParams,
//     fetchData,
//     search,
//     reset,
//     handlePageChange,
//   }
// }
import { ref, reactive } from 'vue'

interface TableOptions<T, P extends Record<string, any>> {
  fetchFn: (params: P) => Promise<{ list: T[]; total: number }>
  defaultParams?: Partial<P>
}

export function useTable<T, P extends Record<string, any>>(options: TableOptions<T, P>) {
  const { fetchFn, defaultParams = {} } = options
  const loading = ref(false)
  const list = ref<T[]>([])
  const total = ref(0)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
  })
  const searchParams = reactive<Record<string, any>>({ ...defaultParams })

  async function fetchData() {
    loading.value = true
    try {
      const res = await fetchFn({
        ...searchParams,
        page: pagination.page,
        pageSize: pagination.pageSize,
      } as unknown as P)
      list.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  function search() {
    pagination.page = 1
    fetchData()
  }

  function handlePageChange() {
    fetchData()
  }

  return {
    loading,
    list,
    total,
    pagination,
    searchParams,
    fetchData,
    search,
    handlePageChange,
  }
}
