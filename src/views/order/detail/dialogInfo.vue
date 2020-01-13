<template>
  <c-table
    ref="cTable"
    selection
    noPage
    hasBorder
    :max-height="maxHeight"
    :size="size"
    :loading="isLoading"
    :table-header="tableHeader"
    :table-list="tableList"
  ></c-table>
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
          id: '' // 发货记录
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
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
  data() {
    return {
      tableHeader: [
        {
          label: 'sku编码',
          prop: 'productSkuCode'
        },
        {
          label: '商品图片',
          prop: 'picturePath',
          isImage: true
        },
        {
          label: '商品名称',
          prop: 'productName'
        },
        {
          label: '规格',
          prop: 'specifications'
        },
        {
          label: '下单数量',
          prop: 'originalQuantity'
        },
        {
          label: '实发数量',
          prop: 'consignQuantity'
        },
        {
          label: '售后数量',
          prop: 'afterSaleQuantity'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { id } = this.formModel
      this.isLoading = true
      this.$api.order.queryShipDetail({
        id
      }).then(res => {
        this.isLoading = false
        if (res) {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
