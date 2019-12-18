<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/marketing/rule/ruleInfo')"
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
import CDialog from 'components/dialog'
// import dictObj from '@/store/dictData'
const receiveTypeList = [ // 领券方式
  {
    label: '系统发券',
    value: 1
  },
  {
    label: '手动领券',
    value: 2
  }
]
export default {
  name: 'ruleList',
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
            const { couponId } = row
            vm.routerLink(`/marketing/rule/ruleInfo/${couponId}`)
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
          label: '规则ID',
          prop: 'couponId',
          width: 100,
          fixed: true
        },
        {
          label: '规则名称',
          prop: 'couponName',
          search: {
            type: 'input'
          }
        },
        {
          label: '领取方式',
          prop: 'receiveType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.receiveType, receiveTypeList)
          }
        },
        // {
        //   label: '已发送',
        //   prop: 'typeName'
        // },
        {
          label: '创建人',
          prop: 'opCreator',
          search: {
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
  mounted() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.marketing
        .getCouponRuleList({
          ...this.searchObj,
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
      this.$api.marketing.deleteCouponRule(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
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
