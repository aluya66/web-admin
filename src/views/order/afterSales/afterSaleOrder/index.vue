<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        no-btn
        @before-close="dialogObj.isShow = false"
      >
        <c-details ref="childRef" :init-data.sync="dialogObj.initData" :is-edit="dialogObj.isEdit"></c-details>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import CDetails from './details'
import dictObj from '@/store/dictData'
export default {
  name: 'afterSalesList',
  mixins: [mixinTable],
  components: {
    CDialog,
    CDetails
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '详情',
          icon: 'el-icon-show',
          handle(row) {
            vm.showDialog({
              title: '详情',
              initData: row
            })
          }
        },
        {
          name: '审核',
          icon: 'el-icon-aduit',
          handle(row) {
            vm.showDialog({
              title: '审核',
              initData: row
            })
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '售后单号',
          prop: 'afterSalesCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单号',
          prop: 'thirdOrderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, dictObj.afterSalesStatus)
          },
          search: {
            prop: 'statusList',
            type: 'dict',
            optionsList: dictObj.afterSalesStatus
          }
        },
        {
          label: '售后类型',
          prop: 'afterSalesType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.afterSalesType, dictObj.afterSalesTypes)
          },
          search: {
            prop: 'applyAfterSalesType',
            type: 'dict',
            optionsList: dictObj.afterSalesTypes
          }
        },
        {
          label: '所属店铺',
          prop: 'storeName',
          search: {
            label: '物流',
            prop: 'deliveryCode',
            type: 'input'
          }
        },
        {
          label: '用户名称',
          prop: 'buyerNick',
          search: {
            label: '商品名称',
            prop: 'productAtrName',
            type: 'input'
          }
        },
        {
          label: '用户电话',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '物流公司',
          prop: 'deliveryName',
          search: {
            label: 'SPU',
            type: 'input',
            prop: 'productAtrNumber'
          }
        },
        {
          label: '物流单号',
          prop: 'deliveryNo',
          search: {
            label: 'SKU',
            type: 'input',
            prop: 'skuCode'
          }
        },
        {
          width: 150,
          label: '售后时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
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
      const searchDate = this.getSearchDate(
        dateTime,
        '',
        'startCreated',
        'endCreated'
      )
      this.isLoading = true
      this.$api.order
        .queryAfterSalesList({
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
        title: opts.title || '新增',
        initData: opts.initData
      }
    }
  }
}
</script>
<style>
</style>
