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
        hasIndex
        hasBorder
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
// import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'

export default {
  // name: 'warehouse',
  mixins: [mixinTable],
  components: {
    // CDialog
    // WarehouseAdd
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      tableHeader: [
        {
          label: '商品款号',
          prop: 'productAtrNumber',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: 'SKU款号',
          prop: 'skuCode'
        },
        {
          label: '仓库名称',
          prop: 'whName',
          search: {
            type: 'input'
          }
        },
        {
          label: '仓库类型',
          prop: 'whBusinessType',
          formatter (row) {
            return row.whBusinessType === 10 ? '云仓' : '店仓'
          },
          search: {
            type: 'select',
            optionsList: dictObj.warehouseType
          }
        },
        {
          label: '可用库存',
          prop: 'availableQty'
        },
        {
          label: '实物库存',
          prop: 'entityQty'
        },
        {
          label: '在途库存',
          prop: 'intransitQty'
        },
        {
          label: '预占库存',
          prop: 'occupiedQty'

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
      this.$api.warehouse.queryWarehouseStock({
        ...searchDate,
        ...other,
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
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '新增',
        initData: opts.initData
      }
    }
  }
}
</script>
