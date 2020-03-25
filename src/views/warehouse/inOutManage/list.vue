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
        {
          label: '仓库名称',
          prop: 'whName',
          fixed: true
          // search: {
          //   type: 'input'
          // }
        },
        {
          label: '业务类型',
          prop: 'sourceType',
          fixed: true,
          formatter(row) {
            return row && vm.setTableColumnLabel(row.sourceType, dictObj.bussinessType)
          }
          // search: {
          //   type: 'input'
          // }
        },
        {
          label: '入库单号',
          prop: 'orderCode',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '关联单号',
          prop: 'refOrderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '来源',
          prop: 'source',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.source, dictObj.inOutType)
          }
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '操作人',
          prop: 'createdName'
        },
        {
          label: '出入库日期',
          prop: 'shippingDate'
        },
        {
          label: '制单时间',
          prop: 'created'
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
      this.$api.warehouse.queryInOutRecord({
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
