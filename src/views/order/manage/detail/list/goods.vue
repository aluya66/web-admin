<template>
  <line-card title="商品及业绩信息">
    <c-table
      ref="cTable"
      hasBorder
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="tableList"
      :page-info="pageInfo"
      @change-pagination="changePagination"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'
import dictObj from '@/store/dictData'

const salePriceTypeList = [{
  value: 0,
  label: '非会员零售价'
}, {
  value: 1,
  label: '会员价'
}, {
  value: 2,
  label: '供货价'
}, {
  value: 3,
  label: '散批价'
}, {
  value: 4,
  label: '大批价'
}, {
  value: 5,
  label: '渠道价'
}]

export default {
  mixins: [mixinTable],
  props: {
    orderCode: String
  },
  components: {
    LineCard
  },
  created() {
    this.orderCode && this.fetchData()
  },
  data(vm) {
    return {
      tableHeader: [
        {
          label: 'spu款号',
          fixed: true,
          prop: 'productAtrNumber'
        },
        {
          label: 'sku款号',
          prop: 'starasSkuCode'
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
          label: '商品规格',
          prop: 'specifications'
        },
        {
          label: '购物方式',
          prop: 'salePriceType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.salePriceType, salePriceTypeList)
          }
        },
        {
          label: '商品金额(元)',
          prop: 'salePrice'
        },
        {
          label: '数量',
          prop: 'quantity'
        },
        {
          label: '商品总金额(元)',
          prop: 'productTotalAmount'
        },
        {
          label: '商品优惠金额(元)',
          prop: 'totalFavourableAmount'
        },
        {
          label: '商品实付金额(元)',
          prop: 'confirmPaidAmount'
        },
        {
          label: '邀请码',
          prop: ''
        },
        {
          label: '商品来源',
          prop: 'appCode',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appCode, dictObj.lobList)
          }
        },
        {
          label: '分享者',
          prop: ''
        },
        {
          label: '分享者手机号',
          prop: ''
        },
        {
          label: '业绩归属角色',
          prop: ''
        },
        {
          label: '业绩归属者',
          prop: ''
        },
        {
          label: '业绩归属手机号',
          prop: ''
        },
        {
          label: '可售后数量',
          prop: 'canAfterSalesQuantity'
        },
        {
          label: '可发货数量',
          prop: 'canShipQuantity'
        }
      ]
    }
  },
  methods: {
    /**
     * 获取支付记录
     */
    fetchData(id) {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.order.queryGoodsList({
        orderCode: this.orderCode,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
