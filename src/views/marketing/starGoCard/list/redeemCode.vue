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
        >
          <el-form-item
            prop="couponNumber"
            :rules="{
                type: 'number', trigger: 'change',  message: '请输入数字', required: true
              }"
          >
            <el-input placeholder="请输入要导出兑换码的数量" v-model.number="formModel.couponNumber" maxlength="10" clearable></el-input>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'

export default {
  name: 'redeemCode',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      formModel: {},
      exportLoading: false,
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          name: '导出',
          icon: 'el-icon-download',
          handle(row) {
            vm.dialogObj = {
              isShow: true,
              title: '导出兑换码'
            }
            vm.formModel = {
              couponDetailId: row.couponDetailId,
              couponNumber: ''
            }
          }
        }
      ],
      tableHeader: [
        {
          label: '名称',
          prop: 'couponName',
          width: 100,
          fixed: true
        },
        {
          label: '绑定金额(元)',
          prop: 'faceValue'
        },
        {
          label: '赠送金额(元)',
          prop: 'givingValue'
        },
        {
          label: '兑换码数量',
          prop: 'couponNumber'
        },
        {
          label: '已导出',
          prop: 'issueNumber'
        },
        {
          label: '已绑卡',
          prop: 'receiveNumber'
        },
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
  mounted() {
    this.fetchData()
  },
  methods: {
    dialogConfirm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$api.marketing.exportRedeemCode(this.formModel).then(res => {
            this.responeHandle('导出成功')
            this.dialogObj.isShow = false
            this.$emit('complete-redeemCode-export')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 获取表格数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.marketing.getRedeemCodeList({
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
    exportFile(params) {
      this.$api.marketing.exportRedeemCode(params).then(res => {
        this.exportLoading = false
        if (res) {
          const { data, filename } = res
          if (data && filename) {
            utils.createBlobFile(data, filename)
          } else {
            this.$msgTip('导出数据异常', 'warning')
          }
        } else {
          this.$msgTip('导出数据失败', 'warning')
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
