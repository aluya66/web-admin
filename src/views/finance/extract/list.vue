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
        :table-inner-btns="tableInnerBtns"
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        center
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        :btns="dialogObj.btns"
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <check-add ref="addRef" :init-data="dialogObj.initData" :show-type="dialogObj.type"></check-add>
        <template v-slot:info v-if="dialogObj.type === 1">请确认线下已打款后再操作 "同意" 按钮</template>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import CDialog from 'components/dialog'
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'
import CheckAdd from './add'

export default {
  name: 'financeExtract',
  mixins: [mixinTable],
  components: {
    CDialog,
    CheckAdd
  },
  data(vm) {
    return {
      dialogObj: {},
      tableInnerBtns: [{
        // 审核状态： 0：未审核 1：提现成功 2：提现驳回
        prop: {
          name: 'checkStatus',
          toggle: [{
            title: '审核',
            icon: 'el-icon-check',
            value: [0]
          }]
        },
        handle(row) {
          vm.showDialog({
            initData: row
          })
        }
      },
      {
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.showDialog({
            initData: row,
            title: '提现详情',
            type: 3,
            btns: []
          })
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '用户手机',
          prop: 'phone',
          search: {
            type: 'input'
          }
        },
        {
          label: '提现金额',
          prop: 'extractAmount'
        },
        {
          label: '手续费',
          prop: 'checkServiceFee'
        },
        {
          label: '持卡人',
          prop: 'cardholder'
        },
        {
          label: '开户行',
          prop: 'bankName'
        },
        {
          label: '银行卡号',
          prop: 'bankCardNo'
        },
        {
          label: '开户支行',
          prop: 'branchBankName'
        },
        {
          label: '审核状态',
          prop: 'checkStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.checkStatus, 'extractStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.extractStatusList
          }
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '更新时间',
          prop: 'updated'
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
      this.$api.finance.queryUserExtractList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    },
    /**
     * 审核操作
    */
    checkExtract(params) {
      const { msgTip, ...other } = params
      this.$api.finance.checkExtract(other).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: '提现审核',
        type: 1,
        btns: [
          { label: '同 意', name: 'submit', type: 'primary', size: 'small' },
          { label: '拒 绝', name: 'reject', size: 'small', handle: this.rejectHandle },
          { label: '取 消', name: 'cancel', size: 'small' }
        ],
        ...opts
      }
    },
    dialogConfirm() {
      const childRef = this.$refs.addRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const { checkReason, id, ...other } = childRef.formModel
          const type = this.dialogObj.type
          let tipMsg = ''
          let params = ''
          if (type === 1) {
            tipMsg = '审核成功'
            params = {
              checkAmount: Number(other.checkAmount),
              checkServiceFee: Number(other.checkServiceFee),
              serialNumber: Number(other.serialNumber)
            }
          } else {
            tipMsg = '驳回申请'
            params = {
              checkReason
            }
          }
          this.$api.finance.checkExtract({ id, checkStatus: type, ...params }).then(res => {
            this.responeHandle(tipMsg)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    rejectHandle() {
      this.showDialog({
        title: '拒绝原因',
        type: 2,
        btns: [
          { label: '确 定', name: 'submit', type: 'primary', size: 'small' },
          { label: '取 消', name: 'cancel', size: 'small' }
        ]
      })
    }
  }
}
</script>
