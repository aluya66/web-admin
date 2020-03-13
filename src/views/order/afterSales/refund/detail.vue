<template>
  <div>
    <el-form
      :inline="true"
      ref="formRef"
      class="dialog-form"
      label-position="left"
    >
      <el-form-item label="单号:">
        {{formModel.refundOrder}}
      </el-form-item>
      <el-form-item label="退款单号:">
        {{formModel.afterOrder}}
      </el-form-item>
      <el-form-item label="状态:">
        {{formModel.status===0?'未退款':'已退款'}}
      </el-form-item>
      <el-form-item label="客户名称:">
        {{formModel.userName}}
      </el-form-item>
      <el-form-item label="客户电话:">
        {{formModel.userPhone}}
      </el-form-item>
        <el-form-item label="退款金额:">
        {{formModel.refundFee}}
      </el-form-item>
      <el-form-item label="退款类型:">
        {{refundAllType[formModel.refundType]}}
      </el-form-item>
      <el-form-item label="售后时间:">
        {{formModel.afterTime}}
      </el-form-item>
    </el-form>
    <p>退款记录：</p>
     <c-table
        ref="cTable"
        hasBorder
        noPage
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="feeRecord"
      />
  </div>
</template>

<script>

import mixinTable from 'mixins/table'
export default {
  mixins: [mixinTable],
  components: {
  },
  props: {
    initData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      refundAllType: {
        1: '余额',
        2: '星GO卡',
        3: '代金券'
      },
      feeRecord: [], // 打款记录
      // 表格内操作按钮
      tableHeader: [
        {
          label: '扣费项目',
          prop: 'typeName'
        },
        {
          label: '退款金额',
          prop: 'money'
        },
        {
          label: '备注',
          prop: 'remark'
        }]
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  created() {
    // 获取打款记录
    this.$api.order.getRefundFeeRecord({ refundOrder: this.formModel.refundOrder })
      .then(res => {
        this.isLoading = false
        if (res && res.data && res.totalCount) {
          this.feeRecord = res.data
        }
      })
  }
}
</script>
