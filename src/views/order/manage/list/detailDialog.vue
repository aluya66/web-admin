<template>
    <c-table
        ref="detailTable"
        hasBorder
        :size="size"
        :table-header="tableHeader"
        :table-list="tableList"
        :loading="isLoading"
        :page-info="pageInfo"
        @change-pagination="changePagination"
      />
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          
        }
      }
    },
    
  },
  data(vm) {
    return {
      tableList:[],
     tableHeader:[
        {
          label: 'sku编码',
          prop: 'starasSkuCode',
          width: 140,
        },
        {
          label: '商品图片',
          prop: 'picturePath',
          width: 140,
          isImage: true,
        },
        {
          label: '商品名称',
          prop: 'productName',
          width: 140,
        },
        {
          label: '规格',
          prop: 'specifications',
          width: 140,
        },
        {
          label: '下单数量',
          prop: 'quantity',
          width: 140,
        },
        {
          label: '实发数量',
          prop: 'consignQuantity',
          width: 140,
        },
        {
          label: '售后数量',
          prop: 'canAfterSalesQuantity',
          width: 140,
        },
     ]
    }
  },
  computed: {
     formModel: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { orderCode } = this.formModel
      this.isLoading = true
      this.$api.order.queryGoodsList({
        orderCode,
        pageSize:10,
        pageNo:1
      }).then(res => {
           this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } 
      })
    },
  }
}
</script>
