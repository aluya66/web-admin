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
// const platformList = [ // 渠道1 IPX, 2星购, 4YOSHOP, 8YSIA
//   {
//     value: 1,
//     label: 'ipx'
//   },
//   {
//     value: 2,
//     label: '星GO'
//   },
//   {
//     value: 4,
//     label: 'YOSHOP'
//   },
//   {
//     value: 8,
//     label: 'YSIA'
//   }
// ]
const couponStatusList = [ // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
  {
    value: 0,
    label: '草稿'
  },
  {
    value: 1,
    label: '审核中'
  },
  {
    value: 2,
    label: '审核不通过'
  },
  {
    value: 3,
    label: '审核通过'
  },
  {
    value: 4,
    label: '未发布'
  },
  {
    value: 5,
    label: '进行中'
  },
  {
    value: 6,
    label: '未开始'
  },
  {
    value: 7,
    label: '已下架'
  },
  {
    value: 8,
    label: '已结束(失效)'
  }
]
export default {
  name: 'couponList',
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
            const { couponId, status } = row
            // 未发布：可修改优惠券所有信息; 进行中、未开始、已下架：只可修改使用说明
            if (status !== 4 && status !== 5 && status !== 6 && status !== 7) return vm.$msgTip('该优惠券不支持编辑操作', 'warning')
            vm.routerLink(`/marketing/ticket/ticketInfo/${couponId}`)
          }
        },
        { // 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: {
            name: 'status',
            toggle: [{
              title: '发布',
              icon: 'el-icon-s-tools',
              value: [0, 4]
            }, {
              title: '上架',
              icon: 'el-icon-s-tools',
              value: [7]
            }, {
              title: '下架',
              icon: 'el-icon-s-tools',
              value: [5, 6]
            }]
          },
          handle(row) {
            const { status, couponId, couponName } = row
            let msgTip, applyType
            switch (status) {
              case 0:
              case 4:
                msgTip = '发布'
                applyType = 5
                break
              case 7:
                msgTip = '上架'
                applyType = 5
                break
              case 5:
              case 6:
                msgTip = '下架'
                applyType = 7
                break
            }
            vm.confirmTip(`是否${msgTip}【${couponName}】优惠券`, () => {
              vm.verifyData({ couponId, applyType, msgTip })
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { couponName, couponId } = row
            vm.confirmTip(`确认删除  ${couponName}  劵信息`, () => {
              vm.deleteData({ couponId })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: 'ID',
          prop: 'couponId',
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
          prop: 'typeName',
          search: {
            type: 'select',
            optionsList: dictObj.ticketTypeList
          }
        },
        {
          label: '卡券内容',
          prop: 'couponRemark',
          search: {
            type: 'select',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '卡券有效期开始时间',
          prop: 'limitExpireTimeStart'
        },
        {
          label: '卡券有效期结束时间',
          prop: 'limitExpireTimeEnd'
        },
        {
          label: '状态', // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: 'status',
          search: {
            optionsList: dictObj.couponStatusList
          },
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, 'couponStatusList')
          }
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '创建人',
          prop: 'opCreator',
          search: {
            prop: 'createBy',
            type: 'input'
          }
        },
        {
          label: '已领取',
          prop: ''
        },
        {
          label: '已使用',
          prop: ''
        }
      ]
    }
  },
  created() {
    this.fetchData()
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
        this.fetchData()
      })
    },
    // 审核劵
    verifyData(params) {
      const { couponId, msgTip, applyType } = params
      this.$api.marketing.applyCoupon({ couponId, applyType }).then(() => {
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
      this.$api.marketing.addCoupon(formModel).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    }
  }
}
</script>
