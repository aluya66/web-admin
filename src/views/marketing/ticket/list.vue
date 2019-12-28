<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/marketing/ticket/ticketInfo')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="685"
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
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      ></c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
// import utils from 'utils'
import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'

export default {
  name: 'ticketList',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 180,
          name: '编辑',
          notBtn: 'status',
          icon: 'el-icon-edit',
          handle(row) {
            const { couponRuleId, status } = row
            // 未发布：可修改优惠券所有信息; 进行中、未开始、已下架：只可修改使用说明
            if (status !== 4 && status !== 5 && status !== 6 && status !== 7) return vm.$msgTip('该优惠券不支持编辑操作', 'warning')
            vm.routerLink(`/marketing/ticket/ticketInfo/${couponRuleId}`)
          }
        },
        { // 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: {
            name: 'status',
            toggle: [{
              title: '发布',
              icon: 'el-icon-s-promotion',
              value: [0, 4]
            }, {
              title: '上架',
              icon: 'el-icon-top',
              value: [7]
            }, {
              title: '下架',
              icon: 'el-icon-bottom',
              value: [5, 6]
            }]
          },
          handle(row) {
            const { status, couponRuleId, couponName } = row
            let msgTip, couponRuleStatus
            switch (status) {
              case 0:
              case 4:
                msgTip = '发布'
                couponRuleStatus = 5
                break
              case 7:
                msgTip = '上架'
                couponRuleStatus = 5
                break
              case 5:
              case 6:
                msgTip = '下架'
                couponRuleStatus = 7
                break
            }
            vm.confirmTip(`是否${msgTip}【${couponName}】优惠券`, () => {
              vm.verifyData({ couponRuleId, couponRuleStatus, msgTip })
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { couponName, couponRuleId } = row
            vm.confirmTip(`确认删除  ${couponName}  劵信息`, () => {
              vm.deleteData({ couponRuleId })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '卡券ID',
          prop: 'couponRuleId',
          width: 100,
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '使用渠道',
          prop: 'platformList',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.platformList, 'lobList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '卡券名称',
          prop: 'couponName',
          search: {
            type: 'input'
          }
        },
        {
          label: '卡券类型',
          prop: 'preferentialType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.preferentialType, 'ticketTypeList')
          },
          search: {
            prop: 'type',
            type: 'select',
            optionsList: dictObj.ticketTypeList
          }
        },
        {
          label: '卡券内容',
          formatter(row) { // 卡券类型 5现金券 1折扣券 3兑换券
            const marketPreferentialRules = row.marketPreferentialRules && row.marketPreferentialRules[0] ? row.marketPreferentialRules[0] : {}
            const { preferentialLevel, preferentialValue } = marketPreferentialRules
            switch (row.preferentialType) {
              case 1:
                return `满${preferentialLevel || ''}件享${preferentialValue || ''}折`
              case 3:
                return ''
              case 5:
                return `满${preferentialLevel || ''}元减${preferentialValue || ''}元`
            }
          }
        },
        {
          width: 300,
          label: '卡券有效期',
          formatter(row) {
            // limitExpireDayType 卡券有效期: 1指定日期  2自领券N日内有效 4自领券日当月有效
            switch (row.limitExpireDayType) {
              case 1:
                return row.limitExpireTimeStart + '~' + row.limitExpireTimeEnd
              case 2:
                return row.limitExpireDay + '天'
              case 4:
                return '领券30天内'
            }
          }
        },
        {
          label: '卡券状态', // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, 'couponStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.couponStatusList
          }
        },
        {
          label: '创建人',
          prop: 'opCreator',
          search: {
            prop: 'opCreator',
            type: 'input'
          }
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.isCreated = !this.isCreated
  },
  activated() {
    this.isCreated && this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.marketing
        .getCoupon({
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
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      this.$api.marketing.deleteCoupon(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    // 审核劵
    verifyData(params) {
      const { couponRuleId, msgTip, couponRuleStatus } = params
      this.$api.marketing.applyCoupon({ couponRuleId, couponRuleStatus }).then(() => {
        this.$msgTip(`${msgTip}成功`)
        this.fetchData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增劵',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
     */
    addHandle(childFormModel) {
      this.$api.marketing.addCoupon(childFormModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    /**
     * 确认修改操作
     */
    editHandle(formModel) {
      this.$api.marketing.updateCoupon(formModel).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    }
  }
}
</script>
