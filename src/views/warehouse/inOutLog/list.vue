<template>
  <c-view>
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
// import dictObj from '@/store/dictData'

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
          label: '品牌',
          prop: 'brandName',
          fixed: true
          // search: {
          //   type: 'input'
          // }
        },
        {
          label: '商品编码',
          prop: 'skuCode',
          fixed: true

        },
        {
          label: '商品名称',
          prop: 'productName',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '供应商款号',
          prop: 'venderProductCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品规格',
          prop: 'productSpc'
        },
        {
          label: '单位',
          prop: 'changeTime'
        },
        {
          label: '仓库信息',
          prop: 'whName'
          // search: {
          //   type: 'input'
          // }
        },
        {
          label: '业务类型',
          prop: 'sourceType'
        },
        {
          label: '单号',
          prop: 'flowCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '来源',
          prop: 'refSource'
        },
        {
          label: '出入库数量',
          prop: 'changeQty'
        },
        {
          label: '出入库日期',
          prop: 'changeTime'
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
      this.$api.warehouse.queryInOutStockLog({
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
    },
    /**
		 * dialog新增、编辑处理函数
		 */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const params = childRef.formModel
          const curAction = this.dialogObj.isEdit ? 'editWarehouse' : 'addWarehouse'
          // TODO...
          this.$api.warehouse[curAction]({
            // TODO...
            ...params
          }).then(() => {
            this.responeHandle(this.dialogObj.isEdit ? '更新成功' : '新增成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(params) {
      this.$api.warehouse.deleteWarehouse(params).then(() => {
        this.$msgTip('删除成功')
        this.delResetData()
      })
    }
  }
}
</script>
