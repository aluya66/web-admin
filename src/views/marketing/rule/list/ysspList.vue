<template>
  <c-view>
    <c-table
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <el-form
          ref="formRef"
          :model="formModel"
          label-width="80px"
          class="form"
          label-position="right"
          status-icon
        >
          <el-form-item prop="couponRemark">
            <el-input
              type="textarea"
              placeholder="请输入备注说明"
              v-model.trim="formModel.couponRemark"
              rows="4"
              maxlength="300"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'

export default {
  name: 'ysspList',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      formModel: {},
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 180,
          name: '备注',
          icon: 'el-icon-edit-outline',
          handle(row) {
            vm.dialogObj = {
              isShow: true,
              title: '备注说明'
            }
            vm.formModel = {
              couponId: row.couponId,
              couponRemark: row.couponRemark
            }
          }
        },
        {
          name: '编辑',
          notBtn: 'status',
          icon: 'el-icon-edit',
          handle(row) {
            const { couponId } = row
            vm.routerLink(`/marketing/rule/ruleInfo/yssp/${couponId}`)
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
            return row && vm.setTableColumnLabel(row.receiveType, 'receiveTypeList')
          }
        },
        // {
        //   label: '已发送',
        //   prop: 'typeName'
        // },
        {
          label: '创建人',
          prop: 'opCreator'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ]
    }
  },
  activated() {
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
      this.$api.marketing.getCouponRuleList({
        ...searchDate,
        ...other,
        ...page,
        platformList: ['yssp']
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
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$api.marketing.addCouponRemark(this.formModel).then(res => {
            this.responeHandle('添加成功')
            this.dialogObj.isShow = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
}
</style>
