<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{$route.meta.name || $t(`route.${$route.meta.title}`)}}
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        hasBorder
        hasIndex
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

export default {
  // name: 'warehouse',
  mixins: [mixinTable],
  components: {
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      tableHeader: [
        // {
        //   label: '仓库名称',
        //   prop: 'whName',
        //   search: {
        //     type: 'input'
        //   },
        //   fixed: true
        // },
        // {
        //   label: '仓库编码',
        //   prop: 'whCode',
        //   fixed: true
        // },
        {
          label: '库存编号',
          prop: 'stockCode'
        },
        // {
        //   label: '仓库属性',
        //   prop: 'whType',
        //   formatter(row) {
        //     return row.whType === 1 ? '可销售' : '不可售'
        //   },
        //   search: {
        //     type: 'select',
        //     optionsList: dictObj.warehouseSaleType
        //   }
        // },
        {
          label: '仓库类型', // 仓库业务类型：10:仓库，20:店仓
          prop: 'whBusinessType',
          formatter(row) {
            return row.whBusinessType === 10 ? '云仓' : '店仓'
          },
          search: {
            type: 'select',
            optionsList: dictObj.warehouseType
          }
        },
        {
          label: 'sku编码',
          prop: 'skuCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品款号',
          prop: 'productAtrNumber'
        },
        {
          label: '实库数量',
          prop: 'entityQty'
        },
        {
          label: '占位数量',
          prop: 'occupiedQty'
        },
        {
          label: '可用数量',
          prop: 'availableQty'
        },
        {
          label: '在途数量',
          prop: 'intransitQty'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.warehouse
        .queryPlateStock({
          ...searchDate,
          ...other,
          ...page
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } else {
            this.tableList = res || []
          }
        })
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '创建仓库',
        initData: opts.initData
      }
    }
  }
}
</script>
