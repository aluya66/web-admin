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
        <send-detail
          ref="childRef"
          :init-data.sync="dialogObj.initData"
          :is-edit="dialogObj.isEdit"
        ></send-detail>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import sendDetail from './detail'
export default {
  name: 'orderManageSend',
  mixins: [mixinTable],
  components: {
    CDialog,
    sendDetail
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '明细',
          icon: 'el-icon-view',
          handle(row) {
            vm.showDialog({
              title: '发货单明细',
              initData: row
            })
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '发货单号',
          prop: 'outboundCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单号',
          prop: 'orderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '用户名',
          prop: 'buyerNick',
          search: {
            label: '收货人手机号',
            prop: 'mobile',
            type: 'input'
          }
        },
        {
          label: '物流公司',
          prop: 'deliveryName'
        },
        {
          label: '物流单号',
          prop: 'deliveryNo',
          search: {
            type: 'input'
          }
        },
        {
          label: '收货地址',
          formatter(row) {
            return row.provinceName + ' ' + row.cityName + ' ' + row.regionName + ' ' + row.address
          }
        },
        {
          label: '创建时间',
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
      const searchDate = this.getSearchDate(dateTime, '', 'orderCreateStartTime', 'orderCreateEndTime')
      this.isLoading = true
      this.$api.order.queryDeliveryList({
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
<style>
</style>
