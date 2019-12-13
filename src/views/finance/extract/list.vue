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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

export default {
  name: 'financeExtract',
  mixins: [mixinTable],
  data(vm) {
    return {
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
          const { checkStatus, phone } = row
          vm.confirmTip(
            `是否确认审核通过【${phone}】提现请求`,
            {
              confirmHandle() {
                vm.checkExtract({ msgTip: '审核通过' })
              },
              cancalHandle() {
                vm.checkExtract({
                  checkStatus,
                  msgTip: '审核不通过'
                })
              },
              confirmButtonText: '审核通过',
              cancelButtonText: '审核不通过'
            }
          )
        }
      },
      {
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          // TODO...
          vm.routerLink(`/finance/extractDetail/${row.id}`)
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
    }
  }
}
</script>
